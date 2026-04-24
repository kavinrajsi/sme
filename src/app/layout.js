import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import AosInit from "./components/AosInit";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Search Madarth - India's SME Growth Engine | Digital Marketing for SMEs",
  description: "We help Indian SMEs build a powerful digital presence that generates leads, builds trust, and grows revenue - without the complexity or corporate price tag.",
  openGraph: {
    images: ["/meta-og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/meta-og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        <AosInit />
        {children}
      </body>
    </html>
  );
}
