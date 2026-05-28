import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "sme_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function buildSessionCookie() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = sign(payload);
  return {
    name: COOKIE_NAME,
    value: `${payload}.${signature}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}

export function isSessionValid(cookieValue) {
  if (!cookieValue || typeof cookieValue !== "string") return false;
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return false;
  let expected;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt)) return false;
  return Date.now() < expiresAt;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
