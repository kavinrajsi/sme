import { Anek_Tamil } from "next/font/google";
import { loadAllCaseStudies } from "@/lib/caseStudies";
import CaseStudyCarousel from "./CaseStudyCarousel";
import styles from "./CaseStudy.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin", "tamil"],
  weight: ["400", "500", "600", "700"],
});

export default async function CaseStudy() {
  const studies = await loadAllCaseStudies();
  return (
    <section
      id="case-studies"
      className={`${styles.section} ${anekTamil.className}`}
      data-aos="fade-up"
    >
      <div className={styles.header}>
        <span className={styles.badge}>Case Studies</span>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            SMEs Scaling Through Digital Transformation
          </h2>
          <p className={styles.subtitle}>
            These case studies highlight practical strategies, measurable
            impact, and sustainable growth tailored for evolving business
            needs.
          </p>
        </div>
      </div>
      <div className="container">
        <CaseStudyCarousel studies={studies} />
      </div>
    </section>
  );
}
