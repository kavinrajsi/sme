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
      name: "seo",
      type: "group",
      label: "SEO",
      admin: {
        description: "Override the auto-generated meta title and description for search engines.",
      },
      fields: [
        {
          name: "metaTitle",
          type: "text",
          admin: {
            description: "Defaults to "Title Case Study | SearchMadarth®" if left blank. Max 60 chars recommended.",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          admin: {
            description: "Defaults to the card description if left blank. Max 155 chars recommended.",
          },
        },
      ],
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
