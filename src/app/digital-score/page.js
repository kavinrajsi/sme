import QuizChat from "../components/QuizChat";
import { quizData } from "../components/quizConfig";
import styles from "./page.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const pageUrl = siteUrl ? `${siteUrl}/digital-score` : undefined;

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
      item: pageUrl,
    },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Digital Score Quiz",
  description:
    "Free 10-question quiz that benchmarks an Indian SME's online presence across five growth pillars and emails a personalised report.",
  url: pageUrl,
  inLanguage: "en-IN",
  isPartOf: { "@type": "WebSite", name: "SearchMadarth®", url: siteUrl },
  primaryImageOfPage: siteUrl
    ? { "@type": "ImageObject", url: `${siteUrl}/meta-og-image.png` }
    : undefined,
  potentialAction: {
    "@type": "AssessAction",
    name: "Take the Digital Score quiz",
    target: pageUrl,
  },
};

const quizSchema = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "SearchMadarth® Digital Score",
  about:
    "Benchmark of an SME's digital readiness across five growth pillars: presence, search, marketing, automation, and analytics.",
  educationalAlignment: {
    "@type": "AlignmentObject",
    alignmentType: "assesses",
    targetName: "Digital readiness of small and medium enterprises in India",
  },
  numberOfQuestions: quizData.length,
  hasPart: quizData.map((q) => ({
    "@type": "Question",
    name: q.title,
    text: q.title,
    answerCount: q.options.length,
  })),
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "SearchMadarth®", url: siteUrl },
  provider: { "@type": "Organization", name: "SearchMadarth®", url: siteUrl },
};

export default function DigitalScorePage() {
  return (
    <main className={styles.main}>
      <QuizChat />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
    </main>
  );
}
