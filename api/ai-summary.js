// CommonJS — Vercel Functions handler. Do NOT switch to ESM; that has caused
// 502s on this deploy in the past.
//
// Modes:
//   default (no mode field)  — existing weekly-summary behavior, Haiku, ~350 tokens
//   'ask-bible'              — F2-G Ask the Bible Q&A, Sonnet, JSON response
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

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, mode } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const isAskBible = mode === 'ask-bible';
  // Ask-bible questions are short; the budget is for our system prompt + verse text.
  // Default summary keeps its longer-prompt 4000 cap.
  const cap = isAskBible ? 1500 : 4000;
  const safePrompt = String(prompt).slice(0, cap);

  try {
    const body = isAskBible
      ? {
          // Sonnet for theology nuance + reliable JSON formatting.
          model: 'claude-sonnet-4-6',
          max_tokens: 900,
          system: [
            { type: 'text', text: ASK_BIBLE_SYSTEM, cache_control: { type: 'ephemeral' } },
          ],
          messages: [{ role: 'user', content: safePrompt }],
        }
      : {
          model: 'claude-haiku-4-5-20251001',  // cheapest model — ~$0.0003 per summary
          max_tokens: 350,
          messages: [{ role: 'user', content: safePrompt }],
        };

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

    if (isAskBible) {
      // Try to parse the JSON. If the model wrapped it in markdown fences, strip those.
      const cleaned = String(text).replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      let parsed = null;
      try { parsed = JSON.parse(cleaned); } catch (_) { parsed = null; }
      if (parsed && typeof parsed === 'object') {
        return res.status(200).json({ ok: true, ...parsed });
      }
      // Parse failure — return raw text so the client can show a degraded view.
      return res.status(200).json({ ok: false, raw: text });
    }

    return res.status(200).json({ text });

  } catch (e) {
    console.error('ai-summary handler error:', e);
    return res.status(500).json({ error: 'Internal error', text: '' });
  }
}
