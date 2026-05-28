#!/usr/bin/env node
/**
 * Seeds the 9 case studies from src/app/components/caseStudiesData.js into
 * Payload. Idempotent: skips any case study whose slug already exists.
 *
 * Run from the repo root with the same env you use locally:
 *   DATABASE_URI=... PAYLOAD_SECRET=... BLOB_READ_WRITE_TOKEN=... \
 *     node scripts/seed-case-studies.mjs
 */
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../src/payload.config.js";
import { caseStudies } from "../src/app/components/caseStudiesData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

async function uploadImageForStudy(payload, study) {
  const localPath = path.join(PUBLIC_DIR, study.image.replace(/^\//, ""));
  let buffer;
  try {
    buffer = await fs.readFile(localPath);
  } catch (e) {
    console.warn(
      `  ⚠️  Could not read ${localPath} — leaving image unset for ${study.slug}`,
    );
    return null;
  }
  const filename = path.basename(localPath);
  const created = await payload.create({
    collection: "media",
    data: { alt: study.title },
    file: {
      data: buffer,
      name: filename,
      mimetype:
        filename.endsWith(".webp")
          ? "image/webp"
          : filename.endsWith(".png")
            ? "image/png"
            : "image/jpeg",
      size: buffer.length,
    },
  });
  return created.id;
}

async function run() {
  const payload = await getPayload({ config });
  console.log(`Seeding ${caseStudies.length} case studies into Payload…`);

  for (const study of caseStudies) {
    const existing = await payload.find({
      collection: "case-studies",
      where: { slug: { equals: study.slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      console.log(`• ${study.slug} already exists — skipping.`);
      continue;
    }

    const imageId = await uploadImageForStudy(payload, study);

    await payload.create({
      collection: "case-studies",
      data: {
        slug: study.slug,
        title: study.title,
        description: study.description,
        industry: study.industry,
        duration: study.duration,
        services: study.services.map((name) => ({ name })),
        metrics: study.metrics,
        challenge: study.challenge,
        approach: study.approach.map((step) => ({ step })),
        results: study.results,
        ...(imageId ? { image: imageId } : {}),
      },
    });
    console.log(`✓ ${study.slug} created.`);
  }

  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
