// CommonJS — Vercel Functions handler. Keep CommonJS; switching to ESM caused
// 502s on this deploy in the past.
//
// Premium TTS endpoint — scaffolded for future ElevenLabs integration.
// Currently returns Web Speech API config for all tiers (free fallback).
//
// Upgrade path when ready:
//   1. Add ELEVENLABS_API_KEY to Vercel environment variables
//   2. Set D.user.tier = 'premium' via Stripe webhook (profiles table)
//   3. Uncomment the ElevenLabs block below
//   4. Client getOptimalTTS() in faith.js will detect premium tier and fetch here

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceId, userTier } = req.body || {};

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required' });
  }

  if (userTier === 'premium') {
    // Premium tier — ElevenLabs integration (uncomment when API key is set):
    //
    // const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
    // const vid = voiceId || 'pNInz6obpgDQGcFmaJgB'; // Adam — natural male voice
    // try {
    //   const resp = await fetch(
    //     'https://api.elevenlabs.io/v1/text-to-speech/' + vid,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'xi-api-key': ELEVENLABS_KEY,
    //         'Content-Type': 'application/json',
    //         'Accept': 'audio/mpeg'
    //       },
    //       body: JSON.stringify({
    //         text: text.trim(),
    //         model_id: 'eleven_monolingual_v1',
    //         voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    //       })
    //     }
    //   );
    //   if (resp.ok) {
    //     res.setHeader('Content-Type', 'audio/mpeg');
    //     const buf = await resp.arrayBuffer();
    //     return res.send(Buffer.from(buf));
    //   }
    // } catch (_) {}

    // Fall through to free tier until ElevenLabs is configured.
    return res.status(200).json({
      provider: 'web-speech-api',
      message: 'Premium TTS coming soon — using Web Speech for now',
      config: { rate: 0.9, pitch: 1.0, volume: 1.0 }
    });
  }

  // Free tier (default) — client uses browser-native Web Speech API.
  return res.status(200).json({
    provider: 'web-speech-api',
    message: 'Use browser-native TTS',
    config: { rate: 0.9, pitch: 1.0, volume: 1.0 }
  });
};
