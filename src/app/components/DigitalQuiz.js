import { Anek_Tamil } from "next/font/google";
import QuizCard from "./QuizCard";
import styles from "./DigitalQuiz.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function DigitalQuiz() {
  return (
    <section className={`${styles.sectionContainer} ${anekTamil.className}`}>
      <div className={`${styles.section} container`}>
        <div className={styles.left} data-aos="fade-up">
          <span className={styles.badge}>Free Digital Quiz</span>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>
              How Digitally Ready Is{" "}
              <span className={styles.titleHighlight}>Your Business?</span>
            </h2>
            <p className={styles.subtitle}>
              Most SME owners don&apos;t know what&apos;s costing them customers
              online. Find out in 60 seconds.
            </p>
          </div>
        </div>

        <QuizCard />
      </div>
    </section>
  );
}
