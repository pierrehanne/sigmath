# SigMath design system

SigMath uses warm neutrals, high-legibility Manrope for interface text, DM Serif Display for narrative headings, and KaTeX’s bundled math fonts for notation.

The published pathways use apricot (CP–CE2), mint (CM1–6e) and lavender (5e–3e). Each pairs a quiet surface with dark text; dark mode uses darker surfaces and lighter text. The palette is defined in `app/ui.css`, loaded after the legacy styles and homepage layout. Keep colors in these shared variables when extending the UI.

Primary actions use deep green with white text, and pale green with dark text in dark mode. Neutral surfaces use off-white and white. Learning feedback includes explicit text in addition to color. Pathway names and subject labels must remain understandable without color.

The town illustration is code-native SVG. Translated labels live in HTML, not in the artwork. Motion is limited to opacity, transform, and small interaction feedback; `prefers-reduced-motion` removes scroll scaling and decorative animation.

Cards use rounded corners (16–28px), restrained shadows and visible borders. Buttons and filter controls have a minimum height of 44px. Keep descriptions and estimated lesson durations visible on mobile. Respect reduced-motion preferences and provide visible keyboard focus.

The lesson catalogue combines accent-insensitive text search with subject filters. Keep an explicit result count, a useful empty state and an action to reset filters. Course headers link directly to the catalogue so learners can skip the visual experiment. Mobile navigation closes with Escape and restores focus to the menu button.
