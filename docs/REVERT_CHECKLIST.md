# REVERT_CHECKLIST — Re-enable public signup (Phase 4)

Purpose: precise, ordered steps to turn public signup back ON after the private-beta lock. Mirror at the bottom: how to re-disable if Phase 4 needs to be rolled back.

Status as of 2026-05-11: **NOT YET EXECUTED.** This is the playbook, not a record.

---

## 0. Prerequisites (verify BEFORE editing any files)

These are external — confirm each one before touching code. Code is the cheap part; these are the load-bearing ones.

1. **Brevo activation-CTA click tracking is OFF.**
   - The activation email is sent by Supabase Auth via Brevo SMTP. Click tracking is a Brevo sender-domain / template setting, not a code flag in this repo.
   - Verify by: trigger a real test signup (using the procedure in §3.1), open the received activation email in a webmail client, hover the "Activate" button, confirm the URL is the raw `https://yourlifecc.com/activate.html#...` and NOT a Brevo redirect domain (`r.brevomail.com`, `track.brevo.com`, etc.).
   - If still rewritten: log in to Brevo → Senders & IP → click-tracking → disable for the relevant sender domain. Re-test before proceeding.

2. **Welcome-email path is healthy.**
   - `docs/stripe-webhook-current.ts:259` shows `trackClicks: false` is already applied in the deployed Supabase Edge Function for `sendWelcomeEmail`. Confirm with a Stripe test charge that the welcome email arrives with non-rewritten URLs.

3. **`register.html` is reachable and functional.**
   - File exists at repo root (verified 2026-05-11). The signup form calls `_sb.auth.signUp` at line 526. Confirm it still loads at `https://yourlifecc.com/register.html` (Vercel may have cached a redirect or 404 rule — unlikely but worth a 10-second curl check).

4. **`activate.html` resend flow has been smoke-tested.**
   - End-to-end: sign up with a throwaway email → wait for activation link to expire (or hit it twice) → land on the expired-link error UI → enter email → click Resend → receive a fresh activation email → activate successfully. Confirm before opening the gates to real users.

5. **Service-worker cache plan.**
   - Bump `CACHE_NAME` in `/service-worker.js` (currently `yourlifecc-v25`). Phase 4 deploy → `v26` or whatever comes next. Without this, returning visitors will see the cached private-beta version of `login.html` until their SW refreshes.

---

## 1. Files to revert

Exact edit list. Each is a small, mechanical change. No JS logic edits needed — the signup functions in `app/js/auth.js:61` and `register.html:526` are still wired up.

### 1.1 `login.html` — two uncomments

**Top-bar signup link (lines 69–71):**

Replace:
```html
  <!-- Public signup temporarily disabled — see REVERT_CHECKLIST. Original:
       Don't have an account? <a href="register.html">Sign up free</a> -->
  <div style="font-size:.82rem;color:var(--tx2);">Private beta — email <a href="mailto:info@kingdom-creatives.com?subject=YourLife%20CC%20Access%20Request">info@kingdom-creatives.com</a> for access.</div>
```

with:
```html
  <div style="font-size:.82rem;color:var(--tx2);">Don't have an account? <a href="register.html">Sign up free</a></div>
```

**In-form "New here?" link (lines 99–101):**

Replace:
```html
        <!-- Public signup temporarily disabled — see REVERT_CHECKLIST. Original:
             New here? <a href="register.html">Create a free account</a> -->
        <div style="text-align:center;font-size:.82rem;color:var(--tx2);line-height:1.55;">New here? We're in private beta. Email <a href="mailto:info@kingdom-creatives.com?subject=YourLife%20CC%20Access%20Request">info@kingdom-creatives.com</a> to request access.</div>
```

with:
```html
        <div style="text-align:center;font-size:.82rem;color:var(--tx2);line-height:1.55;">New here? <a href="register.html">Create a free account</a></div>
```

### 1.2 `guarantee.html` — bottom CTA bar (lines 195–202)

Replace:
```html
  <!-- Public signup temporarily disabled — see REVERT_CHECKLIST. Original CTA pointed
       to /#pricing which now shows a private beta notice. Direct request flow goes
       to mailto for now. -->
  <div class="cta-bar">
    <p>We're in private beta. Email us to request access — the same money-back guarantee will apply when we open back up.</p>
    <a href="mailto:info@kingdom-creatives.com?subject=YourLife%20CC%20Access%20Request" class="btn bp">Email to Request Access →</a>
    <a href="/terms.html" class="btn bo">Read Full Terms</a>
  </div>
```

with:
```html
  <div class="cta-bar">
    <p>Ready to start? Pick a plan — your 30-day guarantee starts the moment you do.</p>
    <a href="/#pricing" class="btn bp">See Plans &amp; Pricing →</a>
    <a href="/terms.html" class="btn bo">Read Full Terms</a>
  </div>
```

### 1.3 `app-bridge.html` — in-app upgrade modal (lines 149–166)

The `showUpgradePrompt()` modal currently routes upgrade clicks to mailto. Re-point to `register.html?plan=<key>` or, more likely, directly to `confirm.html?plan=<key>` (which is the active Stripe-checkout bridge).

Replace the comment + modal body:
```javascript
    // Upgrade flow temporarily routed to mailto while Brevo/Supabase email-link
     // issue is being fixed. Original buttons linked to ../register.html?plan=... — see REVERT_CHECKLIST.
    modal.innerHTML = `
      <div style="background:#0c1220;border:1px solid rgba(56,189,248,.2);border-radius:18px;max-width:420px;width:100%;padding:2rem;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:.6rem;">🚀</div>
        <div style="font-family:var(--fh,sans-serif);font-size:1.3rem;font-weight:900;margin-bottom:.4rem;">Unlock Everything</div>
        <div style="font-size:.82rem;color:#8fa3bf;margin-bottom:1.5rem;line-height:1.6;">We're in private beta. Email us with the plan you want and your account email — we'll set you up directly.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:1.2rem;">
          <a href="mailto:info@kingdom-creatives.com?subject=YourLife%20CC%20Upgrade%20%E2%80%94%20Monthly%20(Family%20${_familyId})" ...>
            ...Monthly $9.99/mo...
          </a>
          <a href="mailto:info@kingdom-creatives.com?subject=YourLife%20CC%20Upgrade%20%E2%80%94%20Lifetime%20(Family%20${_familyId})" ...>
            ...Lifetime $149 once...
          </a>
        </div>
        ...Maybe Later...
      </div>`;
```

Restore the original behavior — direct links to `../confirm.html?plan=monthly` and `../confirm.html?plan=lifetime` (the plan-confirmation page, which routes to Stripe). The upgrade body copy should also change from "We're in private beta..." back to something like "Pick a plan to unlock all sections."

(Exact original markup not captured in this snapshot — reconstruct from the surrounding pricing-card markup in `index.html` lines 980–1040 OR pull from git history with `git log -p -- app-bridge.html` and find the commit immediately before the mailto introduction.)

### 1.4 `index.html` (marketing) — pricing-section CTAs

The marketing page's pricing section currently has multiple "Join the Waitlist →" mailto CTAs. Locations:

| Line | Element |
|---|---|
| 558 | Top-of-pricing CTA `<a href="mailto:..." class="btn bp">Join the Waitlist →</a>` |
| 731 | Inside `closeFeatModal` feature modal |
| 998, 1016, 1036 | The three `.pc6-btn` plan buttons in the 6-card pricing grid |
| 1528 | Feature-comparison closer CTA |

Each needs to become an active link to `confirm.html?plan=<key>` (or `register.html?plan=<key>` if the original flow was register-then-stripe). Match the plan key to the card:
- Monthly card → `confirm.html?plan=monthly`
- Yearly card → `confirm.html?plan=yearly`
- Lifetime card → `confirm.html?plan=lifetime`
- Church / sponsor variants → `confirm.html?plan=church1` / `church2` / `church3` / `sponsor1` / `sponsor2` / `sponsor3`

(See `confirm.html` lines 152–243 for the canonical plan-key list.)

**Important:** the top-of-pricing CTAs (lines 558, 731, 1528) may not be plan-specific — they were likely "See Plans →" buttons pointing to `#pricing` anchor or to a primary plan (monthly). Reconstruct from intent.

---

## 2. Other touch-ups

### 2.1 Service worker

Bump `CACHE_NAME` in `/service-worker.js` (currently `'yourlifecc-v25'`). Increment to next version. This forces returning visitors to fetch the updated `login.html`, `guarantee.html`, `app-bridge.html`, and `index.html` instead of the cached private-beta versions.

### 2.2 Optional copy review

The hero/landing copy in `index.html` may have language tuned for the beta state ("Lock In Now →" countdown framing, "Early Access Pricing — Ends at Launch" badges at lines 637, 1114). Decide whether to keep, soften, or remove these for the post-launch phase. Not a blocker — leave for a follow-up if time-constrained.

### 2.3 Sitemap

`sitemap.xml:22` already declares `https://yourlifecc.com/register.html` — no edit needed.

### 2.4 Top-bar / nav

Verify the marketing page's top-nav and mobile nav don't have a "Sign Up" link that was removed and needs re-adding. (Quick grep before deploy: `grep -n "Sign Up\|Sign up" index.html` — if zero matches, the beta lock removed it; add one if so.)

---

## 3. Smoke test plan (mandatory before announcing)

Run these IN ORDER against the deployed site, NOT a preview branch — service-worker behavior differs.

### 3.1 Fresh signup → activation → set password → app

1. Use a throwaway email you control (Gmail `+` aliasing works: `you+phase4test1@gmail.com`).
2. From `login.html`, click "Sign up free" (top bar) → lands on `register.html`.
3. Complete the form, submit.
4. Verify activation email arrives within 60s.
5. **Hover the activation CTA before clicking.** Confirm the URL is `https://yourlifecc.com/activate.html#access_token=...`, NOT a Brevo redirect. If it IS a Brevo redirect, STOP — go back to §0.1.
6. Click → lands on `activate.html` → confirms session → routes to `set-password.html?activated=1`.
7. Set password → routes into `/app/`.
8. Verify the app loads correctly and the user is signed in.

### 3.2 Resend flow

1. Sign up with a second throwaway email.
2. Either: hit the activation link twice (second click = expired token error), OR wait ~24h for natural expiry.
3. Land on the expired-link error UI at `activate.html`.
4. Verify email pre-fill works (from `ylcc_last_signup_email` localStorage).
5. Click Resend → status should flip to "Sent! Check your inbox…".
6. Confirm new activation email arrives.
7. Activate using the new link → completes successfully.

### 3.3 In-app upgrade modal

1. Sign in as an existing free-tier user.
2. Trigger `showUpgradePrompt()` via the UI path that calls it (likely a "Upgrade" button somewhere in `/app/`).
3. Click each plan button → should land on `confirm.html?plan=<key>` (or whatever the restored target is), NOT a mailto.

### 3.4 Marketing-page pricing CTAs

1. Open `https://yourlifecc.com/` in an incognito window.
2. Click every former-waitlist CTA: top of pricing section, each of the 6 plan-card buttons, the feature-comparison closer.
3. Each should land on the appropriate `confirm.html?plan=<key>`.

### 3.5 Guarantee page CTA

1. Open `/guarantee.html` → confirm bottom CTA now reads "See Plans & Pricing →" linking to `/#pricing`, not mailto.

---

## 4. Rollback steps (if Phase 4 needs to be undone)

If the activation email is still routed through click tracking, or the signup volume spikes problems before fixes are stable, revert by re-applying the beta lock.

### 4.1 Files to revert

For each file in §1, swap the active markup back to the commented-out form. The git commit that opened the gates should contain the exact previous content — `git show HEAD~1 -- login.html guarantee.html app-bridge.html index.html` will surface it. If that's awkward, the commit messages around Phase 4 should be `Phase 4 — re-enable public signup` (or similar) — the commit immediately before it is the rollback target.

### 4.2 Faster rollback (no code revert)

If a full revert is too slow, a 2-line hot-patch in `login.html` is enough to stop new public signups:

- Comment out (or delete) the two restored signup links — that alone removes the public entry path.
- `register.html` and the JS signup function can stay live; they just become unreachable from the public site.
- Marketing-page pricing CTAs can keep pointing to `confirm.html?plan=<key>` — that flow requires Stripe checkout, which is a separate gate (you can pause it from the Stripe dashboard by deactivating the payment links).

### 4.3 Brevo / external systems

- If activation emails are causing the problem, disable the Supabase Auth email template temporarily (Auth → Email Templates → Confirmation) so no new emails go out.
- If Stripe checkout is the problem, deactivate the payment links from `confirm.html` directly in the Stripe dashboard (Payment Links → toggle off). Existing customers and renewals are unaffected.

### 4.4 Bump cache

Bump `CACHE_NAME` again on rollback so the reverted markup ships immediately to returning visitors.

### 4.5 Communication

- The mailto-to-`info@kingdom-creatives.com` flow IS the rollback CTA. Reconfirm the inbox is monitored.
- If users have signed up during the live window but are blocked by a rollback, they keep their accounts — only the public entry path closes.

---

## 5. Verification checklist (after Phase 4 deploy)

- [ ] Prerequisites §0 all green (Brevo trackClicks off on activation, welcome email healthy, register.html reachable, resend flow tested, SW bumped)
- [ ] §1.1 login.html — both uncomments applied
- [ ] §1.2 guarantee.html — CTA bar reverted
- [ ] §1.3 app-bridge.html — upgrade modal points to `confirm.html?plan=...` (or `register.html?plan=...`)
- [ ] §1.4 index.html — pricing CTAs point to plan-specific confirm.html targets
- [ ] §2.1 service-worker CACHE_NAME bumped
- [ ] §3.1 fresh signup smoke-tested end-to-end against live site
- [ ] §3.2 resend flow smoke-tested
- [ ] §3.3 in-app upgrade modal smoke-tested
- [ ] §3.4 marketing pricing CTAs smoke-tested
- [ ] §3.5 guarantee page CTA smoke-tested

Phase 4 is "done" when every box above is checked AND no `REVERT_CHECKLIST` mentions remain in the deployed HTML/JS (grep the deploy: `curl -s https://yourlifecc.com/login.html | grep -i REVERT_CHECKLIST` should return nothing).
