export const RichTextBlock = {
  slug: "richText",
  labels: { singular: "Rich text", plural: "Rich text" },
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
};

export const ImageBlock = {
  slug: "image",
  labels: { singular: "Image", plural: "Images" },
  fields: [
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};

export const QuoteBlock = {
  slug: "quote",
  labels: { singular: "Quote", plural: "Quotes" },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "attribution",
      type: "text",
    },
  ],
};

export const CalloutBlock = {
  slug: "callout",
  labels: { singular: "Callout", plural: "Callouts" },
  fields: [
    {
      name: "style",
      type: "select",
      required: true,
      defaultValue: "info",
      options: [
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
      ],
    },
    {
      name: "body",
      type: "richText",
      required: true,
    },
  ],
};

export const StatsBlock = {
  slug: "stats",
  labels: { singular: "Stats row", plural: "Stats rows" },
  fields: [
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "Stat", plural: "Stats" },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
  ],
};

export const VideoBlock = {
  slug: "video",
  labels: { singular: "Video", plural: "Videos" },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
      admin: { description: "YouTube or Vimeo URL." },
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};

export const CodeBlock = {
  slug: "code",
  labels: { singular: "Code", plural: "Code blocks" },
  fields: [
    {
      name: "language",
      type: "select",
      defaultValue: "plaintext",
      options: [
        { label: "Plain text", value: "plaintext" },
        { label: "JavaScript", value: "javascript" },
        { label: "TypeScript", value: "typescript" },
        { label: "Python", value: "python" },
        { label: "Bash", value: "bash" },
        { label: "HTML", value: "html" },
        { label: "CSS", value: "css" },
        { label: "JSON", value: "json" },
        { label: "SQL", value: "sql" },
      ],
    },
    {
      name: "code",
      type: "code",
      required: true,
    },
  ],
};

export const caseStudyBodyBlocks = [
  RichTextBlock,
  ImageBlock,
  QuoteBlock,
  CalloutBlock,
  StatsBlock,
  VideoBlock,
  CodeBlock,
];
