const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function sitemap() {
  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required to generate sitemap.xml. Set it in .env.local (and your deploy environment)."
    );
  }

  const base = siteUrl.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms-and-conditions`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
