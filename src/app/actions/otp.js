"use server";

import { SendMailClient } from "zeptomail";
import {
  consumeOtp,
  generateCode,
  hashCode,
  insertOtp,
  normalizeEmail,
  recordOtpAndCheckRate,
} from "@/lib/otp";

const ZEPTO_URL = "https://api.zeptomail.com/v1.1/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildOtpEmailHtml(code) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #004c43;">Your SearchMadarth verification code</h2>
      <p style="font-size: 15px; color: #333;">
        Use the code below to verify your email. It expires in 10 minutes.
      </p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #004c43; background: #f6f5f3; padding: 16px 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
        ${code}
      </p>
      <p style="font-size: 13px; color: #666;">
        If you didn&apos;t request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

async function sendOtpMail(email, code) {
  if (process.env.EMAIL_DISABLED === "true") {
    console.warn(`[otp] EMAIL_DISABLED=true. Code for ${email}: ${code}`);
    return;
  }
  const apiKey = process.env.ZEPTO_API_KEY;
  const from = process.env.ZEPTO_FROM_NO_REPLY;
  if (!apiKey || !from) {
    throw new Error("Email not configured: missing ZEPTO_API_KEY or ZEPTO_FROM_NO_REPLY");
  }
  const client = new SendMailClient({ url: ZEPTO_URL, token: apiKey });
  await client.sendMail({
    from: { address: from },
    to: [{ email_address: { address: email } }],
    subject: "Your SearchMadarth verification code",
    htmlbody: buildOtpEmailHtml(code),
  });
}

export async function requestOtp({ email }) {
  const normalized = normalizeEmail(email);
  if (!normalized || !EMAIL_RE.test(normalized)) {
    return { success: false, error: "Enter a valid email address." };
  }

  try {
    const rate = await recordOtpAndCheckRate(normalized);
    if (!rate.allowed) {
      return {
        success: false,
        error: "Too many code requests. Please wait a few minutes and try again.",
      };
    }

    const code = generateCode();
    await insertOtp(normalized, hashCode(code));
    await sendOtpMail(normalized, code);
    return { success: true };
  } catch (error) {
    console.error("[otp] requestOtp error:", error);
    return {
      success: false,
      error: "Could not send the code. Please try again in a moment.",
    };
  }
}

export async function verifyOtp({ email, code }) {
  const normalized = normalizeEmail(email);
  const cleanCode = String(code || "").trim();

  if (!normalized || !EMAIL_RE.test(normalized)) {
    return { success: false, error: "Enter a valid email address." };
  }
  if (!/^\d{6}$/.test(cleanCode)) {
    return { success: false, error: "Enter the 6-digit code from your email." };
  }

  try {
    const result = await consumeOtp(normalized, cleanCode);
    if (result.ok) return { success: true, email: normalized };

    if (result.reason === "expired") {
      return { success: false, error: "Code expired or not found. Request a new code." };
    }
    if (result.reason === "too_many_attempts") {
      return { success: false, error: "Too many attempts. Request a new code." };
    }
    return { success: false, error: "Incorrect code. Please try again." };
  } catch (error) {
    console.error("[otp] verifyOtp error:", error);
    return { success: false, error: "Could not verify the code. Please try again." };
  }
}
