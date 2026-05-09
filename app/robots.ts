import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvlift.app").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/analysis/", "/history", "/upload", "/credits", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
