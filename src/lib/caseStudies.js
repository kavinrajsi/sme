import { getPayload } from "payload";
import config from "../payload.config.js";
import { caseStudies as fallback } from "../app/components/caseStudiesData.js";

function normalizeBlock(block) {
  if (!block || typeof block !== "object") return block;
  if (block.blockType === "image" && block.media && typeof block.media === "object") {
    return {
      ...block,
      media: {
        url: block.media.url || "",
        alt: block.media.alt || "",
        width: block.media.width,
        height: block.media.height,
      },
    };
  }
  return block;
}

function toRelativeUrl(url) {
  if (!url) return "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && url.startsWith(siteUrl)) return url.slice(siteUrl.length) || "/";
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost") return parsed.pathname;
  } catch {}
  return url;
}

function toCaseStudyShape(doc) {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    image: toRelativeUrl(doc.image?.url || doc.image || ""),
    metaTitle: doc.seo?.metaTitle || "",
    metaDescription: doc.seo?.metaDescription || "",
    ogImage: toRelativeUrl(doc.seo?.ogImage?.url || doc.seo?.ogImage || ""),
    twitterCard: doc.seo?.twitterCard || "summary_large_image",
    body: Array.isArray(doc.body) ? doc.body.map(normalizeBlock) : [],
  };
}

function isConfigured() {
  return Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET);
}

let cachedPayload = null;
async function payloadClient() {
  if (cachedPayload) return cachedPayload;
  cachedPayload = await getPayload({ config });
  return cachedPayload;
}

export async function loadAllCaseStudies() {
  if (!isConfigured()) return fallback;
  try {
    const payload = await payloadClient();
    const { docs } = await payload.find({
      collection: "case-studies",
      limit: 100,
      depth: 2,
      sort: "_order",
    });
    if (!docs.length) return fallback;
    return docs.map(toCaseStudyShape);
  } catch (error) {
    console.error("[case-studies] Payload load failed, using fallback:", error);
    return fallback;
  }
}

export async function loadCaseStudy(slug) {
  if (!isConfigured()) {
    return fallback.find((c) => c.slug === slug) || null;
  }
  try {
    const payload = await payloadClient();
    const { docs } = await payload.find({
      collection: "case-studies",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    if (docs.length) return toCaseStudyShape(docs[0]);
  } catch (error) {
    console.error(`[case-studies] Payload load of ${slug} failed:`, error);
  }
  return fallback.find((c) => c.slug === slug) || null;
}
