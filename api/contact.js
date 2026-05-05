// Vercel Serverless Function: POST /api/contact
// Receives form submissions from the landing page.
// If RESEND_API_KEY + CONTACT_TO_EMAIL env vars are set, sends an email via Resend.
// Otherwise just logs to Vercel function logs (still returns 200).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body ?? {});
  const { name, email, role, revenue, message } = body;

  if (!isNonEmpty(name) || !isEmail(email) || !isNonEmpty(message)) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando ou inválidos.' });
  }

  const payload = {
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    role: isNonEmpty(role) ? String(role).slice(0, 200) : '',
    revenue: isNonEmpty(revenue) ? String(revenue).slice(0, 200) : '',
    message: String(message).slice(0, 4000),
    receivedAt: new Date().toISOString(),
  };

  console.log('[contact] new submission', payload);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (apiKey && to) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || 'Axis Landing <onboarding@resend.dev>',
          to: [to],
          reply_to: payload.email,
          subject: `Novo diagnóstico — ${payload.name}`,
          text:
            `Nome: ${payload.name}\n` +
            `Email: ${payload.email}\n` +
            `Cargo: ${payload.role}\n` +
            `Faturamento: ${payload.revenue}\n\n` +
            `Mensagem:\n${payload.message}\n`,
        }),
      });
      if (!r.ok) {
        const txt = await r.text();
        console.error('[contact] resend error', r.status, txt);
      }
    } catch (err) {
      console.error('[contact] resend exception', err);
    }
  }

  return res.status(200).json({ ok: true });
}

function isNonEmpty(v) {
  return typeof v === 'string' && v.trim().length > 0;
}
function isEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
