# YourLife CC — P0 Fix Session
## Fix all critical bugs found in AUDIT_REPORT.md before any feature upgrades

---

## CONTEXT

Read AUDIT_REPORT.md first to get the full audit findings. Then fix the following P0 and P1 issues in order. Do NOT add any new features — bugs only.

---

## PRE-FLIGHT (run before anything)

```bash
wc -l app/index.html app/js/*.js
grep -n "function tick\|setInterval(tick\|Google Translate\|</body>" app/index.html | tail -10
node --check app/index.html
node --check app/js/parent.js
node --check app/js/email.js
node --check app/js/skills.js
```

---

## FIX 1 — XSS: Unescaped ${p.name} in email.js and parent.js [CRITICAL]

**Files:** `app/js/email.js` lines ~291, ~293 and `app/js/parent.js` line ~2186

**Problem:** Child profile names are interpolated directly into HTML strings without escaping. A name containing `<script>alert(1)</script>` or `<img onerror=...>` executes in a parent's browser session.

**Fix:** Create a shared HTML escape utility and apply it to every place a user-supplied name/value is inserted into innerHTML or template literals that render as HTML.

```javascript
// Add this helper to a shared location (top of parent.js or a utils section)
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

Then find every instance of `${p.name}`, `${child.name}`, `${profile.name}`, `${user.name}` inside backtick template strings that produce HTML output and wrap with `escHtml()`:
- `${p.name}` → `${escHtml(p.name)}`
- Do a global search: `grep -n "\${p\.name}\|\${child\.name}\|\${profile\.name}\|\${user\.name}" app/js/email.js app/js/parent.js app/index.html`
- Fix every hit that appears inside an HTML context (inside innerHTML, insertAdjacentHTML, or a template literal assigned to .innerHTML)
- Leave alone hits that are in console.log, supabase queries, or non-HTML JS logic

After fixing, validate:
```bash
node --check app/js/email.js
node --check app/js/parent.js
```

---

## FIX 2 — D.chorePoints Schema Collision in parent.js [CRITICAL]

**File:** `app/js/parent.js` line ~3051

**Problem:** `D.chorePoints` is being written to in a way that collides with another schema definition or overwrites the wrong structure, silently corrupting chore point state for users.

**Steps:**
1. Read the full context around line 3051 in parent.js — understand what D.chorePoints is supposed to be (object keyed by child ID? flat number? array?)
2. Find all other places `D.chorePoints` is read or written across all files:
   ```bash
   grep -n "chorePoints\|chore_points\|chorepoint" app/js/*.js app/index.html
   ```
3. Identify the collision — is it being initialized as one type and used as another? Is a function overwriting the whole object when it should only update one key?
4. Standardize the schema. Recommended: `D.chorePoints = { [childId]: number }` — keyed by child UUID
5. Update every read/write site to use the consistent schema
6. Add a defensive init at the top of wherever D is initialized:
   ```javascript
   if (!D.chorePoints || typeof D.chorePoints !== 'object' || Array.isArray(D.chorePoints)) {
     D.chorePoints = {};
   }
   ```

After fixing:
```bash
grep -n "chorePoints" app/js/*.js app/index.html | head -30
node --check app/js/parent.js
```

---

## FIX 3 — parentDrillChild Mutates Live D [CRITICAL]

**File:** `app/js/parent.js` (search for `parentDrillChild`)

**Problem:** The function mutates the live `D` (global data store) object when drilling into a child's view without a reliable way to restore the original state. If the user navigates away mid-drill or an error occurs, D is left in a corrupted child-scoped state.

**Fix:** Implement a snapshot/restore pattern:

```javascript
// Before mutation — save a shallow clone of the keys that will be changed
function parentDrillChild(childId) {
  // Save original values BEFORE any mutation
  const _restore = {
    activeChild: D.activeChild,
    chores: D.chores ? [...D.chores] : [],
    goals: D.goals ? [...D.goals] : [],
    // add any other D keys that get mutated in this function
  };
  
  // Store restore point on D itself so any exit path can use it
  D._parentDrillRestore = _restore;
  
  // ... existing drill logic ...
}

// Restore function — call on exit, back button, error, tab switch
function parentDrillExit() {
  if (D._parentDrillRestore) {
    Object.assign(D, D._parentDrillRestore);
    delete D._parentDrillRestore;
  }
}
```

Find all exit paths from the drill view (back button click handlers, tab switches, page unload) and ensure `parentDrillExit()` is called on each.

```bash
grep -n "parentDrillChild\|parentDrill\|drillChild\|drill.*child" app/js/parent.js | head -20
```

---

## FIX 4 — P1: UTC Date Bug in Schedule Upcoming Widget

**Problem:** Schedule upcoming widget uses UTC date comparison causing events to appear on wrong day for users in US timezones (events created at 11pm PST show as next day).

**Fix:** Replace any `new Date().toISOString().split('T')[0]` used for "today" comparisons with a local date:

```javascript
// Replace this pattern:
const today = new Date().toISOString().split('T')[0]; // UTC — WRONG for US users

// With this:
function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
const today = localDateString(); // Local timezone — CORRECT
```

Search for all instances:
```bash
grep -n "toISOString.*split\|split.*T.*\[0\]" app/js/*.js app/index.html
```

Apply the localDateString fix to every date comparison used in the schedule/calendar display.

---

## FIX 5 — P1: doneDate / achievedDate Field Drift in Goals

**Problem:** Goals are being saved with inconsistent field names (`doneDate` in some places, `achievedDate` in others), causing completed goals to not display correctly.

**Fix:** 
```bash
grep -n "doneDate\|achievedDate\|completedDate\|done_date\|achieved_date" app/js/*.js app/index.html
```
Pick one canonical name (recommend `completedDate` — most descriptive). Update every read/write site to use it consistently. If Supabase is involved, verify the column name in the goals table matches.

---

## FIX 6 — P1: Duplicate Cooking Quiz Block in Skills

**Problem:** There's a duplicate `cooking:` quiz block in skills.js causing one to silently override the other.

**Fix:**
```bash
grep -n "cooking" app/js/skills.js | head -20
```
Identify the two blocks, merge them keeping the more complete version, delete the duplicate.

---

## FIX 7 — Update CLAUDE.md Baseline

**Problem:** CLAUDE.md claims ~6,829 lines but file is now 13,145 lines. The tail-integrity check instructions are stale.

**Fix:** Update CLAUDE.md with current stats:
```bash
wc -l app/index.html app/js/*.js
grep -n "function tick\|setInterval(tick\|Google Translate\|</body>" app/index.html
```
Update the CLAUDE.md tail-integrity section with the correct current line numbers for:
- `function tick` location
- `setInterval(tick,` location  
- Google Translate script tag location
- `</body>` location

---

## VALIDATION — run after all fixes

```bash
# Syntax check all modified files
node --check app/index.html
for f in app/js/*.js; do node --check "$f" && echo "OK: $f" || echo "FAIL: $f"; done

# Confirm no remaining unescaped name interpolations in HTML contexts
grep -n "\${p\.name}\|\${child\.name}\|\${profile\.name}" app/js/email.js app/js/parent.js

# Confirm chorePoints uses consistent schema
grep -n "chorePoints" app/js/*.js app/index.html

# Confirm no duplicate cooking block
grep -c "cooking" app/js/skills.js

# Line count delta
wc -l app/index.html app/js/*.js
```

---

## COMMIT

```bash
git add -A
git commit -m "fix: P0/P1 bugs from audit — XSS escaping, chorePoints schema, parentDrillChild restore, UTC date, goal field drift, duplicate quiz block, CLAUDE.md baseline update"
git push origin main
```

---

## AFTER THIS SESSION

Once all P0/P1 fixes are confirmed and pushed, the next session begins the feature upgrade sprints starting with **Habits** (data layer partially exists, just needs first-class UI surface) then **Chores** (highest daily parent engagement).
