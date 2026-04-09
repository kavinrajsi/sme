"use server";

import { SendMailClient } from "zeptomail";

const url = "https://api.zeptomail.com/v1.1/email";
const token = process.env.ZEPTOMAIL_TOKEN;

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
      subject: `Demo Request from ${name}${company ? ` — ${company}` : ""}`,
      htmlbody,
    });

    return { success: true };
  } catch (error) {
    console.error("ZeptoMail error:", error);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}
