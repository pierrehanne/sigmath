# SigMath

SigMath is a free, French-language mathematics site for pupils from CP to 3e. Visual experiments, everyday examples and explained exercises help students understand concepts at their own pace.

The homepage starts with an interactive chocolate-sharing challenge, hints and explained feedback. `/fr/games` offers three visual games for CM1–6e (fractions, decimals, and area), with nine guided challenges and unlimited retries. No account or timer is required.

Three pathways cover CP–CE2, CM1–6e and 5e–3e. Lesson pages are static, MDX-authored, and render notation with KaTeX. The catalogue is a growing collection, not a claim of complete curriculum coverage.

## What is included

- French-only published routes (`/fr`); legacy English URLs redirect to French
- A responsive homepage with a keyboard-operable fractions challenge
- Three learning pathways, ending at 3e; 6e belongs to cycle 3
- A sample cycle 4 pathway with five lessons and visual experiments
- Paired MDX + JSON content files with translation status, prerequisites, and scene hotspot metadata
- Server-rendered KaTeX plus keyboard-operable lesson interactions
- Dark mode, responsive layouts, metadata, robots, and sitemap generation
- Translation parity check, lint, typecheck, and production build scripts

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root always redirects to `/fr`. English content files are retained as unpublished archives; lycée and higher-education routes are not published.

## Quality checks

GitHub Actions runs the quality gate on pull requests and publishes to Vercel automatically after successful checks on `main`. One-time setup requires the three Vercel secrets and a linked Vercel project: see [the deployment guide](docs/DEPLOYMENT.md). Native Vercel Git deployments on `main` are disabled so they cannot bypass the quality gate.

```bash
npm run check:translations
npm test
npm run lint
npm run typecheck
npm run build
```

The production build uses Next.js’s Webpack builder for portability across restricted CI environments. Local development retains the faster Turbopack server.

The maths tests use Node.js’s built-in TypeScript stripping (Node 22.18+). Game definitions and answer checking live in `lib/games.ts`; interactive controls live in `components/math-playground.tsx`. Decimal positions use integer tenths to avoid floating-point comparison errors. Game progress counts distinct solved challenges during the current page visit and is not saved or sent to a server.

When adding a game, provide a visual manipulation, a short objective, a useful hint, feedback explaining the mathematics, and a link to the corresponding lesson in both languages. Check keyboard controls, retries, completion, replay, and mobile layouts as well as the answer logic.

## Content

Each lesson is a pair of files under `content/<locale>/<tier>/`:

```text
fractions.mdx
fractions.meta.json
```

The metadata drives routes, the catalogue, lesson order, cross-links, and the homepage hotspot relationship. See [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) before adding or translating a lesson.

## Contributing

Content writers, translators, illustrators, educators, and engineers are all welcome. Start with [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

Code is licensed under MIT. Lessons and original visual content are licensed under CC BY-SA 4.0.
