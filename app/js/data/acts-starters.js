/* =============================================================
   acts-starters.js — Guided ACTS Prayer Journey (2026-07-05)

   12 starter phrases (3 per movement) for the ACTS guided prayer.
   Each set rotates daily (date-seeded, same deterministic logic
   as First Light) so the prompts feel fresh without requiring a
   library. The user's own words fill in from these seeds.

   Schema per entry:
     movement  — 'adoration' | 'confession' | 'thanksgiving' | 'supplication'
     label     — the movement name shown to the user
     prompt    — one-line explanation of what this movement is
     starters  — array of 3 opening phrases the user can continue
     scripture — a grounding verse for this movement
     icon      — emoji for the movement header

   Pure data; no behavior. Exposed on window.
============================================================= */

const ACTS_STARTERS = [
  {
    movement: 'adoration',
    label: 'Adoration',
    prompt: 'Start by telling God who He is — not what you need, just who He is.',
    icon: '✨',
    scripture: '"Great is the Lord, and greatly to be praised." — Psalm 145:3',
    starters: [
      'God, You are...',
      'I worship You because...',
      'What I love most about who You are is...'
    ]
  },
  {
    movement: 'confession',
    label: 'Confession',
    prompt: 'Be honest about where you fell short. No performance — just honesty.',
    icon: '🪞',
    scripture: '"If we confess our sins, He is faithful and just to forgive us." — 1 John 1:9',
    starters: [
      'I need to be honest about...',
      'I know I fell short when...',
      'The thing I keep carrying is...'
    ]
  },
  {
    movement: 'thanksgiving',
    label: 'Thanksgiving',
    prompt: 'Name something specific — not "everything," but one real thing.',
    icon: '🙏',
    scripture: '"Give thanks in all circumstances." — 1 Thessalonians 5:18',
    starters: [
      'Thank You for...',
      'Something I almost missed noticing today...',
      'I don\u2019t say this enough, but I\u2019m grateful for...'
    ]
  },
  {
    movement: 'supplication',
    label: 'Supplication',
    prompt: 'Now ask. Be specific — God isn\u2019t afraid of details.',
    icon: '💬',
    scripture: '"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God." — Philippians 4:6',
    starters: [
      'What I really need right now is...',
      'I\u2019m asking You to...',
      'Please help me with...'
    ]
  }
];

if (typeof window !== 'undefined') {
  window.ACTS_STARTERS = ACTS_STARTERS;
}
