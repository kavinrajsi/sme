"use client";

import { useState } from "react";
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
    image: "/images/services/revenue-ready-website.png",
  },
  {
    title: "Local SEO & Google Visibility",
    description:
      "Rank on the first page when your customers search for you locally. Google Business Profile optimization, citation building, and review management included.",
    tags: ["Google Maps", "Local SEO", "Reviews"],
    image: "/images/services/revenue-ready-website.png",
  },
  {
    title: "Performance Marketing",
    description:
      "Targeted Google and Meta ads that reach your ideal buyer in your city with budgets designed for SME realities and ROI-first campaign structure.",
    tags: ["Google Ads", "Meta Ads", "ROI-First"],
    image: "/images/services/revenue-ready-website.png",
  },
  {
    title: "Social Media & Brand Trust",
    description:
      "Build a credible, consistent presence on platforms where your customers are already spending time. Strategy, content, and execution all handled.",
    tags: ["Instagram", "LinkedIn", "Content Strategy"],
    image: "/images/services/revenue-ready-website.png",
  },
  {
    title: "WhatsApp Lead Automation",
    description:
      "Capture, qualify, and nurture leads on WhatsApp automatically so you never lose a hot inquiry to a slow response time again.",
    tags: ["WhatsApp API", "Automation"],
    image: "/images/services/revenue-ready-website.png",
  },
  {
    title: "Growth Analytics Dashboard",
    description:
      "One simple dashboard showing you exactly how many leads came in, from where, and what’s working updated weekly, explained in plain language.",
    tags: ["Live Reporting", "Attribution", "Insights"],
    image: "/images/services/revenue-ready-website.png",
  },
];

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
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Our services"
          >
            {services.map((service, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={service.title}
                  type="button"
                  role="tab"
                  id={`service-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls="service-panel"
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {service.title}
                </button>
              );
            })}
          </div>

          <div
            className={styles.panel}
            id="service-panel"
            role="tabpanel"
            aria-labelledby={`service-tab-${activeIndex}`}
          >
            <div className={styles.panelImage}>
              <Image
                src={active.image}
                alt={active.title}
                fill
                sizes="(max-width: 768px) 100vw, 652px"
                className={styles.image}
              />
            </div>
            <div className={styles.panelBody}>
              <p className={styles.panelDescription}>{active.description}</p>
              <div className={styles.tags}>
                {active.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
