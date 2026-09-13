import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { answerFeedback, challenges, decimal, evaluateAnswer, games } from "../lib/games.ts";

test("fractions accept equivalent amounts, including selections made in any order", () => {
  const half = challenges.fractions[0];
  assert.equal(evaluateAnswer(half, 2), true);
  for (const value of [-1, 0, 1, 3, 4, 5, 2.5, NaN, Infinity]) {
    assert.equal(evaluateAnswer(half, value), false);
  }
  assert.equal(evaluateAnswer(challenges.fractions[1], 6), true);
  assert.equal(evaluateAnswer(challenges.fractions[2], 4), true);
});

test("area accepts all valid rectangle orientations, not just one expected answer", () => {
  const twelve = challenges.area[0];
  for (const [width, height] of [[2, 6], [6, 2], [3, 4], [4, 3]]) {
    assert.equal(evaluateAnswer(twelve, width, height), true);
  }
  for (const [width, height] of [[1, 12], [0, 12], [-3, -4], [2.5, 4.8], [4, 4]]) {
    assert.equal(evaluateAnswer(twelve, width, height), false);
  }
});

test("decimal positions are exact and display the French decimal comma", () => {
  for (let tenths = 0; tenths <= 20; tenths++) {
    assert.equal(evaluateAnswer({ kind: "number-line", tenths }, tenths), true);
    assert.equal(evaluateAnswer({ kind: "number-line", tenths }, tenths + 1), false);
  }
  assert.equal(decimal(7), "0,7");
  assert.equal(decimal(13), "1,3");
});

test("all nine challenges have a solution reachable through the controls", () => {
  assert.equal(Object.values(challenges).flat().length, 9);
  for (const challenge of Object.values(challenges).flat()) {
    let solutions = 0;
    for (let first = 0; first <= 20; first++) {
      for (let second = 1; second <= 8; second++) {
        if (evaluateAnswer(challenge, first, second)) solutions++;
      }
    }
    assert.ok(solutions > 0, JSON.stringify(challenge));
  }
});

test("feedback gives the correct direction and distinguishes area from perimeter", () => {
  assert.match(answerFeedback(challenges.fractions[0], 1, 1), /Ajoute/);
  assert.match(answerFeedback(challenges.fractions[0], 3, 1), /Retire/);
  assert.match(answerFeedback(challenges["number-line"][0], 3, 1), /droite/);
  assert.match(answerFeedback(challenges["number-line"][0], 10, 1), /gauche/);
  assert.match(answerFeedback(challenges.area[0], 3, 4), /12 m².*14 m/);
});

test("every game links to an existing lesson with the correct subject", async () => {
  for (const game of games) {
    const [tier, subject, slug] = game.lesson.split("/");
    await access(new URL(`../content/fr/${tier}/${slug}.mdx`, import.meta.url));
    const rawMeta = await readFile(new URL(`../content/fr/${tier}/${slug}.meta.json`, import.meta.url), "utf8");
    const meta = JSON.parse(rawMeta);
    assert.equal(meta.subject, subject, `${game.lesson} should reference the lesson's real subject`);
  }
});
