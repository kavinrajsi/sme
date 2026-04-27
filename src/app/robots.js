const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: siteUrl ? `${siteUrl.replace(/\/$/, "")}/sitemap.xml` : undefined,
  };
}
