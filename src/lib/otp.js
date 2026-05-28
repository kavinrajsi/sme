import { createHash, randomInt } from "node:crypto";
import { getSupabaseAdmin } from "./supabase";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const REQUEST_WINDOW_MS = 10 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const VERIFIED_WINDOW_MS = 30 * 60 * 1000;

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function generateCode() {
  return String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

export function hashCode(code) {
  const pepper = process.env.OTP_PEPPER;
  if (!pepper) throw new Error("OTP_PEPPER is not configured");
  return createHash("sha256").update(`${code}:${pepper}`).digest("hex");
}

export async function recordOtpAndCheckRate(email) {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - REQUEST_WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from("otp_codes")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);
  if (error) throw error;
  if ((count ?? 0) >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false };
  }
  return { allowed: true };
}

export async function insertOtp(email, codeHash) {
  const supabase = getSupabaseAdmin();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
  const { error } = await supabase
    .from("otp_codes")
    .insert({ email, code_hash: codeHash, expires_at: expiresAt });
  if (error) throw error;
}

export async function consumeOtp(email, code) {
  const supabase = getSupabaseAdmin();
  const nowIso = new Date().toISOString();
  const { data: row, error } = await supabase
    .from("otp_codes")
    .select("id, code_hash, attempts, expires_at, consumed_at")
    .eq("email", email)
    .is("consumed_at", null)
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!row) return { ok: false, reason: "expired" };
  if (row.attempts >= MAX_VERIFY_ATTEMPTS) {
    return { ok: false, reason: "too_many_attempts" };
  }

  const expected = hashCode(code);
  const match = expected === row.code_hash;

  const update = match
    ? { consumed_at: nowIso, attempts: row.attempts + 1 }
    : { attempts: row.attempts + 1 };
  const { error: updateError } = await supabase
    .from("otp_codes")
    .update(update)
    .eq("id", row.id);
  if (updateError) throw updateError;

  if (!match) return { ok: false, reason: "wrong_code" };
  return { ok: true };
}

export async function assertVerified(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { ok: false, reason: "missing_email" };
  }
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - VERIFIED_WINDOW_MS).toISOString();
  const { data, error } = await supabase
    .from("otp_codes")
    .select("id")
    .eq("email", normalized)
    .not("consumed_at", "is", null)
    .gte("consumed_at", since)
    .order("consumed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return { ok: false, reason: "not_verified" };
  return { ok: true };
}
