import { caseStudyBodyBlocks } from "./blocks.js";

const CaseStudies = {
  slug: "case-studies",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description:
      "Client engagements shown on /case-studies/[slug] and surfaced in the SMEs Scaling section on the homepage.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL segment — e.g. sundari-silks → /case-studies/sundari-silks",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: {
        description: "One-line summary used on the card and as the lede on the detail page.",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Hero image. 1280×720 or wider works best.",
      },
    },
    {
      name: "body",
      type: "blocks",
      required: true,
      minRows: 1,
      labels: { singular: "Block", plural: "Blocks" },
      blocks: caseStudyBodyBlocks,
      admin: {
        description:
          "Long-form story. Compose with rich text, images, quotes, callouts, stats, videos, and code blocks.",
      },
    },
  ],
};

export default CaseStudies;
