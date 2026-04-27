import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import AosInit from "./components/AosInit";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "SearchMadarth";
const siteTitle =
  "SearchMadarth - India's SME Growth Engine | Digital Marketing for SMEs";
const siteDescription =
  "We help Indian SMEs build a powerful digital presence that generates leads, builds trust, and grows revenue - without the complexity or corporate price tag.";

export const metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: siteTitle,
    template: "%s | SearchMadarth",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "SME digital marketing",
    "Indian SME growth",
    "small business digital marketing India",
    "SEO for SMEs",
    "digital presence India",
    "lead generation for SMEs",
    "SearchMadarth",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "Marketing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/meta-og-image.png",
        width: 1200,
        height: 630,
        alt: "SearchMadarth - India's SME Growth Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/meta-og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#004c43",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: siteUrl ? `${siteUrl}/meta-og-image.png` : undefined,
  description: siteDescription,
  areaServed: {
    "@type": "Country",
    name: "India",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        <AosInit />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </body>
    </html>
  );
}
