import { Anek_Tamil } from "next/font/google";
import styles from "./ClientStories.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin", "tamil"],
  weight: ["400", "500", "700"],
});

const testimonials = [
  {
    variant: "light",
    paragraphs: [
      "We've been working with Madarth for our brand Indicus Paints across website development, SEO, and digital advertising. What sets them apart is their genuine integrity. They tell you exactly what's achievable and then deliver on it.",
      "Their team is result-oriented, transparent, and genuinely invested in your growth. What I appreciate most is that their involvement doesn't stop at the brief. They proactively share ideas and insights even outside the scope of work, which shows how much they care about the brands they partner with. It's a relationship built on trust.",
    ],
    name: "B. Gokul",
    role: "Parnter, VNC Group",
  },
  {
    variant: "dark",
    paragraphs: [
      "As the Business Head of Veranda IAS, I have had the opportunity to closely work with Madarth as our digital marketing partner, and I must acknowledge their outstanding contribution to our growth journey. Their team has consistently demonstrated strategic clarity, strong execution capabilities, and a sharp data-driven approach in managing our campaigns across multiple platforms.",
      "Madarth has been more than just an agency, they have been a dependable pillar in scaling our outreach, strengthening our brand visibility, and driving high-quality lead funnels aligned with our academic objectives. Their proactive communication, quick turnaround time, and deep understanding of the competitive exam ecosystem have significantly enhanced the effectiveness of our marketing initiatives.",
    ],
    name: "Business Head",
    role: "Veranda IAS",
  },
];

function Stars() {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>&#9733;</span>
      ))}
    </div>
  );
}

function TestimonialCard({ variant, paragraphs, name, role }) {
  const isDark = variant === "dark";

  return (
    <div
      className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}
    >
      <Stars />
      <div className={styles.quoteBlock}>
        <p className={styles.quoteMark}>&ldquo;</p>
        <div
          className={`${styles.quoteText} ${isDark ? styles.quoteTextDark : styles.quoteTextLight}`}
        >
          {paragraphs.map((text, i) => (
            <p key={i} style={i < paragraphs.length - 1 ? { marginBottom: 18 } : undefined}>
              {text}
            </p>
          ))}
        </div>
      </div>
      <div className={`${styles.divider} ${isDark ? styles.dividerDark : styles.dividerLight}`}>
        <div className={styles.author}>
          <span className={`${styles.authorName} ${isDark ? styles.authorNameDark : styles.authorNameLight}`}>
            {name}
          </span>
          <span className={`${styles.authorRole} ${isDark ? styles.authorRoleDark : styles.authorRoleLight}`}>
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ClientStories() {
  return (
    <section className={`${styles.section} ${anekTamil.className}`} data-aos="fade-up">
      <div className={styles.header}>
        <span className={styles.badge}>Client Stories</span>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Businesses That Took the Leap</h2>
          <p className={styles.subtitle}>
            Real owners. Real results. Measured in revenue, not vanity metrics.
          </p>
        </div>
      </div>
      <div className={styles.cards}>
        {testimonials.map((item) => (
          <TestimonialCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  );
}
