import type { MetadataRoute } from "next";
import { getLessonParams } from "@/lib/content";
import { locales, siteUrl, tiers } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const lessons = await getLessonParams();
  return [
    ...locales.flatMap((locale) => [
      { url: `${siteUrl}/${locale}`, lastModified, changeFrequency: "weekly" as const, priority: 1 },
      { url: `${siteUrl}/${locale}/tiers`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${siteUrl}/${locale}/games`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 },
      ...tiers.map((tier) => ({ url: `${siteUrl}/${locale}/${tier}`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 })),
    ]),
    ...lessons.map((lesson) => ({ url: `${siteUrl}/${lesson.locale}/${lesson.tier}/${lesson.subject}/${lesson.lesson}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
