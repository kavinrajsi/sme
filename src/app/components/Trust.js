import Image from "next/image";
import { Anek_Tamil } from "next/font/google";
import styles from "./Trust.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["700"],
});

const logos = [
  { src: "/logo/tafe-tribe.png", alt: "Tafe Tribe" },
  { src: "/logo/nac-jewellers.png", alt: "NAC Jewellers" },
  { src: "/logo/irezumi.png", alt: "Irezumi" },
  { src: "/logo/inspace.png", alt: "Inspace" },
  { src: "/logo/karur-vysya-bank.png", alt: "Karur Vysya Bank" },
  { src: "/logo/nithya-amirtham.png", alt: "Nithya Amirtham" },
];

function LogoSet() {
  return (
    <>
      {logos.map((logo) => (
        <div key={logo.alt} className={styles.logoItem}>
          <Image
            src={logo.src}
            alt={logo.alt}
            width={244}
            height={122}
            className={styles.logoImage}
          />
        </div>
      ))}
    </>
  );
}

export default function Trust() {
  return (
    <section
      className={`${styles.section} ${anekTamil.className}`}
      data-aos="fade-up"
    >
      {/* <span className={styles.badge}>
        Trusted by growing businesses across India
      </span> */}
      <h2 className={styles.title}>
        Trusted by growing businesses across India
      </h2>
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          <LogoSet />
          <LogoSet />
        </div>
      </div>
    </section>
  );
}
