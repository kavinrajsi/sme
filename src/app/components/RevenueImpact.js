"use client";

import Image from "next/image";
import { Anek_Tamil } from "next/font/google";
import styles from "./RevenueImpact.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const stats = [
  {
    icon: "/images/icon-leads.svg",
    number: "340",
    unit: "%",
    description:
      "Average increase in qualified inbound leads within 90 days for our clients.",
  },
  {
    icon: "/images/icon-revenue.svg",
    number: "₹48",
    unit: "Cr+",
    description:
      "Total incremental revenue generated for Indian SMEs across our portfolio.",
  },
  {
    icon: "/images/icon-time.svg",
    number: "60",
    unit: "days",
    description:
      "Median time to first-results from onboarding to measurable ROI impact.",
  },
  {
    icon: "/images/icon-roi.svg",
    number: "4.1",
    unit: "x",
    description:
      "Average return on investment reported by clients after the first year.",
  },
];

function StatCard({ icon, number, unit, description }) {
  return (
    <div className={styles.card}>
      {/* <div className={styles.iconWrapper}>
        <Image
          src={icon}
          alt=""
          width={24}
          height={24}
          className={styles.icon}
        />
      </div> */}
      <div className={styles.cardBody}>
        <div className={styles.statRow}>
          <span className={styles.statNumber}>{number}</span>
          <sub className={styles.statUnit}>{unit}</sub>
        </div>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function RevenueImpact() {
  return (
    <section className={`${styles.section} ${anekTamil.className}`} data-aos="fade-up">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Revenue Impact</span>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>
              Numbers That Actually Matter to Your Business
            </h2>
            <p className={styles.subtitle}>
              We don&apos;t talk in impressions and clicks. We talk in leads,
              customers, and rupees.
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.stats}>
            {stats.map((stat) => (
              <StatCard key={stat.number} {...stat} />
            ))}
          </div>
          <div className={styles.ctaBanner}>
            <div className={styles.ctaText}>
              <h3 className={styles.ctaTitle}>
                Ready to see what&apos;s possible for your business?
              </h3>
              <p className={styles.ctaSubtitle}>
                Get a personalised revenue projection based on your industry,
                city, and business size. No commitment required.
              </p>
            </div>
            <button
              type="button"
              className="btn-base btn-solid"
              onClick={() => window.dispatchEvent(new Event("open-demo-modal"))}
            >
              Get Free Demo Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
