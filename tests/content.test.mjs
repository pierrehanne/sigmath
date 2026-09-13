import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { getLesson, getLessonParams, getLessons } from "../lib/content.ts";
import { tiers } from "../lib/site.ts";

test("getLessons returns lessons sorted by their declared order", async () => {
  const lessons = await getLessons("fr", "kids");
  assert.ok(lessons.length > 0);
  for (let i = 1; i < lessons.length; i++) {
    assert.ok(lessons[i - 1].order <= lessons[i].order);
  }
});

test("getLesson returns null when the subject segment does not match the lesson's real subject", async () => {
  const lessons = await getLessons("fr", "kids");
  const lesson = lessons[0];
  assert.equal(await getLesson("fr", "kids", "not-the-real-subject", lesson.slug), null);
  assert.ok(await getLesson("fr", "kids", lesson.subject, lesson.slug));
});

test("getLesson returns null for a slug that does not exist", async () => {
  assert.equal(await getLesson("fr", "kids", "numbers", "this-lesson-does-not-exist"), null);
});

test("getLessonParams only produces URLs that getLesson can actually resolve", async () => {
  const params = await getLessonParams();
  assert.ok(params.length > 0);
  for (const param of params) {
    const lesson = await getLesson(param.locale, param.tier, param.subject, param.lesson);
    assert.ok(lesson, `no resolvable lesson for /${param.locale}/${param.tier}/${param.subject}/${param.lesson}`);
  }
});

test("every lesson's meta.tier matches the folder it actually lives in", async () => {
  const contentRoot = path.join(process.cwd(), "content", "fr");
  for (const tier of tiers) {
    const dir = path.join(contentRoot, tier);
    let files;
    try {
      files = await readdir(dir);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    for (const file of files.filter((f) => f.endsWith(".meta.json"))) {
      const meta = JSON.parse(await readFile(path.join(dir, file), "utf8"));
      assert.equal(meta.tier, tier, `${file} declares tier "${meta.tier}" but lives in the "${tier}" folder`);
    }
  }
});
