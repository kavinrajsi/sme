"use client";

import { Anek_Tamil } from "next/font/google";
import styles from "./Hero.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function Hero() {
  return (
    <section className={`${styles.section} ${anekTamil.className}`}>
      <video
        src="/video.mp4"
        poster="/home-page-bg.png"
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
      />
      <div className={styles.content} data-aos="fade-right">
        <span className={styles.badge}>India&apos;s SME Growth Engine</span>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>
            Turn Your Business{" "}
            <span className={styles.titleHighlight}>Digitally</span>{" "}
            Unstoppable.
          </h1>
          <p className={styles.subtitle}>
            We help Indian SMEs build a powerful digital presence that generates
            leads, builds trust, and grows revenue — without the complexity or
            corporate price tag.
          </p>
        </div>
        <div className={styles.actions}>
          <a href="#quiz" className="btn-base btn-solid">
            Check Your Digital Score
          </a>
          <button
            type="button"
            className="btn-base btn-ghost-white"
            onClick={() => window.dispatchEvent(new Event("open-demo-modal"))}
          >
            Free Demo Call
          </button>
        </div>
      </div>
    </section>
  );
}
