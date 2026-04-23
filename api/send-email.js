export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const phoneFormatted = '+33' + phone.replace(/^0/, '');
  const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'long', timeStyle: 'short' });

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background-color:#015054;padding:24px 32px;text-align:center;">
            <img src="https://d9hhrg4mnvzow.cloudfront.net/landing.costockage.fr/lpbc-thank-you-branding-idf-adw/0cb8bbba-kostok-logo_105k01y000000000000028.png" alt="Kostok" width="140" style="display:block;margin:0 auto;" />
          </td>
        </tr>
        <!-- Badge -->
        <tr>
          <td style="padding:24px 32px 0;text-align:center;">
            <span style="display:inline-block;background-color:#5cb88a;color:#ffffff;font-size:13px;font-weight:700;padding:6px 16px;border-radius:20px;letter-spacing:0.5px;">NOUVEAU LEAD</span>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:20px 32px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
              <tr style="background-color:#f9fafb;">
                <td style="padding:12px 16px;font-size:13px;color:#71717a;font-weight:600;width:160px;border-bottom:1px solid #e4e4e7;">Page</td>
                <td style="padding:12px 16px;font-size:14px;color:#18181b;border-bottom:1px solid #e4e4e7;">Kostok — Self-Stockage Île-de-France</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#71717a;font-weight:600;width:160px;border-bottom:1px solid #e4e4e7;">Ville</td>
                <td style="padding:12px 16px;font-size:14px;color:#18181b;border-bottom:1px solid #e4e4e7;">Île-de-France</td>
              </tr>
              <tr style="background-color:#f9fafb;">
                <td style="padding:12px 16px;font-size:13px;color:#71717a;font-weight:600;width:160px;border-bottom:1px solid #e4e4e7;">Téléphone</td>
                <td style="padding:12px 16px;font-size:14px;color:#18181b;font-weight:700;border-bottom:1px solid #e4e4e7;">${phoneFormatted}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#71717a;font-weight:600;width:160px;">Date</td>
                <td style="padding:12px 16px;font-size:14px;color:#18181b;">${now}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:20px 32px;text-align:center;">
            <a href="tel:${phoneFormatted}" style="display:inline-block;background-color:#fecd61;color:#1c1917;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">Rappeler ce prospect</a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color:#f4f4f5;padding:16px 32px;text-align:center;border-top:1px solid #e4e4e7;">
            <p style="margin:0;font-size:12px;color:#a1a1aa;">Kostok — Self-Stockage Île-de-France</p>
            <p style="margin:4px 0 0;font-size:11px;color:#d4d4d8;">Lead généré depuis landing.costockage.fr</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Leads LP <onboarding@resend.dev>',
      to: ['damien.tamazout@gmail.com'],
      subject: '🟢 Nouveau lead - Kostok Ile-de-France',
      html: html
    })
  });

  const data = await response.json();
  return res.status(response.ok ? 200 : 500).json(data);
}
