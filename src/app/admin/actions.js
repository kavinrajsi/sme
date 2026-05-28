"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildSessionCookie,
  clearSessionCookie,
  SESSION_COOKIE_NAME,
} from "@/lib/adminAuth";

export async function loginAction(_prevState, formData) {
  const submitted = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { error: "Admin password is not configured on the server." };
  }
  if (submitted.length === 0) {
    return { error: "Password is required." };
  }
  if (submitted !== expected) {
    return { error: "Incorrect password." };
  }
  const cookieStore = await cookies();
  cookieStore.set(buildSessionCookie());
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set(clearSessionCookie());
  redirect("/admin");
}

export async function clearSessionOnRequest() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
