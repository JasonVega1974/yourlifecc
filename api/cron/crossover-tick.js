// api/cron/crossover-tick.js — PLACEHOLDER (Email Bundle PR 0)
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// Vercel Cron entry (vercel.json): "0 10 * * 3" — Wed 10am UTC,
// once a week. The 6-week cadence doesn't need hourly precision.
//
// Track 3 of the email bundle fills this in. PR 0 ships the entry.
//
// Audience filter Track 3 will apply:
//   plan_status = 'faith_free'
//   AND email IS NOT NULL
//   AND (data->'emailPrefs'->>'crossoverOptOut')::boolean IS NOT TRUE
//   AND (data->'emailPrefs'->>'allOptOut')::boolean IS NOT TRUE
//   AND COALESCE((data->'emailPrefs'->>'crossoverSendCount')::int, 0) < 4
//   AND (
//        (data->'emailPrefs'->>'lastCrossoverSent') IS NULL
//     OR (data->'emailPrefs'->>'lastCrossoverSent')::timestamptz
//          < now() - interval '42 days'
//   );
//
// What this handler WILL do (Track 3):
//   1. Verify Authorization: Bearer ${CRON_SECRET}
//   2. Walk the filtered audience
//   3. For each user, pick the next un-used scripture from a rotating
//      pool (hashed against user_id + crossoverSendCount), build the
//      email from /docs/crossover-highlights.md
//   4. Mint unsubscribe token (list='crossover'), send via Brevo
//   5. Increment crossoverSendCount, stamp lastCrossoverSent
//
// TODO: revisit the hard cap of 4 lifetime sends after first 6 months
// of data. If conversion lag is high, may need a 5th / 6th send;
// if many users hit the 4-send cap without converting, drop to 3.

module.exports = async function handler(req, res){
  const cronSecret = process.env.CRON_SECRET;
  if(cronSecret){
    const auth = req.headers.authorization || '';
    if(auth !== `Bearer ${cronSecret}`){
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
  }

  return res.status(200).json({
    ok:      true,
    handler: 'crossover-tick',
    status:  'placeholder — Track 3 not yet shipped',
    at:      new Date().toISOString()
  });
};
