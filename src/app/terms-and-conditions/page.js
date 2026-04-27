import { Anek_Tamil } from "next/font/google";
import Link from "next/link";
import styles from "../legal.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  title: "Terms and Conditions",
  description:
    "Read the terms and conditions for using the SearchMadarth® website and services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "/terms-and-conditions",
    title: "Terms and Conditions | SearchMadarth®",
    description:
      "Read the terms and conditions for using the SearchMadarth® website and services.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    {
      "@type": "ListItem",
      position: 2,
      name: "Terms and Conditions",
      item: siteUrl ? `${siteUrl}/terms-and-conditions` : undefined,
    },
  ],
};

export default function TermsAndConditions() {
  return (
    <div className={`${styles.page} ${anekTamil.className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← Back to Home
        </Link>
      </header>
      <main className={styles.content}>
        <h1 className={styles.title}>Terms and Conditions</h1>
        <p className={styles.updated}>Last updated: April 9, 2026</p>

        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the SearchMadarth<sup>&reg;</sup> website
            (searchmadarth.com), you accept and agree to be bound by these
            Terms and Conditions. If you do not agree, please do not use our
            website.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Services</h2>
          <p>
            SearchMadarth<sup>&reg;</sup>, a division of Madarth, provides digital marketing and
            growth services for SMEs in India. Our website offers information
            about our services, a digital readiness quiz, and the ability to
            request demo calls.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Use of Website</h2>
          <p>You agree to use this website only for lawful purposes and in a manner that does not:</p>
          <ul>
            <li>Infringe the rights of any third party</li>
            <li>Restrict or inhibit anyone else from using the website</li>
            <li>Introduce viruses or other malicious code</li>
            <li>Attempt to gain unauthorised access to our systems</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Intellectual Property</h2>
          <p>
            All content on this website - including text, graphics, logos,
            images, and software - is the property of Madarth and is protected
            by applicable intellectual property laws. You may not reproduce,
            distribute, or create derivative works without our prior written
            consent.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Accuracy of Information</h2>
          <p>
            While we strive to keep the information on our website accurate and
            up to date, we make no warranties or representations about the
            completeness, reliability, or accuracy of any information. The quiz
            scores and recommendations are indicative and should not be treated
            as professional advice.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites for your
            convenience. We do not endorse or assume responsibility for the
            content or practices of any linked websites.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, SearchMadarth<sup>&reg;</sup> and Madarth
            shall not be liable for any direct, indirect, incidental, or
            consequential damages arising from your use of or inability to use
            this website or our services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless SearchMadarth<sup>&reg;</sup>, Madarth,
            and their employees from any claims, losses, or damages arising from
            your use of this website or violation of these terms.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of India. Any disputes shall be subject to
            the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any
            time. Changes will be effective immediately upon posting on this
            page. Your continued use of the website constitutes acceptance of
            the updated terms.
          </p>
        </section>
      </main>
    </div>
  );
}
