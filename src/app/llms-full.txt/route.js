import { faqs } from "../components/FAQ";
import { loadAllCaseStudies } from "@/lib/caseStudies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

function lexicalNodeToText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.type === "linebreak") return "\n";
  const children = Array.isArray(node.children)
    ? node.children.map(lexicalNodeToText).join("")
    : "";
  if (node.type === "heading") {
    const level = Number((node.tag || "h2").replace("h", "")) || 2;
    return `\n\n${"#".repeat(level)} ${children}\n`;
  }
  if (node.type === "paragraph") return `\n${children}\n`;
  if (node.type === "list") {
    const items = (node.children || []).map((li, i) => {
      const inner = lexicalNodeToText(li).trim();
      return node.listType === "number" ? `${i + 1}. ${inner}` : `- ${inner}`;
    });
    return `\n${items.join("\n")}\n`;
  }
  if (node.type === "listitem") return children;
  return children;
}

function bodyToMarkdown(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => {
      if (b.blockType === "richText" && b.content?.root) {
        return lexicalNodeToText(b.content.root).trim();
      }
      if (b.blockType === "quote") {
        return `> ${b.quote || ""}${b.attribution ? `\n> — ${b.attribution}` : ""}`;
      }
      if (b.blockType === "callout" && b.body?.root) {
        return lexicalNodeToText(b.body.root).trim();
      }
      if (b.blockType === "stats" && Array.isArray(b.items)) {
        return b.items.map((s) => `- ${s.label}: ${s.value}`).join("\n");
      }
      if (b.blockType === "image" && b.media?.url) {
        return b.caption ? `![${b.caption}](${b.media.url})` : `![](${b.media.url})`;
      }
      if (b.blockType === "video" && b.url) {
        return `Video: ${b.url}`;
      }
      if (b.blockType === "code" && b.code) {
        return `\`\`\`${b.language || ""}\n${b.code}\n\`\`\``;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export async function GET() {
  const base = (siteUrl || "").replace(/\/$/, "");

  const faqBlock = faqs
    .map(({ question, answer }) => `### ${question}\n\n${answer}`)
    .join("\n\n");

  const studies = await loadAllCaseStudies();
  const caseStudyBlock = studies
    .map((c) => {
      const services = c.services.join(", ");
      const metrics = c.metrics
        .map((m) => `- ${m.label}: ${m.value}`)
        .join("\n");
      const story = bodyToMarkdown(c.body);
      return `### ${c.title}

- URL: ${base}/case-studies/${c.slug}
- Industry: ${c.industry}
- Engagement length: ${c.duration}
- Services delivered: ${services}
- One-line summary: ${c.description}

**Impact at a glance**

${metrics}

${story}`;
    })
    .join("\n\n");

  const body = `# SearchMadarth® - Full reference

> Long-form companion to [llms.txt](${base}/llms.txt). Covers the full SearchMadarth® offering, every case study with structured detail, and every published FAQ. Suitable for LLM ingestion when the shorter index isn't enough.

## About SearchMadarth®

SearchMadarth® is India's SME Growth Engine - a digital marketing partner that helps small and medium enterprises in India build a powerful digital presence that generates leads, builds trust, and grows revenue. The agency operates without the complexity or corporate price tag of large agencies, with engagements designed around weeks-to-results rather than quarters.

- Primary site: ${base || "https://sme.searchmadarth.com"}
- Service area: India only
- Industries served: Textiles, food and beverage, education, logistics, retail, FMCG, manufacturing
- Sample clients: Sundari Silks, Veranda IAS, Annapoorna Masalas and Spices, Adyar Ananda Bhavan, Frankfinn, DahNAY, Nithya Amirtham, Dheepam Lamp Oil

## Services

SearchMadarth® offers six focused digital marketing services for Indian SMEs:

- **Revenue-Ready Website** - fast, mobile-first websites built for conversion. Includes CRO, speed optimization, and local SEO.
- **Local SEO & Google Visibility** - first-page rankings for local searches. Includes Google Business Profile optimization, citation building, and review management.
- **Performance Marketing** - targeted Google and Meta ads with budgets designed for SME realities and ROI-first campaign structure.
- **Social Media & Brand Trust** - credible, consistent presence on Instagram and LinkedIn with strategy, content, and execution all handled.
- **WhatsApp Lead Automation** - automated capture, qualification, and nurturing of leads on WhatsApp.
- **Growth Analytics Dashboard** - weekly-updated dashboard showing leads, sources, and performance in plain language.

## Engagement process

A 5-step process that delivers results in weeks, not quarters:

1. **Discovery Call** - 45-minute session to understand business, goals, customers, and digital gaps.
2. **Digital Audit** - full audit of current website, SEO, ads, social, and local listings with gap analysis.
3. **Growth Blueprint** - custom 90-day roadmap with specific actions, timelines, budgets, and expected outcomes.
4. **Execution** - the SearchMadarth® team implements everything, no lengthy briefs needed.
5. **Track & Scale** - weekly performance reports, monthly strategy calls, continuous optimization.

## Reported outcomes

Across the SearchMadarth® client portfolio:

- 340% average increase in qualified inbound leads within 90 days
- ₹48 Cr+ total incremental revenue generated for clients
- 60 days median time from onboarding to first measurable ROI
- 4.1x average return on investment in the first year

## Digital Score quiz

A free 10-question quiz at ${base}/digital-score that benchmarks an SME's online presence across five growth pillars and emails a personalised report. Quiz takers verify their email with a 6-digit one-time code before results are released. Bookings for a 30-minute strategy call can be made directly from the result screen.

## Case studies

${caseStudyBlock}

## Frequently asked questions

${faqBlock}

## Pages

- [Home](${base}/) - main landing page with services, process, testimonials, and demo request
- [Digital Score](${base}/digital-score) - free quiz that benchmarks an SME's online presence and delivers a personalised growth report
- [Privacy Policy](${base}/privacy-policy) - data collection and usage
- [Terms and Conditions](${base}/terms-and-conditions) - terms of use
- [llms.txt](${base}/llms.txt) - short-form index for LLM crawlers

## Get in touch

Demo calls (45 minutes, no commitment) and a free Digital Score quiz can be requested directly from the homepage. Email replies and reports are sent from \`@madarth.com\`.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
