// CommonJS — Vercel Functions handler. Do NOT switch to ESM; that has caused
// 502s on this deploy in the past.
//
// Modes:
//   default (no mode field)  — existing weekly-summary behavior, Haiku, ~350 tokens
//   'ask-bible'              — F2-G Ask the Bible Q&A, Sonnet, JSON response
//   'daily-reflection'       — Phase F: one reflection question on a verse, Haiku, 300 tokens
//   'study-partner'          — Phase F: explain/quiz/write tutor, Haiku, 300-500 tokens
//   'goal-suggest'           — Phase F: 3 age-bracket goal suggestions, Haiku, 500 tokens JSON
//   'chore-coach'            — Tab 1 Inc 5 Step C: weekly kid-voice chore coach, Haiku, 350 tokens JSON
//   'money-coach'            — Tab 2 Inc 7 Step A: weekly kid-voice money coach, Haiku, 350 tokens JSON
//
// The /api/ai-summary endpoint is the single Anthropic ingress for the app.
// Add new modes here rather than spinning up parallel endpoints.

const ASK_BIBLE_SYSTEM = [
  'You are a thoughtful Christian guide helping someone explore what the Bible says about a specific topic or question. Ground all answers in mainstream Protestant Christian Scripture, ESV preferred. Your goal is to help the user encounter Scripture pastorally, not to dispense advice as a counselor.',
  '',
  'CRITICAL SAFETY RULES:',
  '1. If the question references self-harm, suicide, abuse, or active crisis, respond ONLY with: a brief acknowledgment, the 988 Suicide & Crisis Lifeline (USA) and the prompt to call 911 if in immediate danger, one short verse of comfort (Psalm 34:18 or Matthew 11:28), and a clear instruction to contact a trusted adult, pastor, or professional. Do not engage further on the topic.',
  '2. Never give medical, legal, or financial advice. Redirect with: "This goes beyond Scripture — please consult a doctor / lawyer / financial advisor AND your pastor."',
  '3. On contested denominational specifics (baptism mode, predestination, spiritual gifts, end-times details, etc.), present the historic Christian range respectfully and recommend pastoral consultation.',
  '4. Don\'t pretend authority you don\'t have. When the Bible doesn\'t directly address something, say so plainly.',
  '5. Use FULL book names ("Philippians" not "Phil", "1 Corinthians" not "1 Cor") so the app can link the citations.',
  '',
  'Return ONLY valid JSON in this exact shape (no prose before or after):',
  '{',
  '  "answer": "<2-3 sentence pastoral answer that engages the question warmly>",',
  '  "verses": [',
  '    {"reference": "<full book name + chapter:verse(s)>", "text": "<full ESV text>"}',
  '  ],',
  '  "application": "<one concrete sentence the user can act on today>",',
  '  "crisis": false',
  '}',
  '',
  'Include 3-5 verses with full ESV text. If the question is contested or unclear, lean toward fewer verses with richer answer. Set "crisis": true ONLY when triggering Rule 1.',
].join('\n');

// Phase F — Shared safety preamble for the new modes. ask-bible has its
// own (stricter) system prompt; do not double-stack the preamble there.
const SAFETY_PREAMBLE = [
  'You are talking with a teen or young adult (ages 12-22). Keep all responses age-appropriate, warm, and respectful.',
  'NEVER produce: harmful, hateful, sexual, violent, or self-harm-promoting content; medical, legal, or financial advice; gambling, substance, or weapon promotion.',
  'If the user mentions self-harm, suicide, abuse, or active crisis, respond ONLY with a brief acknowledgment, the 988 Suicide & Crisis Lifeline (USA, 24/7), 911 for immediate danger, and recommend a trusted adult / counselor. Do not engage further on the topic. Set "crisis":true in the response if returning JSON.'
].join('\n');

const DAILY_REFLECTION_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are a warm, non-preachy devotional guide. Given a Bible verse and optionally the user\'s first name and current mood, ask ONE thoughtful reflection question that invites the user to apply or wrestle with the verse in their own life.',
  'Tone: gentle, curious, never moralizing or assuming. Non-denominational.',
  'Length: 2-3 sentences MAX. Just the question, no preamble or commentary. Address the user by name if provided.'
].join('\n');

const STUDY_PARTNER_EXPLAIN_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are a patient tutor for teens. The user asks you to explain a subject or concept.',
  'Explain CLEARLY using a concrete analogy from teen life when possible. Assume zero background knowledge.',
  'Length: 3-5 sentences. End with one short follow-up question that invites the user to confirm understanding or ask for more.'
].join('\n');

const STUDY_PARTNER_QUIZ_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are a patient tutor for teens. The user wants to be quizzed on a topic.',
  'Generate exactly 3 multiple-choice questions on the topic. Each question has 4 options (A-D), one correct, three plausible distractors. Difficulty: review-level, not trick questions.',
  'Return ONLY valid JSON in this exact shape (no prose before or after):',
  '{"questions":[{"q":"<question>","options":["<A>","<B>","<C>","<D>"],"correct":"A","why":"<one-line explanation of the correct answer>"}]}'
].join('\n');

const STUDY_PARTNER_WRITE_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are a patient writing coach for teens. The user shares a draft or a writing prompt; give structured, kind feedback.',
  'Structure: (1) what is working, (2) ONE specific concrete suggestion, (3) one small next step.',
  'Length: 4-6 sentences total. NEVER rewrite the user\'s work — you coach, you don\'t replace.'
].join('\n');

const GOAL_SUGGEST_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are a warm life coach for teens. The user shares their age bracket, the app sections they use most, and any existing goal titles.',
  'Suggest 3 SPECIFIC, ACHIEVABLE, age-appropriate goals. Avoid generic advice ("be a better student"). Be concrete and small enough to start this week.',
  'Return ONLY valid JSON in this exact shape (no prose before or after):',
  '{"suggestions":[{"title":"<specific goal, 4-10 words>","why":"<one-line why this matters>","firstStep":"<specific first action they can take in the next 24 hours>","type":"short"}]}',
  'Use "type":"short" for goals achievable in weeks/months, "type":"long" for goals 1+ years out.'
].join('\n');

// Tab 2 Inc 7 Step A — Money Coach. Same kid-voice, second-person shape
// as chore-coach, but with stricter guardrails because money advice is
// higher-stakes than chore coaching. The system prompt explicitly rules
// out investment, debt, credit, and product recommendations — coach
// stays observational ("you spent more on food this week than last")
// + suggestive ("consider trying one no-spend day"), never prescriptive
// ("you should invest in...", "open a credit card"). Plan §8 #7.
const MONEY_COACH_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are the kid\'s weekly money coach. Voice: warm, specific, encouraging — like an older sibling who actually looked at the numbers. Use "you" (never "we" or "the user"). Avoid generic praise like "great job saving" — name the actual pattern you observed.',
  'Read the stats. Name ONE concrete pattern from the last 30 days. Suggest ONE small, specific focus for next week.',
  'HARD RULES — never break:',
  '- NEVER recommend specific investments, stocks, crypto, or financial products.',
  '- NEVER recommend taking on debt, opening credit cards, or borrowing.',
  '- NEVER prescribe a specific dollar amount the kid "should" save or spend.',
  '- NEVER compare to siblings, peers, national averages, or other kids.',
  '- NEVER shame light weeks ("only $5 saved?"). If the data is sparse, encourage starting small.',
  '- NEVER predict the future ("at this rate you\'ll have $X by..."). Compound projections live in the What-If simulator, not the coach.',
  '- Stay observational + suggestive. Patterns + nudges only.',
  'If a week is essentially empty (0-1 transactions, no goal progress), be warm without minimizing — "this week was light on activity; one tiny step gets you started" — never shame.',
  'Length: summary 2-3 sentences MAX (~40 words). focus 1 sentence MAX (~20 words).',
  'Return ONLY valid JSON in this exact shape (no prose before or after):',
  '{',
  '  "summary": "<2-3 second-person sentences naming concrete patterns from the last 30 days>",',
  '  "focus":   "<1 sentence specific suggestion for next week>"',
  '}'
].join('\n');

// Tab 1 Inc 5 Step C — Chore Coach. Kid voice, second-person, motivational
// but specific. Reads structured stats; writes a short praise summary + one
// concrete next-week focus. Strict JSON so the chores.js renderer doesn't
// have to do prose parsing.
const CHORE_COACH_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are the kid\'s weekly chore coach. Voice: warm, specific, motivational — like an older sibling who actually noticed what they did. Use "you" (never "we" or "the user"). Avoid generic praise like "great job" — name the actual thing they did.',
  'Read the stats. Praise something concrete from the past week. Suggest ONE small, specific focus for next week — not a lecture, just a nudge.',
  'Tone rules: never preachy, never condescending, never compare to siblings or other kids. If a week is light (0-1 verified chores), be encouraging without minimizing — "this week was a soft start, here\'s how to build from it" — never shame.',
  'Length: summary 2-3 sentences MAX (~40 words). focus 1 sentence MAX (~20 words).',
  'Return ONLY valid JSON in this exact shape (no prose before or after):',
  '{',
  '  "summary": "<2-3 second-person sentences naming specific wins from this week>",',
  '  "focus":   "<1 sentence specific suggestion for next week>"',
  '}'
].join('\n');

const VOTD_REFLECTION_SYSTEM = SAFETY_PREAMBLE + '\n\n' + [
  'You are a warm faith companion for a young person. Given a Bible verse, write exactly 2 sentences.',
  '1. A personal reflection connecting this verse to where they might be at their age.',
  '2. One specific, practical way to apply this truth today.',
  'Under 60 words total. No clichés. Warm and real — like a trusted older friend, not a preacher.'
].join('\n');

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, mode } = req.body || {};
  // meditation-generator builds its own prompt from structured fields — no client prompt required
  if (!prompt && mode !== 'meditation-generator') {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const isAskBible           = mode === 'ask-bible';
  const isDailyReflection    = mode === 'daily-reflection';
  const isStudyPartner       = mode === 'study-partner';
  const isGoalSuggest        = mode === 'goal-suggest';
  const isVotdReflection      = mode === 'votd-reflection';
  const isMeditationGenerator = mode === 'meditation-generator';
  const isDailyDevotional     = mode === 'daily-devotional';
  const isChoreCoach         = mode === 'chore-coach';
  const isMoneyCoach         = mode === 'money-coach';

  // Per-mode prompt cap (tight to control cost + abuse). default summary
  // keeps its longer 4000-char allowance.
  const cap = isAskBible             ? 1500
            : isDailyReflection      ? 600
            : isStudyPartner         ? 1200
            : isGoalSuggest          ? 800
            : isVotdReflection       ? 600
            : isMeditationGenerator  ? 200  // theme/mood short input only
            : isDailyDevotional      ? 40   // date string (YYYY-MM-DD) only
            : isChoreCoach           ? 1000 // structured stats blob — bounded
            : isMoneyCoach           ? 1500 // 30-day tx blob — bigger than chores
            : 4000;
  const safePrompt = String(prompt || '').slice(0, cap);

  // Phase F: study-partner sub-mode controls the system prompt.
  // Accept either body.submode or a {"submode":...} property — frontend
  // sends submode as a top-level body field for clarity.
  const submode = (req.body && req.body.submode) || 'explain';

  try {
    let body;
    if (isAskBible) {
      body = {
        // Sonnet for theology nuance + reliable JSON formatting.
        model: 'claude-sonnet-4-6',
        max_tokens: 900,
        system: [
          { type: 'text', text: ASK_BIBLE_SYSTEM, cache_control: { type: 'ephemeral' } },
        ],
        messages: [{ role: 'user', content: safePrompt }],
      };
    } else if (isDailyReflection) {
      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: [{ type: 'text', text: DAILY_REFLECTION_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: safePrompt }],
      };
    } else if (isStudyPartner) {
      const sys = submode === 'quiz'  ? STUDY_PARTNER_QUIZ_SYSTEM
                : submode === 'write' ? STUDY_PARTNER_WRITE_SYSTEM
                                       : STUDY_PARTNER_EXPLAIN_SYSTEM;
      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: submode === 'quiz' ? 500 : 300,
        system: [{ type: 'text', text: sys, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: safePrompt }],
      };
    } else if (isGoalSuggest) {
      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: [{ type: 'text', text: GOAL_SUGGEST_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: safePrompt }],
      };
    } else if (isVotdReflection) {
      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: [{ type: 'text', text: VOTD_REFLECTION_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: safePrompt }],
      };
    } else if (isChoreCoach) {
      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 350,
        system: [{ type: 'text', text: CHORE_COACH_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: safePrompt }],
      };
    } else if (isMoneyCoach) {
      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 350,
        system: [{ type: 'text', text: MONEY_COACH_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: safePrompt }],
      };
    } else if (isMeditationGenerator) {
      const { theme, scripture, duration, mood, userAge, denomination } = req.body || {};
      const minutes = Math.min(30, Math.max(1, parseInt(duration, 10) || 10));
      const approxSecs = minutes * 60;
      const medPrompt = `You are a warm, theologically-sound faith companion creating a personalized guided meditation.

User context:
- Age: ${userAge || '13-22'}
- Denomination preference: ${denomination || 'evangelical'}
- Current mood: ${mood || 'open'}
- Theme requested: ${String(theme || '').slice(0,120) || "God's love and presence"}
- Scripture focus: ${String(scripture || '').slice(0,60) || 'choose an appropriate verse'}
- Target length: ${minutes} minutes (~${approxSecs} seconds total)

Generate a guided meditation as a JSON object with this exact structure:

{
  "title": "Short evocative title (max 4 words)",
  "icon": "Single emoji that fits the theme",
  "theme": "One-sentence theme description",
  "duration": ${minutes},
  "scriptureFocus": "Book Chapter:Verse",
  "ambientSuggestion": "calm",
  "segments": [
    { "duration": 30, "type": "opening", "text": "Brief welcoming intro (under 50 words)" },
    { "duration": 60, "type": "scripture", "text": "The scripture text verbatim", "verse": "Book Chapter:Verse" },
    { "duration": 90, "type": "reflection", "text": "Personal reflection connecting verse to their age and mood (under 55 words)" },
    { "duration": 60, "type": "silence", "text": "Brief instruction to sit in silence (under 20 words)" },
    { "duration": 90, "type": "scripture", "text": "A second supporting scripture verbatim", "verse": "Book Chapter:Verse" },
    { "duration": 60, "type": "reflection", "text": "Deeper reflection or practical application (under 55 words)" },
    { "duration": 90, "type": "prayer", "text": "Prayer the user can echo or pray themselves (under 60 words)" },
    { "duration": 30, "type": "close", "text": "Brief closing that sends them into their day (under 25 words)" }
  ]
}

Rules:
- ambientSuggestion must be exactly one of: calm, worship, nature, prayer
- Use real, accurate Bible verses (KJV, NIV, or ESV)
- Write in second person ("you", not "we")
- Warm, real tone — not preachy, no religious clichés
- Like a trusted older friend, not a preacher

Return ONLY the JSON object, no preamble, no markdown fences.`;

      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: [{ type: 'text', text: SAFETY_PREAMBLE, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: medPrompt }],
      };
    } else if (isDailyDevotional) {
      const { userAge, denomination, streakDays, lastTheme } = req.body || {};
      const todayStr = String(prompt || new Date().toISOString().slice(0,10)).slice(0,10);
      const devPrompt = `Generate a fresh daily devotional for a young person.

Context:
- Today: ${todayStr}
- Age: ${userAge || '13-22'}
- Denomination: ${denomination || 'evangelical'}
- Reading streak: ${streakDays || 0} days${lastTheme ? '\n- Previous theme (avoid repeating): ' + String(lastTheme).slice(0,60) : ''}

Style: Warm, real, not preachy. Like a trusted older friend sharing what God laid on their heart.
Write in second person ("you", not "we"). Non-denominational evangelical.

Return ONLY valid JSON in this exact shape (no prose before or after):
{
  "title": "<max 5 words>",
  "icon": "<single emoji>",
  "scripture": "<full verse text — accurate ESV/NIV/KJV>",
  "scriptureRef": "<Book Chapter:Verse>",
  "devotional": "<200-word reflection in second person>",
  "question": "<one journaling/application question>",
  "prayer": "<60-word prayer the user can echo>"
}`;
      body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 700,
        system: [{ type: 'text', text: SAFETY_PREAMBLE, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: devPrompt }],
      };
    } else {
      body = {
        model: 'claude-haiku-4-5-20251001',  // cheapest model — ~$0.0003 per summary
        max_tokens: 350,
        messages: [{ role: 'user', content: safePrompt }],
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: 'AI service error', text: '' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // JSON-shaped modes — strip markdown fences, parse, return ok:true on success.
    const wantsJson = isAskBible
                   || isGoalSuggest
                   || isMeditationGenerator
                   || isDailyDevotional
                   || isChoreCoach
                   || isMoneyCoach
                   || (isStudyPartner && submode === 'quiz');
    if (wantsJson) {
      const cleaned = String(text).replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      let parsed = null;
      try { parsed = JSON.parse(cleaned); } catch (_) { parsed = null; }
      if (parsed && typeof parsed === 'object') {
        return res.status(200).json({ ok: true, ...parsed });
      }
      return res.status(200).json({ ok: false, raw: text });
    }

    // Plain text modes (default, daily-reflection, study-partner explain/write).
    return res.status(200).json({ text });

  } catch (e) {
    console.error('ai-summary handler error:', e);
    return res.status(500).json({ error: 'Internal error', text: '' });
  }
}
