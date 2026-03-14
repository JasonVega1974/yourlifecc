const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function sendSupportEmail(subject: string, htmlContent: string): Promise<boolean> {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'YourLife CC App', email: 'info@kingdom-creatives.com' },
      to: [{ email: 'info@kingdom-creatives.com', name: 'Kingdom Creatives Support' }],
      subject,
      htmlContent,
    }),
  });

  if (res.ok) {
    console.log(`✅ Support email sent: ${subject}`);
    return true;
  } else {
    const errText = await res.text();
    console.error(`❌ Brevo send failed: ${errText}`);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST')   return new Response('Method not allowed', { status: 405 });

  try {
    const { subject, htmlContent } = await req.json();

    if (!subject || !htmlContent) {
      return new Response(
        JSON.stringify({ error: 'Missing subject or htmlContent' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY secret not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const ok = await sendSupportEmail(subject, htmlContent);

    if (ok) {
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

  } catch (err: any) {
    console.error('❌ Handler error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});
