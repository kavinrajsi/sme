const CaseStudies = {
  slug: "case-studies",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "industry", "duration", "updatedAt"],
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
      name: "industry",
      type: "text",
      required: true,
    },
    {
      name: "duration",
      type: "text",
      required: true,
      admin: {
        description: "Engagement length — e.g. '12 months' or 'Seasonal campaign'.",
      },
    },
    {
      name: "services",
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: "Service",
        plural: "Services",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "metrics",
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: "Metric",
        plural: "Metrics",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "challenge",
      type: "textarea",
      required: true,
      admin: {
        description: "What the business problem was when the engagement started.",
      },
    },
    {
      name: "approach",
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: "Approach step",
        plural: "Approach steps",
      },
      fields: [
        {
          name: "step",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "results",
      type: "textarea",
      required: true,
      admin: {
        description: "Measurable outcomes worth quoting.",
      },
    },
  ],
};

export default CaseStudies;
