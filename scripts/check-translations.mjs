import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const contentRoot = path.join(process.cwd(), "content");

async function lessonKeys(locale) {
  const localeRoot = path.join(contentRoot, locale);
  const tiers = await readdir(localeRoot, { withFileTypes: true });
  const keys = [];
  for (const tier of tiers) {
    if (!tier.isDirectory()) continue;
    const files = await readdir(path.join(localeRoot, tier.name));
    for (const file of files) {
      if (file.endsWith(".meta.json")) keys.push(`${tier.name}/${file.replace(".meta.json", "")}`);
    }
  }
  return new Set(keys);
}

const [fr, en] = await Promise.all([lessonKeys("fr"), lessonKeys("en")]);
const missingEn = [...fr].filter((key) => !en.has(key));
const missingFr = [...en].filter((key) => !fr.has(key));

if (missingEn.length || missingFr.length) {
  if (missingEn.length) console.error(`Missing English counterparts:\n- ${missingEn.join("\n- ")}`);
  if (missingFr.length) console.error(`Missing French counterparts:\n- ${missingFr.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Translation parity OK — ${fr.size} paired lessons.`);
}
