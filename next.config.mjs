import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/api/media/**" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "sme.searchmadarth.com", pathname: "/api/media/**" },
    ],
  },
};

export default withPayload(nextConfig);
