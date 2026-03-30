export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, message, source } = req.body;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;border-radius:10px;overflow:hidden;">
      <div style="background:#cadb3f;padding:24px 32px;">
        <h2 style="margin:0;color:#0b1209;font-size:20px;">New ${source} Request</h2>
        <p style="margin:4px 0 0;color:rgba(11,18,9,0.65);font-size:13px;">Submitted via SearchMadarth® website</p>
      </div>
      <div style="padding:28px 32px;background:#ffffff;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:110px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;">${email}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;">${phone}</td></tr>
          ${company ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Company</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;">${company}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:10px 0;color:#888;vertical-align:top;">Message</td><td style="padding:10px 0;color:#111;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
        </table>
      </div>
      <div style="padding:16px 32px;background:#f9f9f9;font-size:12px;color:#aaa;">
        SearchMadarth® · Digital Growth for SMEs
      </div>
    </div>`;

  try {
    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Zoho-enczapikey ${process.env.ZEPTO_TOKEN}`,
      },
      body: JSON.stringify({
        from: { address: 'noreply@madarth.com', name: 'SearchMadarth® Website' },
        to: [{ email_address: { address: 'manoj@madarth.com', name: 'Manoj' } }],
        cc: [{ email_address: { address: 'kavin@madarth.com', name: 'Kavinraj' } }],
        reply_to: [{ address: email, name: name }],
        subject: `[${source}] ${name}${company ? ' — ' + company : ''}`,
        htmlbody: html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Mail send failed' });
  }
}
