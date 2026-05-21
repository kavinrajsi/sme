#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Browserbase from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

const TARGET_URL = process.env.SMOKE_TARGET_URL ?? "https://sme.searchmadarth.com";
const ARTIFACTS_DIR = "smoke-artifacts";
const API_KEY = process.env.BROWSERBASE_API_KEY;
const PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

if (!API_KEY || !PROJECT_ID) {
  console.error("Missing BROWSERBASE_API_KEY or BROWSERBASE_PROJECT_ID");
  process.exit(2);
}

const RUN_TS = new Date().toISOString().replace(/[:.]/g, "-");

const DEMO_DATA = {
  company: "Browserbase Weekly Smoke Test",
  name: "Browserbase Test",
  email: "qa+browserbase@madarth.com",
  phone: "9876543210",
  message: `Automated weekly smoke test — please ignore. Run: ${RUN_TS}`,
};

const QUIZ_PHONE = "9000000099";

const QUIZ_ANSWERS = [
  "Other",
  "Generate more leads consistently",
  "Something else entirely",
  "No paid ads at all",
  "Word of mouth / Referrals",
  "No website at all",
  "Not active on any",
  "Under ₹5 Lakhs / month",
  "Zero - no marketing budget currently",
  "Fewer than 10 leads / month",
];

async function snapshot(page, label) {
  const file = path.join(ARTIFACTS_DIR, `${RUN_TS}-${label}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  screenshot: ${file}`);
  return file;
}

async function runDemo(page) {
  console.log("→ Demo form (fill + validate only, no submit)");
  await page.goto(TARGET_URL, { waitUntil: "load" });

  await page.getByRole("button", { name: /Get Free Demo Call/i }).first().click();

  await page.locator('input[name="company"]').waitFor({ state: "visible", timeout: 15000 });
  await page.locator('input[name="company"]').fill(DEMO_DATA.company);
  await page.locator('input[name="name"]').fill(DEMO_DATA.name);
  await page.locator('input[name="email"]').fill(DEMO_DATA.email);
  await page.locator('input[name="phone"]').fill(DEMO_DATA.phone);
  await page.locator('textarea[name="message"]').fill(DEMO_DATA.message);

  await snapshot(page, "demo-filled");

  // Verify React state captured every field (catches onChange regressions, masked-input bugs).
  const filled = await page.evaluate(() => ({
    company: document.querySelector('input[name="company"]')?.value,
    name: document.querySelector('input[name="name"]')?.value,
    email: document.querySelector('input[name="email"]')?.value,
    phone: document.querySelector('input[name="phone"]')?.value,
    message: document.querySelector('textarea[name="message"]')?.value,
  }));
  for (const [k, v] of Object.entries(DEMO_DATA)) {
    if (filled[k] !== v) {
      throw new Error(`Demo field "${k}" mismatch: expected "${v}", got "${filled[k]}"`);
    }
  }

  // Close the modal without submitting — keeps the business inbox clean.
  await page.locator(`button:has-text("✕")`).first().click();
  await page.locator('input[name="company"]').waitFor({ state: "detached", timeout: 5000 });

  console.log("  PASS");
}

async function runQuiz(page) {
  console.log("→ Quiz form");

  // Defensive: if the demo flow failed mid-modal, dismiss it so the Hero CTA isn't blocked.
  const closeBtn = page.locator(`button:has-text("✕")`).first();
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click().catch(() => {});
  }

  // Reach the quiz via the Hero CTA, the same path a real user takes.
  await page.getByRole("link", { name: /Check Your Digital Score/i }).first().click();

  const quiz = page.locator("section#quiz");
  await quiz.waitFor({ state: "visible", timeout: 10000 });
  await quiz.scrollIntoViewIfNeeded();

  for (let i = 0; i < QUIZ_ANSWERS.length; i++) {
    const label = QUIZ_ANSWERS[i];
    await quiz
      .locator("button")
      .filter({ hasText: new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*$`) })
      .first()
      .click();

    const advanceName = i === QUIZ_ANSWERS.length - 1 ? /^See My Score$/i : /^Next$/i;
    await quiz.getByRole("button", { name: advanceName }).click();
  }

  const phoneInput = quiz.locator('input[type="tel"]');
  await phoneInput.waitFor({ state: "visible", timeout: 15000 });
  await phoneInput.fill(QUIZ_PHONE);
  await snapshot(page, "quiz-phone-filled");

  await quiz.getByRole("button", { name: /See My Score/i }).click();

  await quiz.getByText(/Score Breakdown/i).waitFor({ timeout: 20000 });
  await snapshot(page, "quiz-success");
  console.log("  PASS");
}

async function main() {
  await mkdir(ARTIFACTS_DIR, { recursive: true });

  const bb = new Browserbase({ apiKey: API_KEY });
  console.log("Creating Browserbase session...");
  const session = await bb.sessions.create({ projectId: PROJECT_ID });
  console.log(`session: ${session.id}`);
  console.log(`live view: https://www.browserbase.com/sessions/${session.id}`);

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const ctx = browser.contexts()[0];
  const page = ctx.pages()[0] ?? (await ctx.newPage());

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  const results = { demo: "PENDING", quiz: "PENDING" };
  const errors = {};

  try {
    await runDemo(page);
    results.demo = "PASS";
  } catch (err) {
    results.demo = "FAIL";
    errors.demo = err.message;
    console.error("  FAIL:", err.message);
    try { await snapshot(page, "demo-failure"); } catch {}
  }

  try {
    await runQuiz(page);
    results.quiz = "PASS";
  } catch (err) {
    results.quiz = "FAIL";
    errors.quiz = err.message;
    console.error("  FAIL:", err.message);
    try { await snapshot(page, "quiz-failure"); } catch {}
  }

  await browser.close();

  const summary = {
    ts: RUN_TS,
    target: TARGET_URL,
    session: session.id,
    results,
    errors,
    consoleErrors,
  };
  await writeFile(
    path.join(ARTIFACTS_DIR, `${RUN_TS}-summary.json`),
    JSON.stringify(summary, null, 2),
  );

  console.log("\n=== Summary ===");
  console.log(`Demo: ${results.demo}`);
  console.log(`Quiz: ${results.quiz}`);
  if (consoleErrors.length) {
    console.log(`Console errors: ${consoleErrors.length}`);
    consoleErrors.forEach((e) => console.log(`  - ${e}`));
  }

  if (results.demo !== "PASS" || results.quiz !== "PASS") process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
