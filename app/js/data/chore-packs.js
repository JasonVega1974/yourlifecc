/* =============================================================
   chore-packs.js — Tab 1 Chores / Inc 5 Step A-2
                    Seasonal & year-round chore-pack catalog
============================================================= */
//
// Five curated packs the parent can bulk-apply to a kid's chore
// list from Parent Hub → Chores → Starter packs. Each chore in a
// pack is the SAME shape D.chores stores, so addChorePack() can
// just push them after a case-insensitive name dedupe.
//
// Source of truth: content/chore-pack-drafts/*.md (committed
// 36d2bf6). Treat those as the human-authored review version.
// This file is the runtime mirror — keep the two in sync if a
// draft changes, but draft frontmatter (sort/status/season/etc.)
// is metadata; runtime uses only id / name / emoji / description
// + the chores[] array. Per Inc 5 Step A decisions (2026-06-06):
//
//   • All 5 drafts ship in v1.
//   • Points are LITERAL. Don't pre-divide by the difficulty
//     multiplier — the multiplier is applied later at submit
//     time in markChoreDone(), same as any manually-added chore.
//   • Dedupe key is case-insensitive trimmed `name`.
//   • Frequency strings map 1:1 to existing c.freq vocabulary
//     ('daily' | 'weekly' | 'once').
//   • Age range is metadata only — v1 shows every pack to every
//     parent. A future "suggest by kid age" pass can read
//     ageRange without a data migration.
//   • Months is metadata only — a future "Suggested for {month}"
//     polish pass (5A-4) can read it without a migration.
//
// Per-chore field semantics:
//   name        — display string, used as the dedupe key
//   cat         — category, must be a key in CHORE_CAT_EMOJI
//                 (cleaning|kitchen|laundry|outdoor|pets|
//                  academic|personal|family|other) so the
//                 emoji fallback resolves cleanly
//   difficulty  — 'easy'|'medium'|'hard'; verifyChore applies
//                 the matching multiplier (1.0×|1.5×|2.0×)
//   pts         — base points BEFORE multiplier (drafts chose
//                 these deliberately — don't recompute)
//   freq        — 'daily'|'weekly'|'once'; matches c.freq
//   emoji       — per-chore icon; if missing, addChorePack
//                 falls back to CHORE_CAT_EMOJI[cat] || '📌'
//
// Categories sanity-checked against CHORE_CAT_EMOJI (chores.js
// line 19): cleaning, kitchen, laundry, outdoor, pets, academic,
// personal, family, other. All 5 packs use only these.
//
// Globals: exposed as window.CHORE_PACKS at the foot of this
// file, matching the data-module pattern used by money-lessons.js
// / academy-lessons.js / etc.
//
const CHORE_PACKS = [
  // ── 1. Daily Reset — year-round, low-friction habit pack ────
  {
    id:          'daily-reset',
    name:        'Daily Reset',
    emoji:       '🔄',
    season:      'year-round',
    months:      [1,2,3,4,5,6,7,8,9,10,11,12],
    ageRange:    [10,18],
    sortOrder:   5,
    description: 'Seven sub-5-minute daily habits that keep the room livable, the bag ready, and the morning calm. Every chore is recurring — apply once and the kid sees them every day.',
    chores: [
      { name: 'Make the bed',                              cat: 'cleaning', difficulty: 'easy', pts: 5,  freq: 'daily', emoji: '🛏️' },
      { name: 'Tidy bedroom floor (5 min)',                cat: 'cleaning', difficulty: 'easy', pts: 5,  freq: 'daily', emoji: '🧺' },
      { name: 'Put dishes in dishwasher',                  cat: 'kitchen',  difficulty: 'easy', pts: 5,  freq: 'daily', emoji: '🍽️' },
      { name: "Hang up / fold today's clothes",            cat: 'laundry',  difficulty: 'easy', pts: 5,  freq: 'daily', emoji: '👕' },
      { name: 'Empty backpack + restock',                  cat: 'personal', difficulty: 'easy', pts: 5,  freq: 'daily', emoji: '🎒' },
      { name: 'Charge devices in the kitchen overnight',   cat: 'personal', difficulty: 'easy', pts: 5,  freq: 'daily', emoji: '🔌' },
      { name: '10-minute screen-free wind-down',           cat: 'personal', difficulty: 'easy', pts: 10, freq: 'daily', emoji: '🌙' }
    ]
  },

  // ── 2. Spring Cleaning — Mar–May one-shot deep-clean ────────
  {
    id:          'spring-cleaning',
    name:        'Spring Cleaning',
    emoji:       '🌷',
    season:      'spring',
    months:      [3,4,5],
    ageRange:    [10,18],
    sortOrder:   10,
    description: 'Eight one-shot chores that hit the corners weekly cleaning skips — windows, baseboards, closet purge, plus a yard wake-up. Run once per spring or split across two weekends.',
    chores: [
      { name: 'Wash inside + outside of all windows',       cat: 'cleaning', difficulty: 'hard',   pts: 25, freq: 'once', emoji: '🪟' },
      { name: 'Wipe every baseboard in the house',          cat: 'cleaning', difficulty: 'medium', pts: 15, freq: 'once', emoji: '🧽' },
      { name: 'Closet purge — donate 10+ items',            cat: 'personal', difficulty: 'medium', pts: 20, freq: 'once', emoji: '👚' },
      { name: 'Deep-clean fridge (shelves + drawers)',      cat: 'kitchen',  difficulty: 'hard',   pts: 25, freq: 'once', emoji: '🧊' },
      { name: 'Vacuum under all furniture',                 cat: 'cleaning', difficulty: 'medium', pts: 15, freq: 'once', emoji: '🧹' },
      { name: 'Clean ceiling fans + light fixtures',        cat: 'cleaning', difficulty: 'medium', pts: 15, freq: 'once', emoji: '💡' },
      { name: 'Rake winter debris from yard',               cat: 'outdoor',  difficulty: 'medium', pts: 15, freq: 'once', emoji: '🍂' },
      { name: 'Wash sheets + flip mattress',                cat: 'laundry',  difficulty: 'easy',   pts: 10, freq: 'once', emoji: '🛏️' }
    ]
  },

  // ── 3. Summer Outdoor — Jun–Aug recurring weekly yard ───────
  {
    id:          'summer-outdoor',
    name:        'Summer Outdoor',
    emoji:       '☀️',
    season:      'summer',
    months:      [6,7,8],
    ageRange:    [10,18],
    sortOrder:   30,
    description: "Eight outdoor chores for the long-daylight months — yard, garden, car, sidewalk. Most are weekly so they ride through the whole season.",
    chores: [
      { name: 'Mow the lawn',                               cat: 'outdoor', difficulty: 'hard',   pts: 30, freq: 'weekly', emoji: '🌱' },
      { name: 'Water plants / garden',                      cat: 'outdoor', difficulty: 'easy',   pts: 10, freq: 'daily',  emoji: '💧' },
      { name: 'Weed flower beds or vegetable patch',        cat: 'outdoor', difficulty: 'medium', pts: 20, freq: 'weekly', emoji: '🌿' },
      { name: 'Hose down the driveway / sidewalk',          cat: 'outdoor', difficulty: 'easy',   pts: 10, freq: 'weekly', emoji: '🚿' },
      { name: 'Wash the car',                               cat: 'outdoor', difficulty: 'medium', pts: 20, freq: 'weekly', emoji: '🚗' },
      { name: 'Take out trash + recycling',                 cat: 'other',   difficulty: 'easy',   pts: 5,  freq: 'weekly', emoji: '🗑️' },
      { name: 'Sweep deck / patio',                         cat: 'outdoor', difficulty: 'easy',   pts: 10, freq: 'weekly', emoji: '🪶' },
      { name: 'Pick up dog waste from yard',                cat: 'pets',    difficulty: 'easy',   pts: 10, freq: 'weekly', emoji: '🐕' }
    ]
  },

  // ── 4. Back to School — Aug–Sep routine reset ───────────────
  {
    id:          'back-to-school',
    name:        'Back to School',
    emoji:       '🎒',
    season:      'late-summer',
    months:      [8,9],
    ageRange:    [10,18],
    sortOrder:   20,
    description: 'Reset-the-routine pack — desk setup, supply sort, plus three recurring morning-kit chores that stay live all year. Built for the Sunday before school starts.',
    chores: [
      { name: 'Set up desk + study space',                          cat: 'academic', difficulty: 'easy', pts: 10, freq: 'once',   emoji: '🗂️' },
      { name: 'Sort + label all school supplies',                   cat: 'academic', difficulty: 'easy', pts: 10, freq: 'once',   emoji: '✏️' },
      { name: 'Try on uniforms / school clothes — flag outgrown',   cat: 'personal', difficulty: 'easy', pts: 10, freq: 'once',   emoji: '👕' },
      { name: 'Pack backpack the night before',                     cat: 'personal', difficulty: 'easy', pts: 5,  freq: 'daily',  emoji: '🎒' },
      { name: "Lay out tomorrow's outfit",                          cat: 'personal', difficulty: 'easy', pts: 5,  freq: 'daily',  emoji: '👖' },
      { name: 'Make lunch for tomorrow',                            cat: 'kitchen',  difficulty: 'easy', pts: 10, freq: 'daily',  emoji: '🥪' },
      { name: "Review the week's calendar with a parent",           cat: 'family',   difficulty: 'easy', pts: 10, freq: 'weekly', emoji: '📅' }
    ]
  },

  // ── 5. Holiday Prep — Nov–Dec guest + gift readiness ────────
  {
    id:          'holiday-prep',
    name:        'Holiday Prep',
    emoji:       '🎄',
    season:      'fall-winter',
    months:      [11,12],
    ageRange:    [10,18],
    sortOrder:   40,
    description: 'Seven Nov–Dec chores for guest readiness, decorating, and gift-giving practice. Inclusive of all traditions — religion-specific items can be added separately.',
    chores: [
      { name: 'Help decorate (tree / lights / wreath)',        cat: 'family',   difficulty: 'medium', pts: 15, freq: 'once',   emoji: '🎁' },
      { name: 'Wrap gifts (5+ items)',                         cat: 'family',   difficulty: 'easy',   pts: 10, freq: 'once',   emoji: '🎀' },
      { name: 'Write 3 thank-you notes',                       cat: 'personal', difficulty: 'easy',   pts: 10, freq: 'once',   emoji: '✉️' },
      { name: 'Tidy guest room / bathroom',                    cat: 'cleaning', difficulty: 'easy',   pts: 10, freq: 'weekly', emoji: '🛌' },
      { name: 'Bake or prep one dish for a family meal',       cat: 'kitchen',  difficulty: 'medium', pts: 20, freq: 'once',   emoji: '🍪' },
      { name: 'Help set the holiday table',                    cat: 'family',   difficulty: 'easy',   pts: 10, freq: 'once',   emoji: '🍽️' },
      { name: 'Take down + box decorations (end of season)',   cat: 'family',   difficulty: 'medium', pts: 15, freq: 'once',   emoji: '📦' }
    ]
  }
];

// Expose to window like the other data modules so renderers
// inside chores.js / parent.js can read it without an import.
if(typeof window !== 'undefined'){
  window.CHORE_PACKS = CHORE_PACKS;
}
