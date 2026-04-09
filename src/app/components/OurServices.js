import { Anek_Tamil } from "next/font/google";
import styles from "./OurServices.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const services = [
  [
    {
      number: "01",
      title: "Revenue-Ready Website",
      description:
        "A fast, mobile-first website built not just to look good — but to convert visitors into calls, leads, and walk-ins. Includes CRO, speed optimization, and local SEO.",
      tags: ["Conversion Design", "SEO", "Mobile-First"],
    },
    {
      number: "02",
      title: "Local SEO & Google Visibility",
      description:
        "Rank on the first page when your customers search for you locally. Google Business Profile optimization, citation building, and review management included.",
      tags: ["Google Maps", "Local SEO", "Reviews"],
    },
    {
      number: "03",
      title: "Performance Marketing",
      description:
        "Targeted Google and Meta ads that reach your ideal buyer in your city — with budgets designed for SME realities and ROI-first campaign structure.",
      tags: ["Google Ads", "Meta Ads", "ROI-First"],
    },
  ],
  [
    {
      number: "04",
      title: "Social Media & Brand Trust",
      description:
        "Build a credible, consistent presence on platforms where your customers are already spending time. Strategy, content, and execution all handled.",
      tags: ["Instagram", "LinkedIn", "Content Strategy"],
    },
    {
      number: "05",
      title: "WhatsApp Lead Automation",
      description:
        "Capture, qualify, and nurture leads on WhatsApp automatically so you never lose a hot inquiry to a slow response time again.",
      tags: ["WhatsApp API", "Automation"],
    },
    {
      number: "06",
      title: "Growth Analytics Dashboard",
      description:
        "One simple dashboard showing you exactly how many leads came in, from where, and what\u2019s working updated weekly, explained in plain language.",
      tags: ["Live Reporting", "Attribution", "Insights"],
    },
  ],
];

function ServiceCard({ number, title, description, tags }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.cardTextGroup}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
        </div>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OurServices() {
  return (
    <section id="services" className={`${styles.sectionContainer} ${anekTamil.className}`} data-aos="fade-up">
      <div className={`${styles.section} container`} >
      <div className={styles.header}>
        <span className={styles.badge}>Our Services</span>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            Everything You Need to Grow,
            <br />
            Nothing You Don&apos;t
          </h2>
          <p className={styles.subtitle}>
            Focused services built for Indian SME realities — fast
            implementation, clear metrics, real results.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        {services.map((row, i) => (
          <div key={i} className={styles.row}>
            {row.map((service) => (
              <ServiceCard key={service.number} {...service} />
            ))}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
