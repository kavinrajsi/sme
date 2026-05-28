const textNode = (text) => ({
  type: "text",
  detail: 0,
  format: 0,
  mode: "normal",
  style: "",
  text,
  version: 1,
});

const paragraph = (text) => ({
  type: "paragraph",
  children: [textNode(text)],
  direction: "ltr",
  format: "",
  indent: 0,
  textFormat: 0,
  textStyle: "",
  version: 1,
});

const heading = (text, tag = "h2") => ({
  type: "heading",
  tag,
  children: [textNode(text)],
  direction: "ltr",
  format: "",
  indent: 0,
  version: 1,
});

const orderedList = (items) => ({
  type: "list",
  listType: "number",
  tag: "ol",
  start: 1,
  direction: "ltr",
  format: "",
  indent: 0,
  version: 1,
  children: items.map((text, i) => ({
    type: "listitem",
    value: i + 1,
    children: [textNode(text)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  })),
});

const richTextRoot = (children) => ({
  root: {
    type: "root",
    children,
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  },
});

const richTextBlock = (children) => ({
  blockType: "richText",
  content: richTextRoot(children),
});

const body = ({ challenge, approach, results }) => [
  richTextBlock([heading("The challenge"), paragraph(challenge)]),
  richTextBlock([heading("Our approach"), orderedList(approach)]),
  richTextBlock([heading("The results"), paragraph(results)]),
];

export const caseStudies = [
  {
    slug: "sundari-silks",
    image: "/images/sundari-silks.png",
    title: "Sundari Silks",
    description:
      "Seamlessly integrating the digital realm for a traditional textile brand by creating great experiences",
    industry: "Textiles & Retail",
    duration: "12 months",
    services: ["Website", "Local SEO", "Performance Marketing"],
    metrics: [
      { label: "Increase in qualified leads", value: "TBD" },
      { label: "Revenue uplift", value: "TBD" },
      { label: "Time to first ROI", value: "TBD" },
    ],
    body: body({
      challenge:
        "Add the business problem Sundari Silks came to us with — what was broken, what was at stake, and what the team had already tried.",
      approach: [
        "Outline the first pillar of the engagement (e.g. website rebuild, technical SEO foundations).",
        "Outline the second pillar (e.g. local search & Google Business Profile work).",
        "Outline the third pillar (e.g. paid acquisition strategy).",
      ],
      results:
        "Add the measurable outcomes — lead growth, revenue numbers, ranking improvements, store-visit lifts, anything quotable.",
    }),
  },
  {
    slug: "veranda-ias",
    image: "/images/veranda-ias.png",
    title: "Veranda IAS",
    description:
      "Digital lead generation for a civil services training institute, closing admissions within 90 days of its inception",
    industry: "Education",
    duration: "3 months",
    services: ["Performance Marketing", "Landing Pages", "Analytics"],
    metrics: [
      { label: "Days to first cohort closure", value: "90" },
      { label: "Qualified admissions", value: "TBD" },
      { label: "Cost per lead reduction", value: "TBD" },
    ],
    body: body({
      challenge:
        "Describe Veranda IAS's launch context — new brand, tight admission deadline, competitive coaching market.",
      approach: [
        "Detail the campaign launch playbook (audience segments, channel mix).",
        "Detail the creative + landing page testing cadence.",
        "Detail the admissions-funnel handoff with the sales team.",
      ],
      results:
        "Document the admissions closed, CPL trends, and what specifically drove the result.",
    }),
  },
  {
    slug: "annapoorna-masalas-and-spices",
    image: "/images/annapoorna.png",
    title: "Annapoorna Masalas and Spices",
    description:
      "Concept and execution of a hyper-local digital campaign for a leading masalas and spices brand",
    industry: "FMCG & Food",
    duration: "6 months",
    services: ["Local SEO", "Social Media", "Performance Marketing"],
    metrics: [
      { label: "Store-visit uplift", value: "TBD" },
      { label: "Geo-targeted reach", value: "TBD" },
      { label: "ROAS", value: "TBD" },
    ],
    body: body({
      challenge:
        "Capture the hyper-local distribution challenge — concentrated retail footprint, competition from heritage brands.",
      approach: [
        "Hyper-local audience modelling and creative localisation.",
        "Geo-fenced campaign structure across Meta and Google.",
        "Retail partner coordination and offer mechanics.",
      ],
      results:
        "Quantify the store-visit lift, online conversation share, and any sell-through changes the brand reported.",
    }),
  },
  {
    slug: "nithya-amirtham",
    image: "/images/nithya-amirtham.png",
    title: "Nithya Amirtham",
    description: "Scaling a Heritage Brand into a Digital Growth Engine",
    industry: "FMCG & Wellness",
    duration: "9 months",
    services: ["Brand Refresh", "D2C Website", "Performance Marketing"],
    metrics: [
      { label: "Direct-to-consumer revenue", value: "TBD" },
      { label: "Repeat purchase rate", value: "TBD" },
      { label: "ROAS", value: "TBD" },
    ],
    body: body({
      challenge:
        "Describe how a trusted offline heritage brand needed to enter D2C without diluting its equity.",
      approach: [
        "Brand and packaging audit feeding into website narrative.",
        "Conversion-focused D2C storefront with subscription mechanics.",
        "Always-on performance marketing tied to LTV cohorts.",
      ],
      results:
        "Tell the story of online revenue ramp, repeat-purchase cohorts, and how offline channels reacted.",
    }),
  },
  {
    slug: "adyar-ananda-bhavan",
    image: "/images/adyar-ananda-bhavan.webp",
    title: "Adyar Ananda Bhavan",
    description:
      "How we fast tracked the website build for Adyar Ananda Bhavan in 20 days",
    industry: "Food & Hospitality",
    duration: "20 days",
    services: ["Website", "CMS", "Performance"],
    metrics: [
      { label: "Days to launch", value: "20" },
      { label: "PageSpeed score", value: "TBD" },
      { label: "Outlets onboarded", value: "TBD" },
    ],
    body: body({
      challenge:
        "Note the 20-day deadline, multi-outlet content scope, and the franchise stakeholders involved.",
      approach: [
        "Locked information architecture in week one with stakeholders.",
        "Headless CMS to let franchise teams update menus directly.",
        "Performance budget enforced through Core Web Vitals checks.",
      ],
      results:
        "Capture launch velocity, PageSpeed scores, and the operational handover to AAB's internal team.",
    }),
  },
  {
    slug: "dheepam-lamp-oil",
    image: "/images/dheepam-lamp-oil.webp",
    title: "Dheepam Lamp Oil",
    description:
      "How we lit up more smiles for Karthigai Dheepam with Dheepam Lamp Oil",
    industry: "FMCG",
    duration: "Seasonal campaign",
    services: ["Creative", "Social", "Performance Marketing"],
    metrics: [
      { label: "Campaign reach", value: "TBD" },
      { label: "Engagement rate", value: "TBD" },
      { label: "Retail sell-through", value: "TBD" },
    ],
    body: body({
      challenge:
        "Describe the seasonal window for Karthigai Dheepam and how Dheepam Lamp Oil wanted to dominate share of voice.",
      approach: [
        "Festival-led creative concept rooted in cultural insight.",
        "Multi-format video distribution across YouTube, Meta, and regional OTT.",
        "Retailer collateral to convert digital intent into in-store demand.",
      ],
      results:
        "Document the engagement numbers, share-of-voice movement, and any retail sales evidence.",
    }),
  },
  {
    slug: "frankfinn",
    image: "/images/frankfinn.webp",
    title: "Frankfinn",
    description: "How a career institute got 10x visibility on YouTube",
    industry: "Education",
    duration: "12 months",
    services: ["YouTube Strategy", "Content Production", "SEO"],
    metrics: [
      { label: "Watch-time growth", value: "10x" },
      { label: "Subscriber growth", value: "TBD" },
      { label: "Inbound lead lift", value: "TBD" },
    ],
    body: body({
      challenge:
        "Frame Frankfinn's category challenge — institute brand needing trust signals for a young digital-native audience.",
      approach: [
        "YouTube channel strategy aligned to admissions funnel.",
        "Format experimentation (shorts, alumni interviews, on-campus diaries).",
        "Search-optimised metadata and end-card routing to admissions enquiry.",
      ],
      results:
        "Detail watch-time growth, channel authority signals, and how inbound enquiries shifted.",
    }),
  },
  {
    slug: "dahnay",
    image: "/images/dahnay.webp",
    title: "DahNAY",
    description:
      "Digital Lead Generation for a Logistics Company: How We Generated 10.9% Sales Qualified Leads in 10 Months",
    industry: "Logistics",
    duration: "10 months",
    services: ["Performance Marketing", "Landing Pages", "Lifecycle"],
    metrics: [
      { label: "SQL rate", value: "10.9%" },
      { label: "Lead volume", value: "TBD" },
      { label: "Cost per SQL", value: "TBD" },
    ],
    body: body({
      challenge:
        "Describe DahNAY's B2B logistics ICP, the long sales cycle, and the existing lead quality gap.",
      approach: [
        "ICP definition with the sales team to anchor qualification criteria.",
        "Account-aware campaign structure on LinkedIn and Google.",
        "Lifecycle nurture sequences with the in-house sales tooling.",
      ],
      results:
        "Quote the 10.9% SQL rate, pipeline contribution, and how attribution was validated.",
    }),
  },
  {
    slug: "sundari-silks-aadi-sale",
    image: "/images/sundari-silks-aadi-sale.webp",
    title: "Sundari Silks - Aadi Sale",
    description:
      "Tailoring a perfect Aadi Sale Performance campaign that seamlessly integrates precision targeting maintaining brand authenticity",
    industry: "Textiles & Retail",
    duration: "Seasonal campaign",
    services: ["Performance Marketing", "Creative", "Retail Activation"],
    metrics: [
      { label: "ROAS", value: "TBD" },
      { label: "Footfall lift", value: "TBD" },
      { label: "New customer share", value: "TBD" },
    ],
    body: body({
      challenge:
        "Aadi Sale is the largest sale window for textiles — describe the noise level and how Sundari Silks needed to stand out.",
      approach: [
        "Audience segmentation across loyalists and new buyers.",
        "Creative variants that preserved heritage tone while pushing offers.",
        "Daily optimisation against ROAS guardrails set with the brand team.",
      ],
      results:
        "Share the ROAS, footfall, and brand-perception read from this Aadi Sale window.",
    }),
  },
];

export function getCaseStudy(slug) {
  return caseStudies.find((c) => c.slug === slug) || null;
}
