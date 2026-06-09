import { NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";
import { getSupabaseAdmin } from "@/lib/supabase";

// Daily DB liveness check, triggered by Vercel Cron (see vercel.json).
// Runs a lightweight head-count query against Postgres (via Supabase). On
// failure it sends an alert email through the existing ZeptoMail setup.
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ZEPTO_URL = "https://api.zeptomail.com/v1.1/email";
const PROBE_TABLE = "case_studies";

async function checkDb() {
  const start = Date.now();
  try {
    const supabase = getSupabaseAdmin();
    // head: true => no rows transferred, just validates the round-trip + count.
    const { error } = await supabase
      .from(PROBE_TABLE)
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: error?.message || String(error),
    };
  }
}

async function sendFailureAlert(detail) {
  const apiKey = process.env.ZEPTO_API_KEY;
  const from = process.env.ZEPTO_FROM_NO_REPLY;
  const to = process.env.ZEPTO_TO_BUSINESS;

  if (process.env.EMAIL_DISABLED === "true") {
    console.warn("[health/db] EMAIL_DISABLED=true, skipping alert email");
    return;
  }
  if (!apiKey || !from || !to) {
    console.error(
      "[health/db] Cannot send alert: missing ZEPTO_API_KEY / ZEPTO_FROM_NO_REPLY / ZEPTO_TO_BUSINESS",
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "sme.searchmadarth.com";
  const when = new Date().toISOString();
  const htmlbody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #b00020;">⚠️ Database health check failed</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding:8px;font-weight:bold;">Site</td><td style="padding:8px;">${siteUrl}</td></tr>
        <tr style="background:#f6f5f3;"><td style="padding:8px;font-weight:bold;">Time (UTC)</td><td style="padding:8px;">${when}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Probe</td><td style="padding:8px;">SELECT count on ${PROBE_TABLE}</td></tr>
        <tr style="background:#f6f5f3;"><td style="padding:8px;font-weight:bold;">Latency</td><td style="padding:8px;">${detail.latencyMs} ms</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Error</td><td style="padding:8px;color:#b00020;">${detail.error}</td></tr>
      </table>
    </div>
  `;

  try {
    const client = new SendMailClient({ url: ZEPTO_URL, token: apiKey });
    await client.sendMail({
      from: { address: from },
      to: [{ email_address: { address: to } }],
      subject: `🚨 DB health check FAILED — ${siteUrl}`,
      htmlbody,
    });
  } catch (error) {
    console.error("[health/db] Failed to send alert email:", error);
  }
}

async function handle(request) {
  // When CRON_SECRET is set, require it (Vercel Cron sends it automatically as
  // an Authorization: Bearer header). Blocks unauthenticated public hits.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await checkDb();
  if (!result.ok) {
    console.error("[health/db] DB check failed:", result.error);
    await sendFailureAlert(result);
    return NextResponse.json(result, { status: 503 });
  }

  return NextResponse.json(result, { status: 200 });
}

export async function GET(request) {
  return handle(request);
}
