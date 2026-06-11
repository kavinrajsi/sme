import { loadAllCaseStudies } from "@/lib/caseStudies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Bump the relevant constant when a page's content meaningfully changes.
// Format: ISO date string. The legal-page values must match the
// "Last updated: ..." text shown inside the page itself.
const LASTMOD_HOME = "2026-04-27";
const LASTMOD_PRIVACY = "2026-04-09";
const LASTMOD_TERMS = "2026-04-09";
const LASTMOD_DIGITAL_SCORE = "2026-05-27";
const LASTMOD_CASE_STUDIES = "2026-05-28";

export default async function sitemap() {
  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required to generate sitemap.xml. Set it in .env.local (and your deploy environment)."
    );
  }

  const base = siteUrl.replace(/\/$/, "");
  const studies = await loadAllCaseStudies();

  const caseStudyEntries = studies.map((study) => ({
    url: `${base}/case-studies/${study.slug}`,
    // Prefer the CMS edit time; fall back to the manual constant for the
    // bundled fallback data (which has no updatedAt).
    lastModified: study.updatedAt
      ? new Date(study.updatedAt)
      : new Date(LASTMOD_CASE_STUDIES),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: new Date(LASTMOD_HOME),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/digital-score`,
      lastModified: new Date(LASTMOD_DIGITAL_SCORE),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...caseStudyEntries,
    {
      url: `${base}/privacy-policy`,
      lastModified: new Date(LASTMOD_PRIVACY),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms-and-conditions`,
      lastModified: new Date(LASTMOD_TERMS),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
