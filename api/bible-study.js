// api/bible-study.js — Bible Study Hub AI generation endpoint
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Flow: verify Supabase JWT → check plan gate → call Anthropic Haiku
//       → parse and return structured JSON lesson.
//
// Plan gate allows: active, trialing, faith_free
// DO NOT TRUNCATE — the PROMPTS object contains all 4 track prompts.

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';

const PROMPTS = {
  family: (topic) => `You are a warm, theologically sound Bible study author creating a 30-minute FAMILY Bible study for parents with children ages 6-18.

Topic: "${topic}"

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "title": "engaging lesson title",
  "verse": "primary Bible verse (full text, ESV)",
  "reference": "Book Chapter:Verse",
  "overview": "2-sentence lesson overview for parents",
  "passage_intro": "1-sentence intro to the passage",
  "questions": [
    {"q": "opening question anyone can answer"},
    {"q": "digging deeper question for older kids/parents"},
    {"q": "personal application question"},
    {"q": "family challenge question"}
  ],
  "kids_activity": {"title": "activity name", "desc": "2-sentence activity for younger children (ages 6-10)"},
  "teen_reflection": {"title": "reflection prompt", "desc": "deeper question for teens to journal or discuss"},
  "family_challenge": "one practical thing the family can do this week together",
  "prayer_starter": "2-sentence opening prayer the parent can read aloud",
  "facilitator_tip": "1 tip for parents leading this study"
}`,

  group: (topic) => `You are a seasoned small group curriculum writer creating a 45-minute adult small group Bible study.

Topic: "${topic}"

Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "engaging lesson title",
  "verse": "primary Bible verse (full text, ESV)",
  "reference": "Book Chapter:Verse",
  "overview": "2-sentence lesson overview",
  "passage_intro": "1-sentence contextual intro",
  "icebreaker": "1 warm-up question to open discussion",
  "questions": [
    {"q": "observation question: what does the text say?"},
    {"q": "interpretation question: what does it mean?"},
    {"q": "application question: how does it apply to life?"},
    {"q": "personal question: where do you struggle with this?"},
    {"q": "community question: how can we support each other?"}
  ],
  "dig_deeper": "one additional passage to cross-reference",
  "weekly_challenge": "one concrete action each member can take this week",
  "prayer_starter": "2-sentence closing prayer",
  "facilitator_tip": "1 tip for the group leader"
}`,

  kids: (topic) => `You are a children's ministry curriculum writer creating a fun, engaging 20-minute Bible lesson for ages 4-12.

Topic: "${topic}"

Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "fun, kid-friendly lesson title",
  "verse": "simple Bible verse (NIrV), keep it short",
  "reference": "Book Chapter:Verse",
  "story_summary": "2-3 sentence Bible story summary in simple language",
  "big_idea": "one short memorable sentence — the main takeaway",
  "questions": [
    {"q": "simple question a 5-year-old can answer"},
    {"q": "fun question about the Bible story"},
    {"q": "connecting it to their own life"},
    {"q": "what can we do about this?"}
  ],
  "craft_activity": {"title": "craft name", "materials": "simple materials list", "desc": "2-sentence craft instructions"},
  "game_activity": {"title": "game name", "desc": "2-sentence game that reinforces the lesson"},
  "memory_challenge": "a fun way to memorize the verse (motion, song, chant)",
  "prayer_starter": "simple 2-sentence prayer a child can repeat",
  "parent_note": "1 sentence parents can use to continue the lesson at home"
}`,

  teens: (topic) => `You are a youth pastor writing a real-talk 30-minute teen Bible devotional for ages 13-19.

Topic: "${topic}"

Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "relatable, honest title (not preachy)",
  "verse": "Bible verse, ESV",
  "reference": "Book Chapter:Verse",
  "hook": "1-2 sentences that grab a teen's attention — a relatable scenario or question",
  "overview": "2-sentence real-talk explanation of why this topic matters to teens today",
  "questions": [
    {"q": "icebreaker: relatable everyday question"},
    {"q": "honest check: where do you actually struggle with this?"},
    {"q": "scripture dive: what does this passage say about it?"},
    {"q": "counter-culture: how is the biblical view different from what the world says?"},
    {"q": "action step: what's one thing you'll change this week?"}
  ],
  "real_talk": "1 raw, honest paragraph addressing the teen's real experience without being preachy",
  "weekly_dare": "one bold challenge for the week",
  "journal_prompt": "a reflective writing prompt for personal devotion",
  "prayer_starter": "honest, conversational 2-sentence prayer",
  "leader_note": "1 tip for the youth leader or parent"
}`
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const serviceKey = process.env.SUPA_SERVICE_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!serviceKey || !anthropicKey) {
    console.error('bible-study: missing env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // 1. Verify the Supabase JWT and get the user id.
  let userId;
  try {
    const authRes = await fetch(`https://${SUPA_HOST}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': serviceKey,
      },
    });
    if (!authRes.ok) return res.status(401).json({ error: 'Invalid session' });
    const user = await authRes.json();
    userId = user && user.id;
    if (!userId) return res.status(401).json({ error: 'Invalid session' });
  } catch (e) {
    console.error('bible-study: auth verification error:', e.message);
    return res.status(401).json({ error: 'Auth verification failed' });
  }

  // 2. Plan gate — active subscription, free trial, or faith_free path.
  try {
    const profRes = await fetch(
      `https://${SUPA_HOST}/rest/v1/profiles?select=plan_status&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    );
    if (!profRes.ok) return res.status(500).json({ error: 'Profile lookup failed' });
    const rows = await profRes.json();
    const planStatus = rows && rows[0] ? rows[0].plan_status : null;
    if (!planStatus || !['active', 'trialing', 'faith_free'].includes(planStatus)) {
      return res.status(403).json({ error: 'Active plan required', upgrade: true });
    }
  } catch (e) {
    console.error('bible-study: profile lookup error:', e.message);
    return res.status(500).json({ error: 'Profile lookup failed' });
  }

  // 3. Validate inputs.
  const body = req.body || {};
  const track = body.track;
  const topic = typeof body.topic === 'string' ? body.topic.slice(0, 120).trim() : '';
  if (!PROMPTS[track] || !topic) {
    return res.status(400).json({ error: 'Invalid track or topic' });
  }

  // 4. Call Anthropic Haiku for cost-efficient generation.
  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: PROMPTS[track](topic) }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('bible-study: Anthropic error:', errText);
      return res.status(502).json({ error: 'AI service error' });
    }

    const aiData = await aiRes.json();
    const rawText = (aiData.content || []).map(c => c.text || '').join('');
    const clean = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

    try {
      const lesson = JSON.parse(clean);
      return res.status(200).json({ lesson, track, topic });
    } catch (_) {
      console.error('bible-study: JSON parse failed. Raw:', rawText.slice(0, 300));
      return res.status(500).json({ error: 'Failed to parse AI response', raw: rawText });
    }
  } catch (e) {
    console.error('bible-study: handler error:', e.message);
    return res.status(500).json({ error: 'Internal error' });
  }
};
