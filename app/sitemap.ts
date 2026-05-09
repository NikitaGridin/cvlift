import type { MetadataRoute } from "next";
import { seoPages } from "@/lib/seo-content";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvlift.app").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "", priority: 1 },
    { path: "faq", priority: 0.8 },
    { path: "privacy", priority: 0.4 },
    { path: "terms", priority: 0.4 },
    { path: "cookies", priority: 0.4 },
    { path: "requisites", priority: 0.4 },
    ...seoPages.map((page) => ({ path: page.slug, priority: 0.75 })),
  ];

  return routes.map((route) => ({
    url: route.path ? `${siteUrl}/${route.path}` : siteUrl,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
