import { Anek_Tamil } from "next/font/google";
import Link from "next/link";
import styles from "../legal.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Privacy Policy — SearchMadarth",
  description:
    "Learn how SearchMadarth collects, uses, and protects your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className={`${styles.page} ${anekTamil.className}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← Back to Home
        </Link>
      </header>
      <main className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: April 9, 2026</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            SearchMadarth (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a
            division of Madarth, is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website search.madarth.com.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <p>We may collect information that you voluntarily provide, including:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name</li>
            <li>Messages or inquiries submitted through our forms</li>
            <li>Quiz responses and scores</li>
          </ul>
          <p>
            We may also automatically collect certain information when you visit
            our website, such as your IP address, browser type, device
            information, and pages visited.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your inquiries and schedule demo calls</li>
            <li>Provide personalised digital growth recommendations</li>
            <li>Send relevant communications about our services</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Sharing of Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information with trusted service providers
            who assist us in operating our website and conducting our business,
            provided they agree to keep your information confidential.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal
            information. However, no method of transmission over the internet or
            electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Cookies</h2>
          <p>
            Our website may use cookies and similar tracking technologies to
            enhance your browsing experience and analyse website traffic. You can
            choose to disable cookies through your browser settings.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites and
            encourage you to review their privacy policies.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:kavin@madarth.com">kavin@madarth.com</a>.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be posted on this page with an updated revision date.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p>
            <strong>SearchMadarth (a division of Madarth)</strong>
            <br />
            Email:{" "}
            <a href="mailto:kavin@madarth.com">kavin@madarth.com</a>
            <br />
            Phone:{" "}
            <a href="tel:+918667767447">+91 86677 67447</a>
          </p>
        </section>
      </main>
    </div>
  );
}
