import QuizChat from "../components/QuizChat";
import styles from "./page.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  title: "Digital Score Quiz",
  description:
    "Take the free Digital Score quiz to benchmark your SME's online presence and get a personalised growth report from SearchMadarth®.",
  alternates: {
    canonical: "/digital-score",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/digital-score",
    title: "Digital Score Quiz | SearchMadarth®",
    description:
      "Benchmark your SME's online presence in minutes and get a personalised growth report.",
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
      name: "Digital Score",
      item: siteUrl ? `${siteUrl}/digital-score` : undefined,
    },
  ],
};

export default function DigitalScorePage() {
  return (
    <main className={styles.main}>
      <QuizChat />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
