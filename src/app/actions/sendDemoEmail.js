"use server";

import { SendMailClient } from "zeptomail";

const url = "https://api.zeptomail.com/v1.1/email";
const token = process.env.ZEPTOMAIL_TOKEN;

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

  const client = new SendMailClient({ url, token });

  try {
    await client.sendMail({
      from: {
        address: "noreply@madarth.com",
        name: "SearchMadarth",
      },
      to: [
        {
          email_address: {
            address: "manoj@madarth.com",
            name: "Manoj",
          },
        },
      ],
      bcc: [
        {
          email_address: {
            address: "kavin@madarth.com",
            name: "Kavinraj",
          },
        },
      ],
      subject: `New Form Submission in SME Page — Quiz Score: ${score}/100 -- ${phone}`,
      htmlbody,
    });

    return { success: true };
  } catch (error) {
    console.error("ZeptoMail error:", error);
    return { success: false };
  }
}

export async function sendDemoEmail(formData) {
  const { company, name, email, phone, message } = formData;

  const htmlbody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #004c43;">New Demo Call Request</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Company Name</td>
          <td style="padding: 8px;">${company || "—"}</td>
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
          <td style="padding: 8px;">${message || "—"}</td>
        </tr>
      </table>
    </div>
  `;

  const client = new SendMailClient({ url, token });

  try {
    await client.sendMail({
      from: {
        address: "noreply@madarth.com",
        name: "SearchMadarth",
      },
      to: [
        {
          email_address: {
            address: "manoj@madarth.com",
            name: "Manoj",
          },
        },
      ],
      bcc: [
        {
          email_address: {
            address: "kavin@madarth.com",
            name: "Kavinraj",
          },
        },
      ],
      subject: `New Form Submission in SME Page`,
      htmlbody,
    });

    return { success: true };
  } catch (error) {
    console.error("ZeptoMail error:", error);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}
