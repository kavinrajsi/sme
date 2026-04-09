import Image from "next/image";
import { Anek_Tamil } from "next/font/google";
import styles from "./CaseStudy.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin", "tamil"],
  weight: ["400", "500", "600", "700"],
});

const caseStudies = [
  {
    image: "/images/sundari-silks.png",
    title: "Sundari Silks",
    description:
      "Seamlessly integrating the digital realm for a traditional textile brand by creating great experiences",
  },
  {
    image: "/images/veranda-ias.png",
    title: "Veranda IAS",
    description:
      "Digital lead generation for a civil services training institute, closing admissions within 90 days of its inception",
  },
  {
    image: "/images/annapoorna.png",
    title: "Annapoorna Masalas and Spices",
    description:
      "Concept and execution of a hyper-local digital campaign for a leading masalas and spices brand",
  },
];

export default function CaseStudy() {
  return (
    <section id="case-studies" className={`${styles.section} ${anekTamil.className}`} data-aos="fade-up">
      <div className={styles.header}>
        <span className={styles.badge}>Case Studies</span>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            SMEs Scaling Through Digital Transformation
          </h2>
          <p className={styles.subtitle}>
            These case studies highlight practical strategies, measurable impact,
            and sustainable growth tailored for evolving business needs.
          </p>
        </div>
      </div>
      <div className={styles.cards}>
        {caseStudies.map((study) => (
          <div key={study.title} className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src={study.image}
                alt={study.title}
                width={387}
                height={226}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{study.title}</h3>
              <p className={styles.cardDescription}>{study.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
