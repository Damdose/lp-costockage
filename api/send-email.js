export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const phoneFormatted = '+33' + phone.replace(/^0/, '');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Leads LP <onboarding@resend.dev>',
      to: ['damien.tamazout@gmail.com'],
      subject: 'Nouveau lead - Kostok Ile-de-France',
      text: `Nom de la page : Kostok - Self-Stockage Ile-de-France\nVille : Ile-de-France\nNuméro de téléphone : ${phoneFormatted}`
    })
  });

  const data = await response.json();
  return res.status(response.ok ? 200 : 500).json(data);
}
