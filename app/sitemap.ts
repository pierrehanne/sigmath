import type { MetadataRoute } from "next";
import { getLessonParams } from "@/lib/content";
import { locales, tiers } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://sigmath.org";
  const lessons = await getLessonParams();
  return [
    ...locales.flatMap((locale) => [
      { url: `${base}/${locale}`, changeFrequency: "weekly" as const, priority: 1 },
      { url: `${base}/${locale}/tiers`, changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${base}/${locale}/games`, changeFrequency: "monthly" as const, priority: 0.9 },
      ...tiers.map((tier) => ({ url: `${base}/${locale}/${tier}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ]),
    ...lessons.map((lesson) => ({ url: `${base}/${lesson.locale}/${lesson.tier}/${lesson.subject}/${lesson.lesson}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
