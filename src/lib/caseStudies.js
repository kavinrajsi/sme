import { getPayload } from "payload";
import config from "../payload.config.js";
import { caseStudies as fallback } from "../app/components/caseStudiesData.js";

function toCaseStudyShape(doc) {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    image: doc.image?.url || doc.image || "",
    industry: doc.industry || "",
    duration: doc.duration || "",
    services: Array.isArray(doc.services)
      ? doc.services.map((s) => s.name).filter(Boolean)
      : [],
    metrics: Array.isArray(doc.metrics)
      ? doc.metrics.map((m) => ({ label: m.label, value: m.value }))
      : [],
    challenge: doc.challenge || "",
    approach: Array.isArray(doc.approach)
      ? doc.approach.map((a) => a.step).filter(Boolean)
      : [],
    results: doc.results || "",
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
      depth: 1,
      sort: "title",
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
      depth: 1,
    });
    if (docs.length) return toCaseStudyShape(docs[0]);
  } catch (error) {
    console.error(`[case-studies] Payload load of ${slug} failed:`, error);
  }
  return fallback.find((c) => c.slug === slug) || null;
}
