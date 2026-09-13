import assert from "node:assert/strict";
import test from "node:test";
import { readingWithoutLabs } from "../lib/labs.ts";

test("strips a lab tag at the very start of the source", () => {
  assert.equal(readingWithoutLabs("<NumberGarden />\n\nRest of the lesson."), "Rest of the lesson.");
});

test("strips lab tags with no space before the self-closing slash", () => {
  assert.equal(readingWithoutLabs("<FractionSlicer/>\nRest."), "Rest.");
});

test("strips any component whose name ends in Lab", () => {
  assert.equal(readingWithoutLabs("<ClockLab />\nRest."), "Rest.");
  assert.equal(readingWithoutLabs("<AlgorithmLab />\nRest."), "Rest.");
});

test("does not strip a bare <Lab /> with no preceding letters", () => {
  const source = "<Lab />\nRest.";
  assert.equal(readingWithoutLabs(source), source.trim());
});

test("does not strip an unrelated self-closing component", () => {
  const source = "<SomeWidget />\nRest.";
  assert.equal(readingWithoutLabs(source), source.trim());
});

test("only strips at the start of a line, not mid-line usage", () => {
  const source = "Text before <ClockLab /> stays untouched.";
  assert.equal(readingWithoutLabs(source), source.trim());
});

test("strips a lab tag on an interior line while preserving surrounding prose", () => {
  const source = "# Title\n\n<AreaLab />\n\nMore prose after the lab.";
  assert.equal(readingWithoutLabs(source), "# Title\n\n\nMore prose after the lab.");
});

test("trims leading and trailing whitespace from the result", () => {
  assert.equal(readingWithoutLabs("<NumberGarden />\n\n  Content.  \n\n"), "Content.");
});
