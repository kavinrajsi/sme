import Header from "./components/Header";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import OurServices from "./components/OurServices";
import OurProcess from "./components/OurProcess";
import DigitalQuiz from "./components/DigitalQuiz";
import RevenueImpact from "./components/RevenueImpact";
import CaseStudy from "./components/CaseStudy";
import ClientStories from "./components/ClientStories";
import Footer from "./components/Footer";
import DemoModal from "./components/DemoModal";
import FAQ, { faqs } from "./components/FAQ";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const services = [
  {
    name: "Revenue-Ready Website",
    description:
      "A fast, mobile-first website built to convert visitors into calls, leads, and walk-ins. Includes CRO, speed optimization, and local SEO.",
  },
  {
    name: "Local SEO & Google Visibility",
    description:
      "First-page rankings for local searches, Google Business Profile optimization, citation building, and review management.",
  },
  {
    name: "Performance Marketing",
    description:
      "Targeted Google and Meta ads with budgets designed for SME realities and ROI-first campaign structure.",
  },
  {
    name: "Social Media & Brand Trust",
    description:
      "Credible, consistent presence on Instagram and LinkedIn with strategy, content, and execution all handled.",
  },
  {
    name: "WhatsApp Lead Automation",
    description:
      "Automated capture, qualification, and nurturing of leads on WhatsApp so no hot inquiry is lost to slow response time.",
  },
  {
    name: "Growth Analytics Dashboard",
    description:
      "Weekly-updated dashboard showing leads, sources, and performance in plain language.",
  },
];

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "SearchMadarth®",
  description:
    "Digital marketing partner for Indian SMEs - websites, local SEO, performance marketing, social, WhatsApp automation, and growth analytics.",
  url: siteUrl,
  image: siteUrl ? `${siteUrl}/meta-og-image.png` : undefined,
  serviceType: "Digital Marketing for SMEs",
  areaServed: { "@type": "Country", name: "India" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital Marketing Services for Indian SMEs",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: { "@type": "Organization", name: "SearchMadarth®", url: siteUrl },
        areaServed: { "@type": "Country", name: "India" },
      },
    })),
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

// Mirrors the steps rendered in components/OurProcess.js. Keep these in sync
// when the on-page process copy changes - this drives Google "How-to" rich
// results and AI-Overview step extraction.
const processSteps = [
  {
    name: "Discovery Call",
    text: "We understand your business, goals, customers, and current digital gaps in a focused 45-minute session.",
  },
  {
    name: "Digital Audit",
    text: "A full audit of your current online presence - website, SEO, ads, social, and local listings - with a clear gap analysis.",
  },
  {
    name: "Growth Blueprint",
    text: "A custom 90-day roadmap with specific actions, timelines, budget allocation, and expected outcomes - built for your goals.",
  },
  {
    name: "Execution",
    text: "Our team implements everything - no lengthy briefs, no hand-holding needed. You focus on your business, we build your growth engine.",
  },
  {
    name: "Track & Scale",
    text: "Weekly performance reports, monthly strategy calls, and continuous optimisation to compound your results over time.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How SearchMadarth® Helps Indian SMEs Grow Digitally",
  description:
    "A 5-step engagement that turns digital marketing for Indian SMEs into measurable revenue growth - typically within 60 to 90 days.",
  totalTime: "P90D",
  step: processSteps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
    url: siteUrl ? `${siteUrl}/#process` : undefined,
  })),
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Trust />
        <RevenueImpact />
        <DigitalQuiz />
        <OurServices />
        <CaseStudy />
        <OurProcess />
        <ClientStories />
        <FAQ />
      </main>
      <Footer />
      <DemoModal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  );
}
