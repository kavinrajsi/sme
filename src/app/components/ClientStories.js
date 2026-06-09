import { Anek_Tamil } from "next/font/google";
import styles from "./ClientStories.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin", "tamil"],
  weight: ["400", "500", "700"],
});

export const testimonials = [
  {
    variant: "dark",
    paragraphs: [
      "We've partnered with Madarth for our website, SEO, and digital advertising at Indicus Paints. What stands out is their integrity, transparency, and commitment to results. They deliver on what they promise and consistently go beyond the brief with valuable ideas and insights. It's a partnership built on trust and a genuine focus on growth.",
    ],
    name: "B. Gokul",
    role: "Partner, VNC Group",
    logo: "/testimonials/indicus-logo.png",
  },
  {
    variant: "dark",
    paragraphs: [
      "As Veranda IAS's digital marketing partner, Madarth has played a key role in expanding our reach, strengthening brand visibility, and generating quality leads. Their strategic approach, data-driven execution, proactive communication, and deep understanding of the education sector have consistently delivered strong results and made them a trusted growth partner.",
    ],
    name: "Business Head",
    role: "Veranda IAS",
    logo: "/testimonials/veranda-ias-logo.png",
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

function TestimonialCard({ variant, paragraphs, name, role, logo }) {
  const isDark = variant === "dark";

  return (
    <div
      className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}
    >
      <Stars />
      <div className={styles.quoteBlock}>
        <div
          className={`${styles.quoteText} ${isDark ? styles.quoteTextDark : styles.quoteTextLight}`}
        >
          {paragraphs.map((text, i) => (
            <p
              key={i}
              style={
                i < paragraphs.length - 1 ? { marginBottom: 18 } : undefined
              }
            >
              {text}
            </p>
          ))}
        </div>
      </div>
      <div
        className={`${styles.divider} ${isDark ? styles.dividerDark : styles.dividerLight}`}
      >
        <div className={styles.authorRow}>
          {logo && (
            <div className={styles.logo}>
              <img src={logo} alt={role} />
            </div>
          )}
          <div className={styles.author}>
            <span
              className={`${styles.authorName} ${isDark ? styles.authorNameDark : styles.authorNameLight}`}
            >
              {name}
            </span>
            <span
              className={`${styles.authorRole} ${isDark ? styles.authorRoleDark : styles.authorRoleLight}`}
            >
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientStories() {
  return (
    <section
      id="testimonials"
      className={`${styles.sectionWrapper}`}
      data-aos="fade-up"
    >
      <div className="container">
        <div className={`${styles.section} ${anekTamil.className}`}>
          <div className={styles.header}>
            <span className={styles.badge}>Testimonials</span>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>Businesses That Took the Leap</h2>
              <p className={styles.subtitle}>
                Real owners. Real results. Measured in revenue, not vanity
                metrics.
              </p>
            </div>
          </div>
          <div className={styles.cards}>
            {testimonials.map((item) => (
              <TestimonialCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
