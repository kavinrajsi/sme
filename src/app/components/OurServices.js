"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { Anek_Tamil } from "next/font/google";
import styles from "./OurServices.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const services = [
  {
    title: "Revenue-Ready Website",
    description:
      "A fast, mobile-first website built not just to look good but to convert visitors into calls, leads, and walk-ins. Includes CRO, speed optimization, and local SEO.",
    tags: ["Conversion Design", "SEO", "Mobile-First"],
    image: "/services/revenue-ready-website.png",
  },
  {
    title: "Local SEO & Google Visibility",
    description:
      "Rank on the first page when your customers search for you locally. Google Business Profile optimization, citation building, and review management included.",
    tags: ["Google Maps", "Local SEO", "Reviews"],
    image: "/services/local-seo.png",
  },
  {
    title: "Performance Marketing",
    description:
      "Targeted Google and Meta ads that reach your ideal buyer in your city with budgets designed for SME realities and ROI-first campaign structure.",
    tags: ["Google Ads", "Meta Ads", "ROI-First"],
    image: "/services/performance-marketing.png",
  },
  {
    title: "Social Media & Brand Trust",
    description:
      "Build a credible, consistent presence on platforms where your customers are already spending time. Strategy, content, and execution all handled.",
    tags: ["Instagram", "LinkedIn", "Content Strategy"],
    image: "/services/social-media-brand-trust.png",
  },
  {
    title: "WhatsApp Lead Automation",
    description:
      "Capture, qualify, and nurture leads on WhatsApp automatically so you never lose a hot inquiry to a slow response time again.",
    tags: ["WhatsApp API", "Automation"],
    image: "/services/whatsapp-lead-automation.png",
  },
  {
    title: "Growth Analytics Dashboard",
    description:
      "One simple dashboard showing you exactly how many leads came in, from where, and what’s working updated weekly, explained in plain language.",
    tags: ["Live Reporting", "Attribution", "Insights"],
    image: "/services/growth-analytics-dashboard.png",
  },
];

function ServicePanel({ service, className }) {
  return (
    <div className={`${styles.panel} ${className || ""}`}>
      <div className={styles.panelImage}>
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 652px"
          className={styles.image}
        />
      </div>
      <div className={styles.panelBody}>
        <p className={styles.panelDescription}>{service.description}</p>
        <div className={styles.tags}>
          {service.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OurServices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = services[activeIndex];

  return (
    <section
      id="services"
      className={`${styles.sectionContainer} ${anekTamil.className}`}
      data-aos="fade-up"
    >
      <div className={`${styles.section} container`}>
        <div className={styles.header}>
          <span className={styles.badge}>Our Services</span>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>
              Everything You Need to Grow,
              <br />
              Nothing You Don&apos;t
            </h2>
            <p className={styles.subtitle}>
              Focused services built for Indian SME realities - fast
              implementation, clear metrics, real results.
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.tabs} aria-label="Our services">
            {services.map((service, index) => {
              const isActive = index === activeIndex;
              return (
                <Fragment key={service.title}>
                  <button
                    type="button"
                    aria-expanded={isActive}
                    className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    {service.title}
                  </button>
                  {/* Mobile: active content appears inline below its tab */}
                  {isActive && (
                    <ServicePanel
                      service={service}
                      className={styles.accordionPanel}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Desktop: single content panel beside the tab list */}
          <ServicePanel service={active} className={styles.desktopPanel} />
        </div>
      </div>
    </section>
  );
}
