"use server";

import { SendMailClient } from "zeptomail";
import { assertVerified, normalizeEmail } from "@/lib/otp";
import { getSupabaseAdmin } from "@/lib/supabase";

const url = "https://api.zeptomail.com/v1.1/email";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const subjectPagePrefix = `New Form Submission in SME${siteUrl ? ` [${siteUrl}/]` : ""} Page`;

function siteFooter(campaign) {
  const year = new Date().getFullYear();
  const href = `https://sme.searchmadarth.com/?utm_source=admin_email&utm_medium=email&utm_campaign=${campaign}`;
  return `
    <p style="margin: 24px 0 0; font-size: 12px; color: #7c8a83; font-family: Arial, sans-serif;">
      &copy; ${year} SearchMadarth&reg; &middot;
      <a href="${href}" style="color:#7c8a83;text-decoration:underline;">sme.searchmadarth.com</a>
    </p>
  `;
}

async function recordSubmission(table, row) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(table)
      .insert(row)
      .select("id")
      .single();
    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error(`[supabase] insert into ${table} failed:`, error);
    return null;
  }
}

async function markEmailSent(table, id) {
  if (!id) return;
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from(table).update({ email_sent: true }).eq("id", id);
  } catch (error) {
    console.error(`[supabase] mark email_sent on ${table} failed:`, error);
  }
}

async function guardVerifiedEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { ok: false, error: "Email is required." };
  }
  try {
    const result = await assertVerified(normalized);
    if (!result.ok) {
      return {
        ok: false,
        error: "Please verify your email before submitting.",
      };
    }
    return { ok: true, email: normalized };
  } catch (error) {
    console.error("[mail] assertVerified failed:", error);
    return { ok: false, error: "Could not verify email. Please try again." };
  }
}

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

export async function sendQuizEmail({ email, phone, score, pillars, questions }) {
  const guard = await guardVerifiedEmail(email);
  if (!guard.ok) return { success: false, error: guard.error };

  const submissionId = await recordSubmission("form_quiz_submissions", {
    email: guard.email,
    phone,
    score,
    pillars,
    answers: questions,
  });

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
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Email</td>
          <td style="padding: 8px;">${guard.email}</td>
        </tr>
        <tr style="background: #f6f5f3;">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Phone</td>
          <td style="padding: 8px;">${phone}</td>
        </tr>
        <tr>
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
      ${siteFooter("quiz_submission")}
    </div>
  `;

  const result = await sendViaZepto({
    subject: `${subjectPagePrefix} - Quiz Score: ${score}/100 -- ${guard.email}`,
    htmlbody,
  });
  if (result.success) await markEmailSent("form_quiz_submissions", submissionId);
  return result;
}

export async function sendBookingEmail({
  email,
  name,
  business,
  phone,
  date,
  slot,
  score,
}) {
  const guard = await guardVerifiedEmail(email);
  if (!guard.ok) return { success: false, error: guard.error };

  const submissionId = await recordSubmission("form_booking_submissions", {
    email: guard.email,
    phone,
    name,
    business: business || null,
    booking_date: date,
    slot,
    score: typeof score === "number" ? score : null,
  });

  const htmlbody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #004c43;">New Strategy Call Booking</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Email</td>
          <td style="padding: 8px;">${guard.email}</td>
        </tr>
        <tr style="background: #f6f5f3;">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Name</td>
          <td style="padding: 8px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Business</td>
          <td style="padding: 8px;">${business || "-"}</td>
        </tr>
        <tr style="background: #f6f5f3;">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">WhatsApp</td>
          <td style="padding: 8px;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Preferred Date</td>
          <td style="padding: 8px;">${date}</td>
        </tr>
        <tr style="background: #f6f5f3;">
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Preferred Time</td>
          <td style="padding: 8px;">${slot}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #004c43;">Digital Score</td>
          <td style="padding: 8px;">${typeof score === "number" ? `${score} / 100` : "—"}</td>
        </tr>
      </table>
      ${siteFooter("booking")}
    </div>
  `;

  const result = await sendViaZepto({
    subject: `${subjectPagePrefix} - Strategy Call Booking - ${name} (${guard.email})`,
    htmlbody,
  });
  if (result.success) await markEmailSent("form_booking_submissions", submissionId);
  return result;
}

export async function sendDemoEmail(formData) {
  const { company, name, email, phone, message } = formData;

  const guard = await guardVerifiedEmail(email);
  if (!guard.ok) return { success: false, error: guard.error };

  const submissionId = await recordSubmission("form_demo_submissions", {
    email: guard.email,
    phone,
    name,
    company: company || null,
    message: message || null,
  });

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
          <td style="padding: 8px;">${guard.email}</td>
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
      ${siteFooter("demo_submission")}
    </div>
  `;

  const result = await sendViaZepto({
    subject: subjectPagePrefix,
    htmlbody,
  });
  if (result.success) await markEmailSent("form_demo_submissions", submissionId);
  return result;
}
