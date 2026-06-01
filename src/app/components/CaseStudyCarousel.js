"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./CaseStudy.module.css";

export default function CaseStudyCarousel({ studies }) {
  return (
    <div className={styles.sliderWrap}>
      <Swiper
        className={styles.cards}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.2}
        navigation={{
          prevEl: `.${styles.navPrev}`,
          nextEl: `.${styles.navNext}`,
        }}
        breakpoints={{
          768: { slidesPerView: 1.3 },
          1024: { slidesPerView: 2 },
        }}
      >
        {studies.map((study) => (
          <SwiperSlide key={study.slug} className={styles.card}>
            <Link
              href={`/case-studies/${study.slug}`}
              className={styles.cardLink}
            >
              <div className={styles.cardImage}>
                <Image
                  src={study.image}
                  alt={study.title}
                  width={387}
                  height={226}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{study.title}</h3>
                <p className={styles.cardDescription}>{study.description}</p>
                <span className={styles.cardCta}>Read case study →</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.navButtons}>
        <button type="button" className={styles.navPrev} aria-label="Previous">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20Z" fill="white" />
            <path d="M9.09991 20.8851V18.6852H27.3275L22.1421 13.4997L23.7134 11.9284L31.5702 19.7851L23.7134 27.6419L22.1421 26.0705L27.3275 20.8851L9.09991 20.8851Z" fill="#004c43" />
          </svg>
        </button>
        <button type="button" className={styles.navNext} aria-label="Next">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20Z" fill="white" />
            <path d="M9.09991 20.8851V18.6852H27.3275L22.1421 13.4997L23.7134 11.9284L31.5702 19.7851L23.7134 27.6419L22.1421 26.0705L27.3275 20.8851L9.09991 20.8851Z" fill="#004c43" />
          </svg>
        </button>
      </div>
    </div>
  );
}
