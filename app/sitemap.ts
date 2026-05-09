import type { MetadataRoute } from "next";
import { getSeoPageLanguageAlternates, getSeoPagePath, seoPages } from "@/lib/seo-content";
import { siteUrl } from "@/lib/site-url";

const publicRoutes = [
  { path: "", priority: 1 },
  { path: "faq", priority: 0.8 },
  { path: "privacy", priority: 0.4 },
  { path: "terms", priority: 0.4 },
  { path: "cookies", priority: 0.4 },
  { path: "requisites", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...publicRoutes.map((route) => ({
      url: route.path ? `${siteUrl}/${route.path}` : siteUrl,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...seoPages.flatMap((page) => {
      const languageAlternates = Object.fromEntries(
        Object.entries(getSeoPageLanguageAlternates(page)).map(([locale, path]) => [
          locale,
          `${siteUrl}${path}`,
        ]),
      );

      return [
        {
          url: `${siteUrl}${getSeoPagePath(page, "en")}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.82,
          alternates: {
            languages: languageAlternates,
          },
        },
        {
          url: `${siteUrl}${getSeoPagePath(page, "ru")}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.82,
          alternates: {
            languages: languageAlternates,
          },
        },
      ];
    }),
  ];
}
