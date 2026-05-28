"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import styles from "./page.module.css";

const INITIAL = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);
  return (
    <form action={formAction} className={styles.loginForm}>
      <label className={styles.label} htmlFor="admin-password">
        Password
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        className={styles.input}
        placeholder="Enter admin password"
      />
      {state?.error && <span className={styles.error}>{state.error}</span>}
      <button type="submit" className={styles.submitBtn} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
