// CommonJS — Vercel Functions handler. Do NOT switch to ESM; that has caused
// 502s on this deploy in the past.
//
// Modes:
//   default (no mode field)  — existing weekly-summary behavior, Haiku, ~350 tokens
//   'ask-bible'              — F2-G Ask the Bible Q&A, Sonnet, JSON response
//   'daily-reflection'       — Phase F: one reflection question on a verse, Haiku, 300 tokens
//   'study-partner'          — Phase F: explain/quiz/write tutor, Haiku, 300-500 tokens
//   'goal-suggest'           — Phase F: 3 age-bracket goal suggestions, Haiku, 500 tokens JSON
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

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, mode } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const isAskBible        = mode === 'ask-bible';
  const isDailyReflection = mode === 'daily-reflection';
  const isStudyPartner    = mode === 'study-partner';
  const isGoalSuggest     = mode === 'goal-suggest';

  // Per-mode prompt cap (tight to control cost + abuse). default summary
  // keeps its longer 4000-char allowance.
  const cap = isAskBible        ? 1500
            : isDailyReflection ? 600
            : isStudyPartner    ? 1200
            : isGoalSuggest     ? 800
            : 4000;
  const safePrompt = String(prompt).slice(0, cap);

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
