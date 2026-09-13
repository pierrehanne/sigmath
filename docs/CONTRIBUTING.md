# Contributing to SigMath

Thank you for helping mathematics feel alive. Contributions fall into three tracks.

## Content and translation

Write a lesson, improve an explanation, check mathematical accuracy, or translate an existing lesson. No application code is required. Follow `CONTENT_GUIDE.md`, keep both locale files paired, and run `npm run check:translations`.

## Design and illustration

Improve the town, a tier identity, diagrams, or motion. Keep artwork vector-first, avoid embedding translatable text in SVG, and preserve the normal DOM route for every visual hotspot. Test at desktop and mobile widths with reduced motion enabled.

## Engineering

Work on the Next.js app, content tools, widgets, performance, or accessibility. Before opening a pull request, run:

```bash
npm run check:translations
npm run lint
npm run typecheck
npm run build
```

## Review checklist

- Mathematical statements are correct and examples are reproducible.
- Tone and difficulty fit the declared age tier.
- French and English counterparts exist; draft status is honest.
- Interactive elements work with a keyboard and have visible focus.
- Motion is optional, and the content remains reachable without it.
- New scene links also exist as ordinary links in the page DOM.

Please keep pull requests focused. A content pull request should be understandable to an educator without requiring them to review unrelated infrastructure changes.
