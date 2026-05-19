// api/faith-report.js
// Parent Dashboard Faith Reporting — Phase 3B
// CommonJS — DO NOT switch to ESM (has caused 502s on this deploy).
//
// GET  — requires Authorization: Bearer <supabase-jwt>
// Returns:
//   { children: [{ profileId, name, isParent, streak, longestStreak,
//                  lastPrayerDate, lessonsThisWeek, groupCount }] }
//
// Architecture note:
//   Child profiles are NOT separate Supabase auth users.  All family
//   data lives under the parent's single user_id.  profiles.data._profiles
//   holds the slim profile index [{id, name, isParent}].  faith_activity_log
//   rows are keyed by user_id (parent) + profile_id (4-digit child local ID).
//
// Env vars (Vercel project settings):
//   SUPA_SERVICE_KEY — Supabase service_role key (never expose to client)

const SUPA_HOST = 'hrohgwcbfgywkpnvqxhk.supabase.co';

async function supaGet(path, serviceKey) {
  const res = await fetch(`https://${SUPA_HOST}/rest/v1/${path}`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://yourlifecc.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const serviceKey = process.env.SUPA_SERVICE_KEY;
  if (!serviceKey) {
    console.error('faith-report: SUPA_SERVICE_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // 1. Verify JWT — same pattern as bible-study.js
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
    console.error('faith-report: auth error:', e.message);
    return res.status(401).json({ error: 'Auth verification failed' });
  }

  try {
    // 2. Get profiles index from profiles.data._profiles
    //    data is the full D state JSONB blob stored by cloudSync().
    const profRows = await supaGet(
      `profiles?select=data&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
      serviceKey
    );
    const profileData = (profRows && profRows[0] && profRows[0].data) || {};
    const profileIndex = Array.isArray(profileData._profiles) ? profileData._profiles : [];

    // 3. Streak row for the parent account (covers all family activity)
    const streakRows = await supaGet(
      `user_streaks?select=*&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
      serviceKey
    );
    const streakRow = streakRows && streakRows[0];

    // 4. Faith activity last 7 days — all profiles under this user
    const weekAgo = new Date(Date.now() - 7 * 86400 * 1000).toISOString().slice(0, 10);
    const activityRows = await supaGet(
      `faith_activity_log?select=profile_id,activity_type,activity_date&user_id=eq.${encodeURIComponent(userId)}&activity_date=gte.${weekAgo}&order=activity_date.desc`,
      serviceKey
    );

    // 5. Study group count for this user
    let groupCount = 0;
    try {
      const groupRows = await supaGet(
        `study_group_members?select=group_id&user_id=eq.${encodeURIComponent(userId)}`,
        serviceKey
      );
      groupCount = Array.isArray(groupRows) ? groupRows.length : 0;
    } catch (_) {
      // study_group_members may not exist yet — non-fatal
    }

    // 6. Build per-profile summary
    const actByProfile = {};
    if (Array.isArray(activityRows)) {
      activityRows.forEach(row => {
        const pid = row.profile_id || '__parent__';
        if (!actByProfile[pid]) actByProfile[pid] = [];
        actByProfile[pid].push(row);
      });
    }

    function summarize(pid, name, isParent) {
      const acts = actByProfile[pid] || [];
      const prayers = acts.filter(a => a.activity_type === 'prayer');
      const lessons = acts.filter(a =>
        ['devotional', 'study', 'academy_lesson', 'reading_plan'].includes(a.activity_type)
      );
      const lastPrayerDate = prayers.length ? prayers[0].activity_date : null;
      return {
        profileId:      pid === '__parent__' ? null : pid,
        name,
        isParent:       !!isParent,
        streak:         isParent ? (streakRow ? streakRow.current_streak : 0) : 0,
        longestStreak:  isParent ? (streakRow ? streakRow.longest_streak : 0) : 0,
        lastPrayerDate,
        lessonsThisWeek: lessons.length,
        groupCount:      isParent ? groupCount : 0,
      };
    }

    // Build children list — include parent entry plus each child
    let children = [];

    if (profileIndex.length > 0) {
      profileIndex.forEach(p => {
        const pid = p.isParent ? '__parent__' : (p.id || '__parent__');
        children.push(summarize(pid, p.name || 'Unknown', p.isParent));
      });
    } else {
      // No profile index in DB — return parent-only row using D.name
      const parentName = profileData.name || 'Parent';
      children.push(summarize('__parent__', parentName, true));
    }

    return res.status(200).json({ children });

  } catch (e) {
    console.error('faith-report: query error:', e.message);
    return res.status(500).json({ error: 'Failed to load faith report' });
  }
};
