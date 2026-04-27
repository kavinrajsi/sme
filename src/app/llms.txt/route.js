const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function GET() {
  const base = (siteUrl || "").replace(/\/$/, "");

  const body = `# SearchMadarth

> India's SME Growth Engine - a digital marketing partner that helps small and medium enterprises in India build a powerful digital presence that generates leads, builds trust, and grows revenue. Operates without the complexity or corporate price tag of large agencies.

## What we do

SearchMadarth offers six focused digital marketing services for Indian SMEs:

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
4. **Execution** - the SearchMadarth team implements everything, no lengthy briefs needed.
5. **Track & Scale** - weekly performance reports, monthly strategy calls, continuous optimization.

## Reported outcomes

Across the SearchMadarth client portfolio:

- 340% average increase in qualified inbound leads within 90 days
- ₹48 Cr+ total incremental revenue generated for clients
- 60 days median time from onboarding to first measurable ROI
- 4.1x average return on investment in the first year

## Service area

India - Indian small and medium enterprises only.

## Industries served

Textiles, food and beverage, education, logistics, retail, FMCG, manufacturing.

Sample clients: Sundari Silks, Veranda IAS, Annapoorna Masalas and Spices, Adyar Ananda Bhavan, Frankfinn, DahNAY, Nithya Amirtham, Dheepam Lamp Oil.

## Pages

- [Home](${base}/) - main landing page with services, process, and demo request
- [Privacy Policy](${base}/privacy-policy) - data collection and usage
- [Terms and Conditions](${base}/terms-and-conditions) - terms of use

## Get in touch

Demo calls (45 minutes, no commitment) and a free Digital Score quiz can be requested directly from the homepage.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
