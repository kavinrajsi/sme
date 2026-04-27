"use server";

import { SendMailClient } from "zeptomail";

const url = "https://api.zeptomail.com/v1.1/email";

function getMailConfig() {
  const apiKey = process.env.ZEPTO_API_KEY;
  const from = process.env.ZEPTO_FROM_NO_REPLY;
  const to = process.env.ZEPTO_TO_BUSINESS;

  const missing = [];
  if (!apiKey) missing.push("ZEPTO_API_KEY");
  if (!from) missing.push("ZEPTO_FROM_NO_REPLY");
  if (!to) missing.push("ZEPTO_TO_BUSINESS");
  if (missing.length) {
    return { ok: false, error: `Email not configured: missing ${missing.join(", ")}` };
  }

  return {
    ok: true,
    apiKey,
    from: { address: from },
    to: [{ email_address: { address: to } }],
    cc: process.env.ZEPTO_CC
      ? [{ email_address: { address: process.env.ZEPTO_CC } }]
      : undefined,
    bcc: process.env.ZEPTO_BCC
      ? [{ email_address: { address: process.env.ZEPTO_BCC } }]
      : undefined,
  };
}

async function sendViaZepto({ subject, htmlbody }) {
  if (process.env.EMAIL_DISABLED === "true") {
    console.warn(`[mail] EMAIL_DISABLED=true, skipping send: ${subject}`);
    return { success: true, skipped: true };
  }

  const config = getMailConfig();
  if (!config.ok) {
    console.error(`[mail] ${config.error}`);
    return { success: false, error: "Failed to send email. Please try again." };
  }

  const client = new SendMailClient({ url, token: config.apiKey });

  try {
    await client.sendMail({
      from: config.from,
      to: config.to,
      cc: config.cc,
      bcc: config.bcc,
      subject,
      htmlbody,
    });
    return { success: true };
  } catch (error) {
    console.error("ZeptoMail error:", error);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}

export async function sendQuizEmail({ phone, score, pillars, questions }) {
  const pillarRows = Object.values(pillars)
    .map(
      (p, i) =>
        `<tr style="${i % 2 === 0 ? "" : "background: #f6f5f3;"}">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">${p.label}</td>
          <td style="padding: 8px;">${p.score} / ${p.max}</td>
        </tr>`
    )
    .join("");

  const questionRows = questions
    .map(
      (q, i) =>
        `<tr style="${i % 2 === 0 ? "" : "background: #f6f5f3;"}">
          <td style="padding: 10px 8px; color: #004c43;"><strong>Q${i + 1}. ${q.title}</strong></td>
          <td style="padding: 10px 8px;">${q.answer}</td>
          <td style="padding: 10px 8px; text-align: center;">${q.score}</td>
        </tr>`
    )
    .join("");

  const htmlbody = `
    <div style="font-family: Arial, sans-serif; max-width: 700px;">
      <h2 style="color: #004c43;">New Quiz Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Phone</td>
          <td style="padding: 8px;">${phone}</td>
        </tr>
        <tr style="background: #f6f5f3;">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Total Score</td>
          <td style="padding: 8px;">${score} / 100</td>
        </tr>
      </table>
      <h3 style="color: #004c43; margin-top: 24px;">Pillar Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${pillarRows}
      </table>
      <h3 style="color: #004c43; margin-top: 24px;">Questions &amp; Answers</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #004c43; color: white;">
          <th style="padding: 10px 8px; text-align: left;">Question</th>
          <th style="padding: 10px 8px; text-align: left;">Answer</th>
          <th style="padding: 10px 8px; text-align: center;">Score</th>
        </tr>
        ${questionRows}
      </table>
    </div>
  `;

  return sendViaZepto({
    subject: `New Form Submission in SME Page - Quiz Score: ${score}/100 -- ${phone}`,
    htmlbody,
  });
}

export async function sendDemoEmail(formData) {
  const { company, name, email, phone, message } = formData;

  const htmlbody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #004c43;">New Demo Call Request</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Company Name</td>
          <td style="padding: 8px;">${company || "-"}</td>
        </tr>
        <tr style="background: #f6f5f3;">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Name</td>
          <td style="padding: 8px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Email</td>
          <td style="padding: 8px;">${email}</td>
        </tr>
        <tr style="background: #f6f5f3;">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Phone</td>
          <td style="padding: 8px;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Message</td>
          <td style="padding: 8px;">${message || "-"}</td>
        </tr>
      </table>
    </div>
  `;

  return sendViaZepto({
    subject: "New Form Submission in SME Page",
    htmlbody,
  });
}
