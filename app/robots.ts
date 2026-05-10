import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/analysis/", "/history", "/upload", "/agent", "/credits", "/login"],
      },
      {
        userAgent: ["Googlebot", "YandexBot", "Bingbot"],
        allow: "/",
        disallow: ["/api/", "/analysis/", "/history", "/upload", "/agent", "/credits", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl.replace(/^https?:\/\//, ""),
  };
}
