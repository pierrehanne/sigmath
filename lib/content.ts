import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale, TierSlug } from "./site.ts";
import { locales, tiers } from "./site.ts";

export type LessonMeta = {
  slug: string;
  tier: TierSlug;
  subject: string;
  title: string;
  description: string;
  sceneHotspot: string;
  difficulty: number;
  prerequisites: string[];
  leadsTo: string[];
  estimatedMinutes: number;
  translationStatus: "complete" | "draft" | "machine-draft";
  order: number;
  color?: string;
};

export type Lesson = LessonMeta & { source: string; locale: Locale };

const contentRoot = path.join(process.cwd(), "content");

function assertLessonMeta(value: unknown, file: string): asserts value is LessonMeta {
  if (!value || typeof value !== "object") throw new Error(`Invalid lesson metadata: ${file}`);
  const meta = value as Partial<LessonMeta>;
  if (!meta.slug || !meta.title || !meta.tier || !meta.subject) {
    throw new Error(`Missing required lesson metadata in ${file}`);
  }
}

export async function getLessons(locale: Locale, tier?: TierSlug): Promise<LessonMeta[]> {
  const localeRoot = path.join(contentRoot, locale);
  const folders = tier ? [tier] : tiers;
  const lessons = await Promise.all(
    folders.map(async (folder) => {
      const directory = path.join(localeRoot, folder);
      let files: string[];
      try {
        files = await fs.readdir(directory);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
      }
      return Promise.all(
        files
          .filter((file) => file.endsWith(".meta.json"))
          .map(async (file) => {
            const raw = await fs.readFile(path.join(directory, file), "utf8");
            const meta: unknown = JSON.parse(raw);
            assertLessonMeta(meta, file);
            return meta;
          }),
      );
    }),
  );

  return lessons.flat().sort((a, b) => a.order - b.order);
}

export async function getLesson(
  locale: Locale,
  tier: TierSlug,
  subject: string,
  slug: string,
): Promise<Lesson | null> {
  const stem = path.join(contentRoot, locale, tier, slug);
  try {
    const [rawMeta, source] = await Promise.all([
      fs.readFile(`${stem}.meta.json`, "utf8"),
      fs.readFile(`${stem}.mdx`, "utf8"),
    ]);
    const meta: unknown = JSON.parse(rawMeta);
    assertLessonMeta(meta, `${stem}.meta.json`);
    if (meta.subject !== subject) return null;
    return { ...meta, source, locale };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function getLessonParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const lessons = await getLessons(locale);
      return lessons.map((lesson) => ({
        locale,
        tier: lesson.tier,
        subject: lesson.subject,
        lesson: lesson.slug,
      }));
    }),
  );
  return params.flat();
}
