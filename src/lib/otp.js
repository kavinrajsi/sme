import { createHash, randomInt } from "node:crypto";
import { query } from "./db";

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
  const since = new Date(Date.now() - REQUEST_WINDOW_MS).toISOString();
  const { rows } = await query(
    "SELECT count(*)::int AS count FROM form_otp_codes WHERE email = $1 AND created_at >= $2",
    [email, since],
  );
  if (rows[0].count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false };
  }
  return { allowed: true };
}

export async function insertOtp(email, codeHash) {
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
  await query(
    "INSERT INTO form_otp_codes (email, code_hash, expires_at) VALUES ($1, $2, $3)",
    [email, codeHash, expiresAt],
  );
}

export async function consumeOtp(email, code) {
  const nowIso = new Date().toISOString();
  const { rows } = await query(
    `SELECT id, code_hash, attempts, expires_at, consumed_at FROM form_otp_codes
     WHERE email = $1 AND consumed_at IS NULL AND expires_at > $2
     ORDER BY created_at DESC LIMIT 1`,
    [email, nowIso],
  );
  const row = rows[0] ?? null;
  if (!row) return { ok: false, reason: "expired" };
  if (row.attempts >= MAX_VERIFY_ATTEMPTS) {
    return { ok: false, reason: "too_many_attempts" };
  }

  const expected = hashCode(code);
  const match = expected === row.code_hash;

  if (match) {
    await query(
      "UPDATE form_otp_codes SET consumed_at = $1, attempts = $2 WHERE id = $3",
      [nowIso, row.attempts + 1, row.id],
    );
  } else {
    await query(
      "UPDATE form_otp_codes SET attempts = $1 WHERE id = $2",
      [row.attempts + 1, row.id],
    );
  }

  if (!match) return { ok: false, reason: "wrong_code" };
  return { ok: true };
}

export async function assertVerified(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { ok: false, reason: "missing_email" };
  }
  const since = new Date(Date.now() - VERIFIED_WINDOW_MS).toISOString();
  const { rows } = await query(
    `SELECT id FROM form_otp_codes
     WHERE email = $1 AND consumed_at IS NOT NULL AND consumed_at >= $2
     ORDER BY consumed_at DESC LIMIT 1`,
    [normalized, since],
  );
  if (!rows[0]) return { ok: false, reason: "not_verified" };
  return { ok: true };
}
