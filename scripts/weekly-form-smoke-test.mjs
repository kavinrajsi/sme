// Weekly form smoke test.
//
// Drives every public form in a real browser and verifies that each submission
// (a) lands in its Postgres (Neon) table and (b) was emailed (the action sets
// `email_sent = true` only after ZeptoMail accepts the message — so asserting
// the row exists WITH email_sent=true proves both storage and send).
//
// Flows covered: demo modal, home Digital Score quiz + booking (QuizCard),
// /digital-score chat quiz + booking (QuizChat). Every flow is OTP-gated; we
// can't read a real inbox, so for each gate we click "Send code" (which fires a
// real requestOtp + sends a real OTP email), then inject a known-code row into
// form_otp_codes directly so the UI can complete verification.
//
// Run: npm run smoke:forms   (loads .env.local via the package.json script)
// Env: SMOKE_TARGET_URL (default http://localhost:3000),
//      DATABASE_URI, OTP_PEPPER (required),
//      BROWSERBASE_API_KEY/BROWSERBASE_PROJECT_ID (optional, for a remote
//      browser against a PUBLIC target — cannot reach localhost).

import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { Pool } from "pg";

const TARGET = (process.env.SMOKE_TARGET_URL || "http://localhost:3000").replace(/\/$/, "");
const IS_LOCAL = /localhost|127\.0\.0\.1/.test(TARGET);
const KNOWN_CODE = "123456";
const PHONE = "9876543210";
const ARTIFACT_DIR = "smoke-artifacts";

const DATABASE_URI = process.env.DATABASE_URI;
const OTP_PEPPER = process.env.OTP_PEPPER;

for (const [k, v] of Object.entries({ DATABASE_URI, OTP_PEPPER })) {
  if (!v) {
    console.error(`[smoke] Missing required env var: ${k}`);
    process.exit(2);
  }
}

const pool = new Pool({ connectionString: DATABASE_URI });

// Unique per run so DB assertions are precise and OTP rate limits aren't hit.
const RUN_ID = `${Date.now()}`;
const emailFor = (tag) => `smoke+${tag}-${RUN_ID}@searchmadarth.com`;

function hashCode(code) {
  return createHash("sha256").update(`${code}:${OTP_PEPPER}`).digest("hex");
}

// Make `KNOWN_CODE` the only verifiable code for this email: consume any
// outstanding rows (incl. the one the real requestOtp just inserted), then
// insert a fresh known-code row. consumeOtp() picks the most recent unconsumed.
async function injectOtp(email) {
  const e = email.toLowerCase();
  await pool.query(
    "UPDATE form_otp_codes SET consumed_at = $1 WHERE email = $2 AND consumed_at IS NULL",
    [new Date().toISOString(), e],
  );
  await pool.query(
    "INSERT INTO form_otp_codes (email, code_hash, expires_at) VALUES ($1, $2, $3)",
    [e, hashCode(KNOWN_CODE), new Date(Date.now() + 9 * 60 * 1000).toISOString()],
  );
}

// Poll for the row: some actions (e.g. QuizChat) fire the submit without
// awaiting, and email_sent flips only after ZeptoMail responds, so the row may
// land a beat after the UI advances.
async function expectRow(table, email, { tries = 15, delayMs = 1000 } = {}) {
  let last = "no row";
  for (let i = 0; i < tries; i++) {
    const { rows } = await pool.query(
      `SELECT id, email_sent, created_at FROM ${table} WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
      [email.toLowerCase()],
    );
    const data = rows[0];
    if (data?.email_sent === true) return `id=${data.id} email_sent=true`;
    if (data) last = `row ${data.id} stored but email_sent=${data.email_sent}`;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`${table}: ${last} for ${email}`);
}

// Drive an OtpField (#otp-email / #otp-code) through to the verified state.
async function passOtp(page, email) {
  await page.fill("#otp-email", email);
  await page.getByRole("button", { name: "Send code" }).click();
  await page.waitForSelector("#otp-code", { state: "visible", timeout: 30000 });
  await injectOtp(email); // after the real requestOtp row exists
  await page.fill("#otp-code", KNOWN_CODE);
  await page.getByRole("button", { name: "Verify", exact: true }).click();
  await page.waitForSelector("#otp-code", { state: "detached", timeout: 20000 });
}

async function answerQuiz(page, optionTid, nextTid) {
  for (let i = 0; i < 10; i++) {
    const option = page.locator(`[data-testid="${optionTid}"]`).first();
    await option.waitFor({ state: "visible", timeout: 15000 });
    await option.click();
    await page.locator(`[data-testid="${nextTid}"]`).click();
  }
}

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// ---- Flows -------------------------------------------------------------

async function runDemo(page) {
  const email = emailFor("demo");
  await page.goto(`${TARGET}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  // Retry the dispatch until DemoModal's window listener is attached (post-hydration).
  let opened = false;
  for (let i = 0; i < 15 && !opened; i++) {
    await page.evaluate(() => window.dispatchEvent(new Event("open-demo-modal")));
    opened = await page
      .waitForSelector("#otp-email", { state: "visible", timeout: 2000 })
      .then(() => true)
      .catch(() => false);
  }
  if (!opened) throw new Error("demo modal did not open after dispatching open-demo-modal");
  await passOtp(page, email);
  await page.fill('input[name="phone"]', PHONE);
  await page.fill('input[name="name"]', "SMOKE TEST Demo");
  await page.fill('input[name="company"]', "SMOKE TEST Co");
  await page.getByTestId("demo-submit").click();
  await page.waitForSelector("text=We'll Be in Touch!", { timeout: 30000 });
  return expectRow("form_demo_submissions", email);
}

async function runHomeQuizAndBooking(page) {
  const email = emailFor("homeq");
  await page.goto(`${TARGET}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await answerQuiz(page, "quiz-option", "quiz-next");
  await page.waitForSelector("#otp-email", { state: "visible", timeout: 20000 });
  await passOtp(page, email);
  await page.getByTestId("quiz-phone").fill(PHONE);
  await page.getByTestId("quiz-phone-submit").click();
  await page.getByTestId("quiz-book").waitFor({ state: "visible", timeout: 30000 });
  const quiz = await expectRow("form_quiz_submissions", email);

  // Booking reuses the verified quiz email (fields enabled immediately).
  await page.getByTestId("quiz-book").click();
  await page.fill("#booking-name", "SMOKE TEST Booker");
  await page.fill("#booking-biz", "SMOKE TEST Biz");
  await page.fill("#booking-phone", PHONE);
  await page.fill("#booking-date", tomorrowIso());
  await page.locator('[data-testid="quiz-slot"]').first().click();
  await page.getByTestId("quiz-booking-submit").click();
  await page.waitForSelector("text=You're Booked!", { timeout: 30000 });
  const booking = await expectRow("form_booking_submissions", email);
  return `${quiz}; booking ${booking}`;
}

async function runChatQuizAndBooking(page) {
  const email = emailFor("chatq");
  await page.goto(`${TARGET}/digital-score`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await answerQuiz(page, "chat-option", "chat-next");
  await page.waitForSelector("#otp-email", { state: "visible", timeout: 20000 });
  await passOtp(page, email);
  await page.getByTestId("chat-phone").fill(PHONE);
  await page.getByTestId("chat-phone-submit").click();
  await page.getByTestId("chat-book").waitFor({ state: "visible", timeout: 30000 });
  const quiz = await expectRow("form_quiz_submissions", email);

  await page.getByTestId("chat-book").click();
  await page.fill("#booking-name", "SMOKE TEST Booker");
  await page.fill("#booking-biz", "SMOKE TEST Biz");
  await page.fill("#booking-phone", PHONE);
  await page.fill("#booking-date", tomorrowIso());
  await page.locator('[data-testid="chat-slot"]').first().click();
  await page.getByTestId("chat-booking-submit").click();
  await page.waitForSelector("text=You're booked!", { timeout: 30000 });
  const booking = await expectRow("form_booking_submissions", email);
  return `${quiz}; booking ${booking}`;
}

// ---- Browser ----------------------------------------------------------

async function getBrowser() {
  if (process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID && !IS_LOCAL) {
    const { chromium } = await import("playwright-core");
    const ws = `wss://connect.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}&projectId=${process.env.BROWSERBASE_PROJECT_ID}`;
    return { browser: await chromium.connectOverCDP(ws), mode: "browserbase" };
  }
  const { chromium } = await import("playwright");
  return { browser: await chromium.launch({ headless: true }), mode: "local-chromium" };
}

// ---- Main -------------------------------------------------------------

const FLOWS = [
  { name: "demo", run: runDemo },
  { name: "home-quiz+booking", run: runHomeQuizAndBooking },
  { name: "chat-quiz+booking", run: runChatQuizAndBooking },
];

async function main() {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  const { browser, mode } = await getBrowser();
  console.log(`[smoke] target=${TARGET} browser=${mode} run=${RUN_ID}`);

  const results = [];
  for (const flow of FLOWS) {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      const detail = await flow.run(page);
      results.push({ name: flow.name, ok: true, detail });
      console.log(`[smoke] PASS ${flow.name} — ${detail}`);
    } catch (err) {
      const shot = `${ARTIFACT_DIR}/${flow.name.replace(/[^a-z0-9]+/gi, "-")}.png`;
      await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
      results.push({ name: flow.name, ok: false, detail: err.message, shot });
      console.error(`[smoke] FAIL ${flow.name} — ${err.message} (screenshot: ${shot})`);
    } finally {
      await context.close();
    }
  }
  await browser.close();

  console.log("\n=== Smoke results ===");
  for (const r of results) {
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(20)} ${r.detail}`);
  }
  const failed = results.filter((r) => !r.ok);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error("[smoke] fatal:", err);
  process.exit(1);
});
