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
  const spacedCode = String(code).split("").join("&nbsp;&nbsp;");
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your SearchMadarth&reg; verification code</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f1a12;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f5f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
            <tr>
              <td align="center" style="padding:0 0 24px 0;">
                <div style="display:inline-block;background:#004c43;color:#cadb3f;padding:8px 14px;border-radius:6px;font-weight:800;font-size:14px;letter-spacing:0.5px;">
                  SearchMadarth&reg;
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:14px;border-top:60px solid #004c43;padding:28px 28px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding-bottom:14px;">
                      <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;color:#0f1a12;">
                        Let&rsquo;s verify your email
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;">
                      <p style="margin:0;font-size:15px;line-height:1.55;color:#3f4a45;">
                        Hi there,
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:20px;">
                      <p style="margin:0;font-size:15px;line-height:1.55;color:#3f4a45;">
                        Please use the verification code below to confirm your email on SearchMadarth&reg;.
                        The code will expire in <strong style="color:#0f1a12;">10 minutes</strong>.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style="background:#f1f5f8;border-radius:12px;padding:22px 20px;text-align:center;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:30px;font-weight:700;letter-spacing:2px;color:#0f1a12;">
                        ${spacedCode}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:22px;">
                      <p style="margin:0;font-size:13px;line-height:1.55;color:#6b7a73;">
                        Didn&rsquo;t request this code? You can safely ignore this email &mdash; someone may have typed your address by mistake.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 0 0 0;">
                <p style="margin:0;font-size:12px;color:#7c8a83;">
                  &copy; ${year} SearchMadarth&reg; &middot; <a href="https://sme.searchmadarth.com/?utm_source=otp_email&utm_medium=email&utm_campaign=verification" style="color:#7c8a83;text-decoration:underline;">sme.searchmadarth.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendOtpMail(email, code) {
  if (process.env.EMAIL_DISABLED === "true") {
    console.warn(`[otp] EMAIL_DISABLED=true. Code for ${email}: ${code}`);
    return;
  }
  const apiKey = process.env.ZEPTO_API_KEY;
  // Verification codes are sent from the SearchMadarth domain (separate from
  // the @madarth.com address used for the business-facing form emails).
  const from = process.env.ZEPTO_FROM_OTP || "noreply@searchmadarth.com";
  if (!apiKey) {
    throw new Error("Email not configured: missing ZEPTO_API_KEY");
  }
  const client = new SendMailClient({ url: ZEPTO_URL, token: apiKey });
  await client.sendMail({
    from: { address: from, name: "SearchMadarth" },
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
