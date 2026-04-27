import { Anek_Tamil } from "next/font/google";
import styles from "./FAQ.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const faqs = [
  {
    question: "What does SearchMadarth® do?",
    answer:
      "SearchMadarth® is a digital marketing agency that helps Indian small and medium enterprises (SMEs) build a powerful digital presence to generate leads, build trust, and grow revenue - without the complexity or corporate price tag.",
  },
  {
    question: "Who do you work with?",
    answer:
      "We work with Indian SMEs across industries including textiles, food & beverage, education, logistics, retail, and manufacturing. Our portfolio includes brands like Sundari Silks, Annapoorna Masalas, Adyar Ananda Bhavan, Veranda IAS, and Frankfinn.",
  },
  {
    question: "What services do you offer?",
    answer:
      "Six focused services: Revenue-Ready Website (CRO + speed + local SEO), Local SEO & Google Visibility, Performance Marketing on Google and Meta ads, Social Media & Brand Trust, WhatsApp Lead Automation, and a Growth Analytics Dashboard.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Our median time from onboarding to first measurable ROI is 60 days. The 90-day Growth Blueprint provides a clear roadmap with timelines and expected outcomes from day one.",
  },
  {
    question: "What does your engagement process look like?",
    answer:
      "A 5-step process: (1) a 45-minute Discovery Call, (2) a Digital Audit of your current online presence, (3) a custom 90-day Growth Blueprint, (4) Execution by our team, and (5) Track & Scale with weekly performance reports and monthly strategy calls.",
  },
  {
    question: "How do I get started?",
    answer:
      "Take the free Digital Score quiz on this page to identify your current gaps, or request a free 45-minute demo call where we'll review your business goals and current digital presence with no commitment required.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className={`${styles.section} ${anekTamil.className}`}
      aria-labelledby="faq-heading"
      data-aos="fade-up"
    >
      <div className={`${styles.container} container`}>
        <div className={styles.header}>
          <span className={styles.badge}>Frequently Asked Questions</span>
          <div className={styles.titleGroup}>
            <h2 id="faq-heading" className={styles.title}>
              Questions Indian SMEs Ask Us
            </h2>
            <p className={styles.subtitle}>
              Straight answers about how we work, who we work with, and what to
              expect.
            </p>
          </div>
        </div>
        <div className={styles.list}>
          {faqs.map((item, i) => (
            <details key={i} className={styles.item} name="faq-accordion">
              <summary className={styles.question}>
                <span>{item.question}</span>
                <span aria-hidden="true" className={styles.icon} />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
