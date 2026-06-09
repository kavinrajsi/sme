"use client";

import { Anek_Tamil } from "next/font/google";
import QuizCard from "./QuizCard";
import styles from "./Hero.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <div className={`container ${styles.inner}`}>
        <div className={styles.content} data-aos="fade-right">
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>
              Turn Your Business{" "}
              <span className={styles.titleHighlight}>Digitally</span>{" "}
              Unstoppable.
            </h1>
          </div>
          <div className={styles.actions}>
            <a href="#quiz" className={`btn-base btn-solid ${styles.scoreBtn}`}>
              Check Your Digital Score
            </a>
            {/* <button
              type="button"
              className={`btn-base btn-ghost-white ${styles.demoBtn}`}
              onClick={() => window.dispatchEvent(new Event("open-demo-modal"))}
            >
              Get Free Demo Call
            </button> */}
          </div>
        </div>
        <div className={styles.quizSlot}>
          <QuizCard className={styles.quizCard} />
        </div>
      </div>
    </section>
  );
}
