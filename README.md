<p align="center">
  <img src="docs/banner.svg" alt="PaperTrail: Research, connected." width="720">
</p>

<p align="center">
  A research workspace for collecting papers, mapping how they cite one another,<br>
  and exploring questions the literature may not have asked yet.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#screenshots">Screenshots</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#known-limitations">Limitations</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

> **Demonstration data.** PaperTrail ships with a small sample library. The titles, authors, journals, DOIs and citation counts are illustrative and do not refer to real publications. Papers you add yourself are stored in your browser only and are not verified against any source.

---

## Overview

PaperTrail is a React and Vite app that treats a literature collection as a connected map rather than a flat list. You can browse and search papers, open a detailed view of each one, see which papers reference which, and explore sample research directions that sit between topics in your collection.

It has no backend and needs no API keys.

## Features

| Area | What it does |
| --- | --- |
| **Overview** | Welcome area with search, a continue-reading shortlist, featured collections, a citation network preview, saved papers and recent session activity. |
| **Research library** | Paper cards with title, authors, journal, year, DOI and keywords. Live search with highlighting, sorting (recent, year, most cited, title), year and topic filters, collection filters and clear no-result states. |
| **Paper details** | Abstract, keywords, DOI (with copy), citation links inside your collection, related papers and bookmarking. |
| **Citation map** | Force-laid-out network with directed citation arrows, dashed shared-keyword links, node size by reported citations, an information panel, a legend, and zoom and pan. |
| **Gap explorer** | Hand-written sample research directions with supporting papers and a live count of citation links between the two topics in your collection. Clearly labelled as exploratory. |
| **Reading shelf** | Saved papers with remove, undo, clear shelf and an empty state. |
| **Add papers** | Enter a paper by hand and tick which library papers it references, so it appears on the map with its links. |

**Interaction and accessibility**

- Horizontal navigation with an animated active indicator and a mobile menu.
- Page transitions, staggered cards, modal springs, animated bookmarks, drawn citation edges, skeleton loaders and toasts. `prefers-reduced-motion` is respected.
- Skip link, visible focus states, labelled controls, focus-trapped modals that close with `Esc`, and keyboard-selectable map nodes.
- Shortcut: `Ctrl/Cmd + K` or `/` jumps to library search.

## Screenshots

### Overview
![Overview](images/Overview.PNG)

### Research library
![Research library](images/Library.PNG)

### Citation map
![Citation map](images/Citation%20Map.PNG)

### Gap explorer
![Gap explorer](images/Gap%20Explorer.PNG)

### Reading shelf
![Reading shelf](images/Reading%20Shelf.PNG)

## Brand

Original SVG assets live in `public/brand/`:

| File | Use |
| --- | --- |
| `papertrail-logo.svg` | Full logo for light backgrounds (navigation, footer) |
| `papertrail-logo-light.svg` | Full logo for dark backgrounds (loading screen) |
| `papertrail-icon.svg` | Standalone symbol |
| `papertrail-favicon.svg` | Simplified tab icon that adapts to dark browser themes |

The symbol is a letter P drawn as a citation trail: nodes along a path, with a dotted trail continuing from the base. The wordmark is outlined from Lora SemiBold (SIL Open Font License), so no font is needed to display the logo. `docs/banner.svg` is the header image used above.

Original illustrations used in the app are in `public/images/`. Each image has a fallback, so a missing file never shows a broken icon.

## Technology stack

- [React 18](https://react.dev) and [Vite 5](https://vitejs.dev)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [lucide-react](https://lucide.dev) for icons
- Plain CSS with design tokens in `src/styles/tokens.css`
- Lora, DM Sans and DM Mono via Google Fonts, with system fallbacks

## Getting started

Requires Node.js 18 or newer.

```bash
git clone https://github.com/rheillunio2-byte/PaperTrail.git
cd PaperTrail
npm install
npm run dev
```

Open the local URL that Vite prints (usually `http://localhost:5173`).

### Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
PaperTrail/
├── docs/
│   └── banner.svg          README header image
├── images/                 README screenshots
├── public/
│   ├── brand/              SVG logo, icon, light logo, favicon
│   └── images/             original in-app illustrations
├── src/
│   ├── main.jsx            entry point
│   ├── App.jsx             hash routing, state, modals, toasts
│   ├── data/seed.js        DEMO records, collections, sample research directions
│   ├── lib/                graph layout and analysis, persistence hooks
│   ├── components/         Nav, PaperCard, PaperDetail, AddPaper, CitationMap, UI primitives
│   ├── views/              Overview, Library, Connections, Gaps, Shelf
│   └── styles/             tokens.css, app.css
├── index.html
├── vite.config.js
└── package.json
```

## Known limitations

- **Demonstration data only.** There is no research database, live academic indexing or automatic citation extraction. Metadata you enter is not verified.
- **Citation links are manual.** Links among the sample papers are illustrative. For your own papers, links come from the references you select when adding them.
- **Gap directions are sample hypotheses.** The link counts are real counts over the papers in your library, but a low count does not prove a gap in the literature. Check the wider literature before drawing conclusions.
- **Storage is local.** Added papers, the shelf, recent items and saved directions persist in this browser's `localStorage` only. There is no sync, export, or editing of existing papers yet.
- **Fonts need a connection** the first time they load. System fonts are used as a fallback.

### Ideas for next steps

- Metadata lookup through Crossref or OpenAlex
- Persistent storage and accounts
- BibTeX export
- Editing and deleting papers

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

Released under the [MIT License](LICENSE). See the `LICENSE` file for the full text and copyright notice.
