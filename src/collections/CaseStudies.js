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
        description: "Controls how this page appears in Google, Open Graph (Facebook/LinkedIn), and X (Twitter).",
      },
      fields: [
        {
          name: "metaTitle",
          type: "text",
          admin: {
            description: "Page <title> and og:title. Defaults to 'Title Case Study | SearchMadarth®'. Max 60 chars.",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          admin: {
            description: "Meta description, og:description, and twitter:description. Defaults to the card description. Max 155 chars.",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "og:image and twitter:image. Defaults to the hero image. 1200×630 recommended.",
          },
        },
        {
          name: "twitterCard",
          type: "select",
          defaultValue: "summary_large_image",
          options: [
            { label: "Large image (summary_large_image)", value: "summary_large_image" },
            { label: "Small image (summary)", value: "summary" },
          ],
          admin: {
            description: "Twitter card format. Large image is recommended.",
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
