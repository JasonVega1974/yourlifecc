# Chores → Tables + Realtime — Design Doc

**Status:** DRAFT for review. No code shipped. Per SPEC 11 in `YLCC_EXECUTION_PLAN.md`.
**Author:** SPEC 11 design pass, 2026-06-13.
**Companion artifact (build spec) will be authored AFTER this doc is reviewed and approved.**

This doc specifies the target schema, the migration path off the JSONB blob, the realtime subscription surface, offline behavior, and rollback for the chores + Parent Bucks subsystem. Everything in `D.chores`, `D.choreLog`, `D.selfChores`, `D.helpfulDeeds`, `D.pb.balance`, and `D.pb.log` is in scope. SPEC 8's blob stomp-guard is the bridge; this design is the real fix.

---

## 1. Current state (as of v350, 2026-06-13)

### Authoritative store
`profiles.data` JSONB blob, key paths:
- `D.chores[]` — chore definitions (id, name, emoji, category, pts, difficulty, frequency, active, sort_order)
- `D.choreLog[]` — completion entries `{ choreId, date, status, pts, photoPath? }`
- `D.selfChores[]` — kid-initiated chores pending parent approval
- `D.helpfulDeeds[]` — kid-flagged helpful deeds pending parent approval
- `D.choreBadges{}` — chore-specific badge awards (Increment 5)
- `D.pb = { balance:number, log:[], storeItems:[], spinTickets, scratchTickets }`

### What already exists in Postgres (shipped in chores-schema.sql)
- `public.chores` — text-PK table with `id = 'ch_<profileId>_<n>'`, `user_id`, `profile_id`, full chore schema, RLS per `auth.uid() = user_id`, idempotent upsert path
- `public.chore_completions` — UUID-PK table with `chore_id` FK → chores, `user_id`, `profile_id`, `completed_date`, `status`, `points_awarded`, `photo_url`, `verified_by`, `verified_at`. `UNIQUE(chore_id, completed_date)`. Same RLS pattern.
- Both tables have Data API GRANTs per Oct-30-2026 compliance.

### Dual-write status
`sync.js::_mirrorChoresToCloud(supa, userId)` runs fire-and-forget after every successful `cloudSync()` upsert. JSONB blob remains canonical; the Postgres tables are read-by-nobody-today and exist purely as a parallel write target. Same pattern in `_mirrorMoneyToCloud()` for `D.transactions` → `public.money_transactions`.

### Known issues blocking cloud-prefer reads (carried forward in this doc)
1. **`_solo` → multi-profile transition gap.** Solo-account chores were mirrored with `profile_id='_solo'`. The moment a parent creates real profiles, those rows orphan against the new profile_id. A one-shot per-user backfill must run BEFORE any read path filters by the new profile_id. Gating flag location TBD (proposal: `profiles.data._chores_solo_migrated = ISO` so it cloud-syncs).
2. **Phase 2 PIN → stable-id rework FK timing.** The `chore_completions.chore_id` FK is not DEFERRABLE. A prep migration is required before Phase 2 (option A in `chores-schema.sql` lines 88-101). Not yet shipped.

---

## 2. Target schema — additions to the existing migration

Two new tables are needed for the full fix; the existing two (`chores`, `chore_completions`) stay. Spec wording said "chore_log" — that maps to `chore_completions` (the existing table). The doc reuses the existing name to avoid a rename.

### 2.1 `public.chore_approvals` (NEW)

The pending-approval queue is distinct from `chore_completions` because:
- `chore_completions` rows are tied to a defined chore (`chore_id` FK).
- `selfChores` (kid-invented chores) and `helpfulDeeds` (parent-credited acts of service) have no parent `chore_id` — they're free-text requests.
- Approval can carry a parent note + a counter-offer (different points than the kid asked for).
- Future: approval flow could be invoked by parent push notification, kid push notification, or family chat — separating the table makes the surface explicit.

```sql
create table if not exists public.chore_approvals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  profile_id      text not null default '_solo',           -- the KID's profile
  kind            text not null check (kind in ('chore','self_chore','helpful_deed')),
  chore_id        text references public.chores(id) on delete cascade, -- nullable for self_chore/helpful_deed
  title           text not null,                           -- snapshot at request time
  emoji           text,
  description     text,                                    -- kid's note ("helped vacuum living room")
  requested_pts   int  not null default 0,
  awarded_pts     int,                                     -- nullable until verified
  status          text not null default 'pending'
                  check (status in ('pending','approved','rejected','expired')),
  parent_note     text,                                    -- parent's comment on decision
  photo_url       text,                                    -- proof, when bucket-uploaded
  requested_at    timestamptz not null default now(),
  decided_by      uuid references auth.users(id),
  decided_at      timestamptz
);

create index chore_approvals_user_profile_status_idx
  on public.chore_approvals (user_id, profile_id, status, requested_at desc);

create index chore_approvals_pending_idx
  on public.chore_approvals (user_id, status)
  where status = 'pending';                                -- partial index for parent badge query
```

On parent approval:
1. Insert/update the `chore_approvals` row → `status='approved'`, `awarded_pts`, `decided_by`, `decided_at`.
2. Insert a `chore_completions` row (if `chore_id` present) so streak/leaderboard logic stays canonical.
3. Insert a `pb_ledger` row crediting `awarded_pts`.
   All three happen in a single edge-function transaction (see §4.3).

### 2.2 `public.pb_ledger` (NEW)

Parent Bucks is currently a `balance` integer with a free-form `log[]` array. Moving to an append-only ledger:
- gives audit ("where did the 80 PB go?")
- enables family-wide reconciliation
- makes balance a derived `sum(amount)` query rather than a denormalized field
- removes the bug class of "two devices both decrement balance by 50, server arrives at -50 instead of -100" (the stomp-guard mitigates this for now but cannot fully prevent integer arithmetic races)

```sql
create table if not exists public.pb_ledger (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  profile_id      text not null default '_solo',           -- the KID who earned/spent
  amount          int  not null,                           -- positive = credit, negative = debit
  reason          text not null check (reason in (
                    'chore_verified',
                    'self_chore_approved',
                    'helpful_deed_approved',
                    'badge_bonus',
                    'contest_payout',
                    'store_redemption',
                    'spinner_buy',
                    'scratch_buy',
                    'parent_adjustment',
                    'starting_grant'
                  )),
  source_id       text,                                    -- FK-ish: completion uuid, approval uuid, store_item id, etc.
  source_table    text,                                    -- 'chore_completions' | 'chore_approvals' | 'store_items' | null
  note            text,                                    -- "Mom credited 20 for extra effort"
  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now()
);

create index pb_ledger_user_profile_created_idx
  on public.pb_ledger (user_id, profile_id, created_at desc);
```

Balance lookup:
```sql
select coalesce(sum(amount), 0) as balance
  from public.pb_ledger
 where user_id = auth.uid() and profile_id = $1;
```

Could be wrapped in a `pb_balance(user_id uuid, profile_id text)` SQL function or a materialized view if the ledger grows to >10k rows per family. For v1, the per-profile sum is cheap on the composite index.

### 2.3 No schema change needed for
- `D.choreBadges{}` — fits as a JSONB column on a future `chore_progress` table OR stays on `profiles.data` indefinitely (per-user, never multi-device-contested). Defer.
- `D.pb.storeItems[]`, `D.pb.spinTickets`, `D.pb.scratchTickets` — these are family-scoped catalog/inventory, not transaction history. They can stay on the blob or get their own tiny `store_items` / `tickets` tables in a later spec. Defer.
- `D.customContests[]` — already its own thing; out of scope here.

---

## 3. RLS per family

**Definition of "family" in YourLife CC:** one Supabase `auth.users` row hosts the whole family. Multiple kids = `_profiles[]` array inside `profiles.data`, distinguished by `profile_id` column (4-digit PIN or `_solo`). There is NO separate auth user per kid.

This means **per-family RLS = per-user_id RLS** — the simple `auth.uid() = user_id` pattern that the existing tables already use. No JOIN against a `family_members` table, no per-kid auth.

| Table | Policy |
|---|---|
| `chores` | `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE (already shipped) |
| `chore_completions` | `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE (already shipped) |
| `chore_approvals` | `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE |
| `pb_ledger` | `auth.uid() = user_id` for SELECT/INSERT. **UPDATE and DELETE are NOT granted on the ledger** — append-only invariant. Corrections happen via compensating entries (`parent_adjustment`). |

**Multi-tenancy reading note:** filter-side `WHERE profile_id = $1` is the app's responsibility (RLS doesn't enforce it). Per the existing migration, this is acceptable for v1 because the kids don't have their own auth — they're inside the parent's session via Parent Hub drill-down. When/if kids get their own auth (future spec), `profile_id` would need policy-level enforcement against a `family_members(auth_user_id, profile_id)` lookup table.

### Service-role write path for approvals (recommended)

Parent-approval transactions touch three tables atomically (approval status update + completion insert + ledger credit). Two options:

- **Option A — client-side transaction.** Three sequential `supa.from(...).upsert/insert` calls. PostgREST doesn't support multi-statement transactions, so partial failure (network blip after step 2) leaves the system inconsistent. Not viable.
- **Option B (recommended) — edge function.** `POST /api/chore-approve` invokes a service-role Postgres function `chore_approve(approval_id uuid)` that runs the three writes in a SQL transaction. Returns the new balance. Idempotent on `approval_id` so retries are safe.

Build spec should pick B.

---

## 4. Migration strategy

Three phases, each a separate build spec. Each ships independently and is rollback-safe.

### 4.1 Phase A — solo→profile backfill prep (NO new tables)

**Goal:** Unblock #1 in §1 (solo `_solo` orphans) before any cloud-prefer read path exists.

1. **Add gating flag** on `profiles.data._chores_solo_migrated` (ISO date string, default `''`). Lives in the blob, cloud-syncs naturally.
2. **One-shot per-user migration in `parent.js`**, triggered when the first non-empty `_profiles[]` is committed:
   - Identify the parent-self profile's stable id (post-PIN-decouple from Phase 1).
   - Rewrite `public.chores` and `public.chore_completions` `profile_id = '_solo'` rows to the new parent stable id.
   - Rewrite `id`/`chore_id` `'ch__solo_*'` prefixes to `'ch_<newId>_*'`.
   - Stamp `_chores_solo_migrated = now()`.
3. **Phase 2 FK prep migration.** Apply option A from `chores-schema.sql:88-101` — `chore_completions_chore_id_fkey` becomes DEFERRABLE INITIALLY IMMEDIATE so the per-user transaction in step 2.3 can defer it. This is a separate SQL migration file (`docs/migrations/chores-fk-deferrable.sql`).

**Acceptance:** running the per-user migration twice is idempotent; a fresh signup never hits `_solo` rows; an existing solo→multi-profile transition no longer orphans.

**Reversibility:** the rewrites are reversible — the prefix mapping is deterministic both directions.

### 4.2 Phase B — add new tables + dual-write (no read flip yet)

**Goal:** ship `chore_approvals` + `pb_ledger` + their dual-write paths. Blob stays canonical.

1. **New migration** `docs/migrations/chore-approvals-and-pb-ledger.sql`:
   - Both tables per §2.1 and §2.2.
   - RLS policies per §3.
   - Data API GRANTs.
   - `chore_approve(approval_id uuid)` SQL function with `SECURITY DEFINER`, service-role-only invocation (caller verified by edge function).
2. **Extend `_mirrorChoresToCloud`** in sync.js:
   - On every cloudSync, mirror `D.selfChores` → `chore_approvals` (kind='self_chore').
   - On every cloudSync, mirror `D.helpfulDeeds` → `chore_approvals` (kind='helpful_deed').
   - For every `D.choreLog` entry with `status='pending'`, ensure a matching `chore_approvals` row exists (kind='chore', chore_id set).
   - On every PB balance delta event (chore verified, item redeemed, ticket bought), append a `pb_ledger` row. Source the delta from the blob's `pb.log[]` if present; otherwise compute from the verifier path.
3. **No read changes.** UI continues to read from D.* blob fields.

**Acceptance:** after one cloudSync, the two new tables contain a complete shadow of the blob's approval queue and PB history. SELECT counts match. No UI regression.

**Reversibility:** drop the new tables; the blob is untouched.

### 4.3 Phase C — flip reads onto tables + realtime

**Goal:** the tables become the source of truth for chores, completions, approvals, and PB.

Strict prerequisite checklist:
- Phase A migration shipped + run for every existing user.
- Phase B tables populated and parity-verified for every user.
- An admin SQL spot-check confirms `sum(amount) from pb_ledger group by user_id, profile_id` matches `D.pb.balance` for a sample of 20 users (auto-script: `scripts/pb_parity_check.py`).

Implementation (one increment per surface — do NOT batch):

0. **Increment C0 — Chore streak read-path migration.** **HARD PREREQ for C5.** Verified 2026-06-13: the chore streak engine is blob-backed. `_choreStreakStats()` in `chores.js:1264` walks `D.choreLog` and caches the result on `D.choreStreak`. Six read sites consume `D.choreStreak.current` (`chores.js:1444, 1642, 1650, 1658`, `parent.js:642, 3858`). The existing `public.chore_streaks` table is a fire-and-forget write-only mirror; nothing reads from it today. (Note: `streaks-engine.sql` / `streaks.js` are the FAITH devotional streak — unrelated.) Plan:
   - Author a Postgres SQL function `compute_chore_streak(p_user_id uuid, p_profile_id text)` returning `(current int, longest int, total int, last date)` that scans `public.chore_completions` for distinct verified dates per profile.
   - Have the `chore_approve()` edge function (Phase B / §4.3 #4) also UPDATE `public.chore_streaks` in the same transaction, calling `compute_chore_streak`.
   - Flip the six read sites to read `public.chore_streaks` (cached in-memory per session; invalidate on realtime `chore_completions` INSERT for that profile).
   - Keep `_choreStreakStats()` blob-walker as the offline fallback.
   **Without C0, Phase C5 would zero every kid's chore streak the moment blob writes stop**, because the read sites would be querying a no-longer-updated cache field.
1. **Increment C1 — Parent Hub approval badge.** Switch `_phPendingApprovalCount()` to query `chore_approvals` count (status='pending') instead of summing blob arrays. Add realtime subscription (§5.1). Keep blob fallback for offline reads.
2. **Increment C2 — Chores list + history.** Switch `renderChores()` and the History sub-tab to query `chores` + `chore_completions` instead of `D.chores`/`D.choreLog`. Keep blob writes for safety until C5.
3. **Increment C3 — Parent Bucks balance.** Switch `D.pb.balance` reads to `select sum(amount) from pb_ledger`. Cache the balance in-memory per session to avoid sub-query on every render; invalidate on realtime ledger insert.
4. **Increment C4 — Approval edge function.** Move parent-approval writes through `/api/chore-approve` (atomic 3-write txn). Remove the dual-write code path for the approval flow.
5. **Increment C5 — Stop blob writes.** `D.chores`, `D.choreLog`, `D.selfChores`, `D.helpfulDeeds`, `D.pb.balance`, `D.pb.log` become read-only-from-DB. The blob fields can be lazily zeroed on next cloudSync; for a defensive grace period, keep them as a shadow for 30 days, then prune.

**Acceptance per increment:** UI behaves identically to before; network tab shows the new query path; realtime updates fire within 1s of the other device's write.

**Reversibility:** each increment can be reverted by flipping a `D.useDbReads` flag (gated in code). Phase C ships behind that flag, defaulted off in the first deploy, then flipped on per-user via a server-driven flag after a 24-48h soak.

---

## 5. Realtime subscription points

Supabase Realtime via `supabase-js`. All subscriptions are scoped to `user_id = auth.uid()` via Postgres-side RLS filter; clients receive only their own rows. The RLS filter has been validated to apply on Realtime since Supabase v2.

### 5.1 Parent approval badge (Increment C1)

**Subscription target:** `chore_approvals` INSERTs and UPDATEs where status='pending' becomes another status.

```js
const channel = supa.channel('phApprovals')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'chore_approvals',
    filter: `user_id=eq.${_supaUser.id}`
  }, payload => {
    if(payload.eventType === 'INSERT' && payload.new.status === 'pending') _phBumpApprovalBadge(+1);
    if(payload.eventType === 'UPDATE' && payload.old.status === 'pending' && payload.new.status !== 'pending') _phBumpApprovalBadge(-1);
  })
  .subscribe();
```

Mount on app-load when `_supaUser` is set; tear down on sign-out.

### 5.2 Kid completion toast → Parent (Increment C2)

**Subscription target:** `chore_completions` INSERT with `status='pending'` and `verified_by IS NULL`. Fires a transient toast on the parent's device ("Lily marked 'unload dishwasher' done — 10 PB").

```js
.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'chore_completions',
  filter: `user_id=eq.${_supaUser.id}`
}, payload => {
  if(payload.new.status === 'pending' && _isParentSession()) showCompletionToast(payload.new);
});
```

### 5.3 Approval result → Kid (Increment C2)

**Subscription target:** `chore_completions` UPDATE where status flips to 'verified' or 'rejected'. Drives the kid's celebration FX + balance refresh.

```js
.on('postgres_changes', {
  event: 'UPDATE',
  schema: 'public',
  table: 'chore_completions',
  filter: `user_id=eq.${_supaUser.id}`
}, payload => {
  if(payload.old.status === 'pending') {
    if(payload.new.status === 'verified') triggerCelebrationFor(payload.new);
    if(payload.new.status === 'rejected') showRejectionToast(payload.new);
  }
});
```

### 5.4 PB ledger → balance refresh (Increment C3)

**Subscription target:** `pb_ledger` INSERT (table is append-only — no UPDATE/DELETE event class).

```js
.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'pb_ledger',
  filter: `user_id=eq.${_supaUser.id}`
}, payload => {
  _pbBalanceCacheInvalidate(payload.new.profile_id);
  _renderAllPBBalances();
});
```

### 5.5 Connection management

- One `supa.channel('chores')` per session, multiplexing all four `postgres_changes` listeners.
- On `CHANNEL_ERROR` or `TIMED_OUT`: exponential backoff retry (1s → 2s → 4s → 8s, cap 30s).
- On sign-out / tab close: `supa.removeChannel(channel)`.
- Heartbeat ping every 30s by supabase-js default.

---

## 6. Offline behavior

The PWA must keep working when the network drops mid-action (kid in basement, parent on plane).

### 6.1 Write path while offline

**Optimistic write to the blob FIRST, then queue the DB write.**

1. UI handler updates `D.*` and `localStorage` synchronously (current behavior, unchanged from today).
2. The DB write is queued in a `D.dbWriteQueue[]` (new field). Each entry: `{ id:uuid, table, op, payload, attempts:0, queuedAt }`.
3. The existing `save()` debounce calls `cloudSync()`, which now also drains `D.dbWriteQueue` (one write per entry, retried up to 5 times with backoff). Successful drains remove the entry.
4. On successful drain, the realtime subscription will echo the same row back; the echo handler is idempotent (no-op if the data already matches).

### 6.2 Read path while offline

Tables become unreachable, but the existing blob fields are still hydrated from the last successful `cloudLoad`. The UI falls back to blob reads when a query throws.

Wrap every cloud query in:
```js
async function _coreadChores(){
  try {
    const { data, error } = await supa.from('chores').select('*').eq('user_id', _supaUser.id);
    if(error) throw error;
    return data;
  } catch(_){
    return Array.isArray(D.chores) ? D.chores : [];   // fallback
  }
}
```

### 6.3 Pending writes survive a crash / reload

Because `D.dbWriteQueue` is part of the blob, it persists in `localStorage` and cloud-syncs along with everything else. On next app boot with network, the queue drains.

### 6.4 Conflict handling on drain

A queued write may race a different device's later edit. The strategy:
- INSERTs to append-only tables (`pb_ledger`, new `chore_completions`) — always safe to apply; no conflict.
- UPDATEs to mutable rows (`chores`, `chore_approvals` status) — use UPSERT with `onConflict: 'id'`. Last write wins per-row; SPEC 8's per-key merge does NOT apply here since these are individual row operations, not blob fields.
- The edge function `chore_approve()` is idempotent on `approval_id`, so a kid re-syncing after a parent already approved their item is a no-op.

---

## 7. Rollback plan

Each phase rolls back independently.

### Phase A rollback
- Revert the parent.js commit; flip `_chores_solo_migrated` flag (per-user manual reset acceptable since the volume is small).
- The DB rewrites are reversible: a reverse-mapping script reads `_chores_solo_migrated` users and rewrites `ch_<stableId>_*` back to `ch__solo_*`. Ship the reverse script as `docs/migrations/scripts/chores-solo-rollback.sql` alongside Phase A.

### Phase B rollback
- Drop `chore_approvals` and `pb_ledger`.
- Drop the `chore_approve()` function.
- Revert sync.js mirror extensions.
- Blob is untouched throughout Phase B, so UI keeps working with zero data loss.

### Phase C rollback
- Each increment is gated by a per-user `D.useDbReads.<feature>` boolean (true/false) and code checks the flag on every read. Flipping the flag back to false reverts the read path; blob writes were never stopped until C5, so data is intact.
- C5 specifically (stop-blob-writes) is the point of no easy return for that subsystem. Before shipping C5, run a 30-day shadow-write parity check (`scripts/blob_db_parity.py`) on every Pro user.

---

## 8. Open questions for review

1. **Spec wording vs reality.** The spec says "chore_log" but the live table is `chore_completions`. Confirm we keep `chore_completions` (no rename).
   **Decision (2026-06-13):** **KEEP `chore_completions`.** No rename. The spec wording "chore_log" was incorrect — the live table has always been `chore_completions` per `docs/migrations/chores-schema.sql`. All build-spec docs reference the live name.
2. **`pb_ledger` denormalization.** Should `pb_ledger` carry a denormalized `running_balance` column written by a trigger, for cheap "show last 10 with balance after each" history views? Or compute on the fly (cheaper at write, slower at read)?
   **Decision (2026-06-13):** **COMPUTE ON THE FLY.** No `running_balance` column, no trigger. Balance is `select sum(amount) from pb_ledger where user_id = auth.uid() and profile_id = $1` — cheap on the composite index for the projected volume (Q4). If a "ledger history with balance-after-each" view ever ships and shows query latency in production, revisit then with a windowed query or a materialized view.
3. **Family member auth (future).** This design assumes one auth user. If we ever ship per-kid auth (the natural endpoint of the multi-profile system), `profile_id` filtering needs to move into RLS via a `family_members(auth_user_id, profile_id)` table. Worth designing the policies now even if we don't ship them, so the v1 policies are forward-compatible?
   **Decision (2026-06-13):** **NOTE THE FORWARD-COMPAT FORM, DO NOT SHIP IN v1.** Document the future `family_members(auth_user_id, profile_id)` lookup table and the RLS policy form it would take (e.g., `using (exists (select 1 from family_members fm where fm.auth_user_id = auth.uid() and fm.profile_id = chore_approvals.profile_id))`). v1 RLS ships on the simple `auth.uid() = user_id` pattern. When per-kid auth ships (no roadmap entry today), the v1 policies can be replaced via non-breaking `ALTER POLICY` calls.
4. **PB ledger volume.** A heavy family does maybe 10 chores/day × 5 kids × 365 days = ~18k rows/year. The composite index handles it for ~5 years before we'd want to think about partitioning. Note this in the doc and move on?
   **Decision (2026-06-13):** **NOTE, NO PARTITIONING.** Projected ~18k rows/year per heavy family is well within the composite index's comfort zone for 5+ years. No partition strategy in v1. Document the projection so future operators have a number to compare against when reviewing slow queries.
5. **Streak-engine interaction.** `streaks-engine.sql` already exists. Confirm the streak counter reads from `chore_completions` and not `D.choreLog`, OR add a Phase C0 increment to migrate it. The doc currently assumes the streak engine is already DB-backed — verify.
   **Decision (2026-06-13):** **VERIFIED BLOB-BACKED.** `streaks-engine.sql` / `streaks.js` are for FAITH devotional streaks, not chores — false lead on the spec name. The CHORE streak read path is `_choreStreakStats()` in `chores.js:1264` walking `D.choreLog` → cached at `D.choreStreak`. The existing `public.chore_streaks` table is a fire-and-forget write-only mirror; nothing reads from it. **Phase C0 added to §4.3** to migrate the read path (Postgres `compute_chore_streak()` function + `public.chore_streaks` reads). Must ship BEFORE C5 or kids' streaks zero out.
6. **Realtime cost.** Supabase Pro tier includes 200 concurrent realtime connections; one per active session. At 1000 simultaneous-user scale, fine. Plan-tier impact noted for future scaling.
   **Decision (2026-06-13):** **NOTE THE TIER CEILING.** Supabase Pro tier = 200 concurrent realtime connections. At ~1000 simultaneous active users we'd hit the limit — multi-year scale concern, not a v1 blocker. Document the threshold for ops awareness; revisit when DAU crosses ~500.
7. **Edge function `chore_approve()` — Postgres function vs Vercel function.** SQL function (`SECURITY DEFINER`, run inside Postgres) is faster and cheaper. Vercel function (Node, calls Postgres) is more debuggable. Default proposal: Postgres function, called from a thin Vercel wrapper `api/chore-approve.js` that just authenticates the parent and forwards `approval_id` to `supa.rpc('chore_approve', ...)`. Confirm?
   **Decision (2026-06-13):** **POSTGRES `SECURITY DEFINER` FUNCTION + thin Vercel auth wrapper.** Implement `chore_approve(approval_id uuid)` as a Postgres function with `SECURITY DEFINER` that runs the three writes (approval row update + completion insert + ledger credit + Phase C0 chore_streaks recompute) atomically. Expose via `api/chore-approve.js` (Vercel Function) that verifies the caller is an authenticated parent on this `user_id`, then RPCs into `supa.rpc('chore_approve', { approval_id })`. Fast, atomic, debuggable boundary at the Vercel function.
8. **PB store / spinner / scratch tickets — defer or include?** Currently the doc defers them. If you want one-spec-completes-the-chores-subsystem, add a `store_items` and `tickets` table to Phase B. If you want the smallest possible first ship, keep the deferral.
   **Decision (2026-06-13):** **DEFER to a later spec.** Phase B ships only the `chores → approvals → ledger` spine. `D.pb.storeItems[]`, `D.pb.spinTickets`, `D.pb.scratchTickets` stay on the blob and migrate in a follow-up spec once the spine has soaked in production. Keeps the first ship's surface area minimal and the parity-check easier to reason about.

---

## 9. Out of scope (explicit)

- Per-kid auth users (handled by a future spec, not this one).
- Cross-family leaderboards / friend system (no roadmap entry).
- Habit tracker → tables (separate doc, separate spec — `habits-schema.sql` already exists).
- Money transactions → tables (`money-transactions-schema.sql` already shipped and uses the same dual-write pattern; this design is the template for that migration's eventual cloud-prefer flip).
- Behavior log (`D.behaviorLog`) → tables. Lives on the blob for now; the same pattern can apply later.
- Photo proof bucket (`chore-proofs-bucket.sql`) — already shipped; no change.

---

## 10. Pre-requisites before any build spec

The build spec must NOT be written until each of these is checked off:

- [x] Open question #1 (chore_completions naming) — **confirmed 2026-06-13: keep `chore_completions`.**
- [x] Open question #5 (streak engine read path) — **verified 2026-06-13: chore streak is BLOB-BACKED. Phase C0 added to §4.3.**
- [x] Open question #7 (Postgres function vs Vercel function for approval) — **decided 2026-06-13: Postgres SECURITY DEFINER + thin Vercel auth wrapper.**
- [x] Open question #8 (PB store/tickets scope) — **decided 2026-06-13: defer to a later spec, chores→approvals→ledger spine only.**
- [x] Open question #2 (pb_ledger running_balance) — **decided 2026-06-13: compute on the fly, no trigger.**
- [x] Open question #3 (family_members forward-compat) — **decided 2026-06-13: note the future form, do not ship in v1.**
- [x] Open question #4 (PB ledger volume) — **decided 2026-06-13: note ~18k rows/year/family, no partitioning in v1.**
- [x] Open question #6 (realtime tier ceiling) — **decided 2026-06-13: note 200-connection Pro ceiling, revisit at ~500 DAU.**
- [ ] Phase A migration scripted in full and dry-run on a snapshot of production.
- [ ] Parity check script (`scripts/pb_parity_check.py`) drafted (does NOT need to be shipped — the script is gating only for Phase C readiness).
- [ ] Phase C feature flag mechanism agreed (`D.useDbReads.<feature>` or a server-side variant via `profiles.data._feature_flags`).

Once all eight checkboxes are green, the build spec sequence is:

1. **SPEC 11-A:** ship the solo-backfill migration + Phase 2 FK prep.
2. **SPEC 11-B:** ship `chore_approvals` + `pb_ledger` + dual-write extensions.
3. **SPEC 11-C1..C5:** five increments, each its own commit, gated by the read-flip flag.

---

**End of design doc. Review and steer.**
