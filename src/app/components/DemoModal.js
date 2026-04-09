"use client";

import { useState, useEffect, useCallback } from "react";
import { Anek_Tamil } from "next/font/google";
import styles from "./DemoModal.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const INITIAL = { name: "", email: "", phone: "", website: "", message: "" };

function validate(form) {
  const errors = {};

  // Name: min 3 chars, only letters, spaces, dots
  if (!form.name.trim()) {
    errors.name = "Name is required";
  } else if (form.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  } else if (!/^[A-Za-z\s.]+$/.test(form.name.trim())) {
    errors.name = "Only letters, spaces, and dots are allowed";
  }

  // Email: basic format
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  // Phone: exactly 10 digits, Indian mobile (starts with 6-9)
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid 10-digit Indian mobile number";
  }

  // Website: domain format like example.com
  if (!form.website.trim()) {
    errors.website = "Website is required";
  } else if (
    !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(
      form.website.trim()
    )
  ) {
    errors.website = "Enter a valid domain (e.g. example.com)";
  }

  // Message: not required, no validation

  return errors;
}

export default function DemoModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setForm(INITIAL);
    setErrors({});
    setSubmitted(false);
  }, []);

  useEffect(() => {
    window.addEventListener("open-demo-modal", handleOpen);
    return () => window.removeEventListener("open-demo-modal", handleOpen);
  }, [handleOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleChange(e) {
    const { name, value } = e.target;

    // Phone: only allow digits, max 10
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setForm((f) => ({ ...f, phone: digits }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...form,
      website: `https://${form.website.trim()}`,
    };
    console.log("Demo form submitted:", payload);
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    <div
      className={`${styles.overlay} ${anekTamil.className}`}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h4 className={styles.title}>Book a Free Demo Call</h4>
            <p className={styles.subtitle}>
              Tell us about your business — we&apos;ll show you what&apos;s
              possible.
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  name="name"
                  type="text"
                  placeholder="Eg: Rajesh Kumar"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  name="email"
                  type="email"
                  placeholder="Eg: rajesh@company.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Phone <span className={styles.required}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Eg: 9876543210"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <span className={styles.error}>{errors.phone}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Website <span className={styles.required}>*</span>
                </label>
                <div className={styles.websiteWrap}>
                  <span className={styles.websitePrefix}>https://</span>
                  <input
                    className={`${styles.input} ${styles.websiteInput} ${errors.website ? styles.inputError : ""}`}
                    name="website"
                    type="text"
                    placeholder="example.com"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>
                {errors.website && (
                  <span className={styles.error}>{errors.website}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  className={styles.input}
                  name="message"
                  rows={3}
                  placeholder="Tell us about your goals (optional)"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-submit">
                Request Demo Call
              </button>
            </form>
          ) : (
            <div className={styles.success}>
              <div className={styles.successIcon}>🎉</div>
              <h3 className={styles.successTitle}>We&apos;ll Be in Touch!</h3>
              <p className={styles.successText}>
                Thanks for reaching out. Our team will contact you within 24
                hours to schedule your free demo call.
              </p>
              <button
                type="button"
                className="btn-base btn-solid-teal"
                onClick={() => setOpen(false)}
                style={{ margin: "0 auto" }}
              >
                Done →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
