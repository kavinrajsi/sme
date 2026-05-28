"use client";

import { useState } from "react";
import { requestOtp, verifyOtp } from "../actions/otp";
import styles from "./OtpField.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function OtpField({
  defaultEmail = "",
  defaultVerified = false,
  onVerified,
  label = "Email",
  required = true,
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [stage, setStage] = useState(defaultVerified ? "verified" : "idle");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const isVerified = stage === "verified";
  const showCodeInput = stage === "sent" || stage === "verifying";

  const handleSend = async () => {
    setError("");
    setInfo("");
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setStage("sending");
    const res = await requestOtp({ email: trimmed });
    setBusy(false);
    if (!res.success) {
      setStage("idle");
      setError(res.error || "Could not send the code.");
      return;
    }
    setEmail(trimmed);
    setStage("sent");
    setInfo(`Code sent to ${trimmed}. Check your inbox.`);
  };

  const handleVerify = async () => {
    setError("");
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setBusy(true);
    setStage("verifying");
    const res = await verifyOtp({ email, code });
    setBusy(false);
    if (!res.success) {
      setStage("sent");
      setError(res.error || "Incorrect code.");
      return;
    }
    setStage("verified");
    setInfo("Email verified.");
    onVerified?.(res.email || email);
  };

  const handleResend = async () => {
    setCode("");
    await handleSend();
  };

  const handleChangeEmail = () => {
    setStage("idle");
    setCode("");
    setError("");
    setInfo("");
  };

  if (isVerified) {
    return (
      <div className={styles.wrap}>
        <label className={styles.label}>
          {label}
          {required ? <span className={styles.required}> *</span> : null}
        </label>
        <div className={styles.verifiedRow}>
          <span className={styles.checkIcon} aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
            </svg>
          </span>
          <span className={styles.verifiedEmail}>{email}</span>
          <button type="button" className={styles.linkBtn} onClick={handleChangeEmail}>
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor="otp-email">
        {label}
        {required ? <span className={styles.required}> *</span> : null}
      </label>
      <div className={styles.inputRow}>
        <input
          id="otp-email"
          className={`${styles.input} ${error && stage === "idle" ? styles.inputError : ""}`}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          value={email}
          disabled={showCodeInput || stage === "sending"}
          onChange={(e) => setEmail(e.target.value)}
        />
        {stage !== "sent" && stage !== "verifying" && (
          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={busy}
          >
            {stage === "sending" ? "Sending..." : "Send code"}
          </button>
        )}
        {(stage === "sent" || stage === "verifying") && (
          <button
            type="button"
            className={styles.linkBtnInline}
            onClick={handleChangeEmail}
            disabled={busy}
          >
            Edit
          </button>
        )}
      </div>

      {showCodeInput && (
        <div className={styles.codeBlock}>
          <label className={styles.label} htmlFor="otp-code">
            Enter 6-digit code
          </label>
          <div className={styles.inputRow}>
            <input
              id="otp-code"
              className={`${styles.input} ${styles.codeInput} ${error ? styles.inputError : ""}`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              value={code}
              onChange={(e) => {
                setError("");
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              }}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={handleVerify}
              disabled={busy || code.length !== 6}
            >
              {stage === "verifying" ? "Verifying..." : "Verify"}
            </button>
          </div>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={handleResend}
            disabled={busy}
          >
            Resend code
          </button>
        </div>
      )}

      {info && !error && <span className={styles.info}>{info}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
