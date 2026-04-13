"use client";

import { Anek_Tamil } from "next/font/google";
import styles from "./OurProcess.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "We understand your business, goals, customers, and current digital gaps in a focused 45-minute session.",
    variant: "dark",
  },
  {
    number: "02",
    title: "Digital Audit",
    description:
      "A full audit of your current online presence — website, SEO, ads, social, and local listings — with a clear gap analysis.",
    variant: "light",
  },
  {
    number: "03",
    title: "Growth Blueprint",
    description:
      "A custom 90-day roadmap with specific actions, timelines, budget allocation, and expected outcomes — built for your goals.",
    variant: "dark",
  },
  {
    number: "04",
    title: "Execution",
    description:
      "Our team implements everything — no lengthy briefs, no hand-holding needed. You focus on your business, we build your growth engine.",
    variant: "light",
  },
  {
    number: "05",
    title: "Track & Scale",
    description:
      "Weekly performance reports, monthly strategy calls, and continuous optimisation to compound your results over time.",
    variant: "dark",
  },
];

function StepCard({ number, title, description, variant }) {
  return (
    <div className={styles.step}>
      <div
        className={`${styles.stepNumber} ${
          variant === "dark" ? styles.stepNumberDark : styles.stepNumberLight
        }`}
      >
        {number}
      </div>
      <div className={styles.stepContent}>
        <h3 className={styles.stepTitle}>{title}</h3>
        <p className={styles.stepDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function OurProcess() {
  return (
    <section id="process" className={`${styles.section} ${anekTamil.className}`} data-aos="fade-up">
      <div className={styles.header}>
        <span className={styles.badge}>Our Process</span>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Clear. Structured. Fast.</h2>
          <p className={styles.subtitle}>
            We follow a proven 5-step process that gets results in weeks, not
            quarters.
          </p>
        </div>
      </div>
      <div className={styles.steps}>
        {steps.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>
      <button
        className="btn-base btn-solid"
        onClick={() => window.dispatchEvent(new Event("open-demo-modal"))}
      >
        GET FREE DEMO CALL
      </button>
    </section>
  );
}
