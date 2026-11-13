# Contributing to PaperTrail

Thank you for helping improve PaperTrail. This guide explains how to set up the project, what we care about in the design and the code, and how to submit a change.

## Getting set up

Requires Node.js 18 or newer.

1. Fork the repository and clone your fork.
2. Create a focused branch, for example `fix/map-label-overlap` or `feature/bibtex-export`.
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Before opening a pull request, run `npm run build` and confirm it passes.

## Project layout

| Path | What lives there |
| --- | --- |
| `src/App.jsx` | Hash routing, global state, modals and toasts |
| `src/views/` | One file per page: Overview, Library, Connections, Gaps, Shelf |
| `src/components/` | Reusable pieces: Nav, PaperCard, PaperDetail, AddPaper, CitationMap, UI primitives |
| `src/lib/` | Pure logic (graph layout and analysis) and persistence hooks |
| `src/data/seed.js` | Demonstration records, collections and sample research directions |
| `src/styles/` | `tokens.css` (colours, type, spacing) and `app.css` |
| `public/brand/` | Logo, icon, light logo and favicon (SVG) |
| `public/images/` | Original in-app illustrations |
| `images/` | README screenshots |

## Design principles

- **Editorial and calm.** Warm ivory surfaces, forest green as the primary colour and terracotta as a sparing accent. Use the variables in `src/styles/tokens.css` instead of hard-coded values.
- **Serif for editorial headings, sans-serif for the interface.** Keep metadata (labels, years, DOIs) quiet and titles prominent.
- **Horizontal navigation.** Please do not add a sidebar.
- **Motion has a purpose.** Use it for feedback, navigation and storytelling, not decoration. Respect `prefers-reduced-motion`.
- **Everything interactive must work.** No placeholder buttons and no loading states that never finish.
- **Avoid generic AI-dashboard patterns:** purple gradients, glow effects, cards around everything, and meaningless statistics.

## Honesty about research data

PaperTrail deals with academic information, so accuracy of what it claims matters.

- Keep demonstration data clearly marked (`demo: true`). Never link demo DOIs to external sites.
- Do not present inferred topic intersections as verified research gaps.
- Do not claim live indexing, automatic citation extraction or verified metadata unless it is actually implemented.
- Do not add services that need paid credentials for the app to run.
- Make uncertainty visible in the interface rather than hiding it.

## Code guidelines

- Keep components small and reusable. Put pure logic in `src/lib/`.
- Every icon-only control needs an accessible label.
- Use the shared `Modal` component for dialogs. It handles the focus trap, `Esc` to close and focus restoration.
- Guard `localStorage` access with try/catch, as the existing hooks do.
- Keep SVG brand assets hand-editable, with no embedded raster images and no unnecessary filters.
- Avoid adding a dependency for something simple.

## Accessibility checklist

Before submitting a visual or interaction change, check that:

- [ ] You can reach and operate it with the keyboard alone.
- [ ] Focus states are visible.
- [ ] Text has sufficient colour contrast.
- [ ] It works with `prefers-reduced-motion` enabled.
- [ ] It looks right on a narrow mobile screen and a wide desktop screen.

## Reporting bugs and suggesting features

Open an issue and include:

- What you expected and what happened instead
- Steps to reproduce
- Browser and operating system
- A screenshot, for visual problems

## Submitting a pull request

1. Keep the change focused on one thing.
2. Describe what changed and why.
3. Include screenshots for visual updates (desktop and mobile).
4. List the steps you used to verify it.
5. Mention any known limitations.
6. Confirm that `npm run build` passes.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
