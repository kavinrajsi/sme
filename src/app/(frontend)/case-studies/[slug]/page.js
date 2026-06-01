export const revalidate = 60;
export const dynamicParams = true;

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Anek_Tamil } from "next/font/google";
import { loadAllCaseStudies, loadCaseStudy } from "@/lib/caseStudies";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CaseStudyBody from "../../../components/CaseStudyBody";
import styles from "./page.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin", "tamil"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateStaticParams() {
  const all = await loadAllCaseStudies();
  return all.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = await loadCaseStudy(slug);
  if (!study) return {};

  const title = `${study.title} Case Study | SearchMadarth®`;
  const description = study.description;
  const url = `/case-studies/${study.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: study.image ? [study.image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = await params;
  const study = await loadCaseStudy(slug);
  if (!study) notFound();
  const related = (await loadAllCaseStudies())
    .filter((c) => c.slug !== study.slug)
    .slice(0, 3);

  const detailUrl = siteUrl ? `${siteUrl}/case-studies/${study.slug}` : undefined;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case Studies",
        item: siteUrl ? `${siteUrl}/#case-studies` : undefined,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: study.title,
        item: detailUrl,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${study.title} Case Study`,
    description: study.description,
    image: siteUrl ? `${siteUrl}${study.image}` : study.image,
    url: detailUrl,
    mainEntityOfPage: detailUrl,
    isPartOf: { "@type": "WebSite", name: "SearchMadarth®", url: siteUrl },
    author: { "@type": "Organization", name: "SearchMadarth®", url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "SearchMadarth®",
      url: siteUrl,
      logo: siteUrl
        ? {
            "@type": "ImageObject",
            url: `${siteUrl}/meta-og-image.png`,
          }
        : undefined,
    },
  };

  return (
    <>
      <Header solid />
      <main className={`${styles.main} ${anekTamil.className}`}>
        <div className={styles.container}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/" className={styles.crumbLink}>Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#case-studies" className={styles.crumbLink}>
              Case Studies
            </Link>
            <span aria-hidden="true">/</span>
            <span className={styles.crumbCurrent}>{study.title}</span>
          </nav>

          <header className={styles.hero}>
            <h1 className={styles.title}>{study.title}</h1>
            <p className={styles.lede}>{study.description}</p>
          </header>

          <div className={styles.heroImage}>
            <Image
              src={study.image}
              alt={study.title}
              width={1280}
              height={720}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <section className={styles.bodySection}>
            <CaseStudyBody blocks={study.body} />
          </section>

          <section className={styles.cta}>
            <h2 className={styles.ctaTitle}>
              Want results like {study.title}&apos;s?
            </h2>
            <p className={styles.ctaText}>
              Take a 60-second Digital Score quiz or book a free 45-minute
              strategy call with our team.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/digital-score" className={styles.ctaPrimary}>
                Take the Digital Score quiz
              </Link>
              <Link href="/#quiz" className={styles.ctaSecondary}>
                Book a demo call
              </Link>
            </div>
          </section>

          {/* <section
            className={styles.relatedSection}
            aria-label="More case studies"
          >
            <h2 className={styles.relatedTitle}>More case studies</h2>
            <div className={styles.relatedGrid}>
              {related.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/case-studies/${c.slug}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedImage}>
                      <Image
                        src={c.image}
                        alt={c.title}
                        width={400}
                        height={240}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span className={styles.relatedCardTitle}>{c.title}</span>
                  </Link>
                ))}
            </div>
            <Link href="/#case-studies" className={styles.backLink}>
              ← Back to all case studies
            </Link>
          </section> */}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
