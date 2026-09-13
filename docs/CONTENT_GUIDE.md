# SigMath content guide

Lessons live in `content/<locale>/<tier>` as one `.mdx` file and one `.meta.json` file sharing the same stem.

## Metadata

Required fields are `slug`, `tier`, `subject`, `title`, `description`, `sceneHotspot`, `difficulty`, `prerequisites`, `leadsTo`, `estimatedMinutes`, `translationStatus`, and `order`.

- Keep slugs language-neutral so localized counterparts remain easy to compare.
- Use difficulty 1–3 within the tier, not across the whole site.
- `sceneHotspot` is a stable illustration identifier; do not use display text.
- `translationStatus` is `complete`, `draft`, or `machine-draft`.
- Use route-like values such as `middle-school/fractions` for prerequisite links.

## Lesson shape

Start with a concrete moment or question. Introduce one new idea at a time, show a worked example, and end with a small check the learner can do independently.

Inline mathematics uses `$...$`; display mathematics uses `$$...$$`. Prefer semantic prose around notation so the explanation remains understandable to assistive technology.

Available components:

```mdx
<FractionSlicer />

<NumberGarden />

<SharingLab />

<LengthLab />

<ClockLab />

<ShapeLab />

<DataLab />

<FractionLineLab />

<DecimalGridLab />

<BalanceLab />

<AreaLab />

<AngleLab />

<ProbabilityLab />

<ProportionLab />

<AlgorithmLab />

<Callout title="Remember">
One short, useful idea.
</Callout>

<QuickCheck answer="5/8" />
```

Keep component props short and translatable. Interactive widgets must have a useful non-interactive explanation immediately before or after them.

## Translation

Create the counterpart file in the other locale with identical slug, tier, subject, `sceneHotspot`, and conceptual scope. Localize examples, number formatting, and idiom rather than translating word-for-word. Run `npm run check:translations` before submitting.
