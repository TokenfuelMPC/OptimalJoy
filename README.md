# OptimalJoy

Website remap, asset registry, and refresh workspace for **OptimalJoy Wellness & Aesthetics** (Maryville, TN).

Reference / source site: <https://www.optimaljoylife.com> (WordPress).

> **Standalone project.** This repository is intentionally isolated and shares no code, assets, credentials, or infrastructure with any other project.

---

## What this is

This is **Phase 1 — Baseline Capture**. The goal was to faithfully remap the *existing* site and record every asset into a portable database, with **no redesign applied yet**. The redesign/refresh happens in a later phase, only after this baseline is approved.

| File | Purpose |
| --- | --- |
| `manifest.json` | **The asset/content registry** — the "database." Every page, homepage section (verbatim copy), treatment, testimonial, brand color, font, logo, contact detail, social link, and image is recorded here. Designed to port straight into a real DB (each top-level array = a table, `id` = primary key). |
| `index.html` | The **baseline homepage**. It is *data-driven*: it fetches `manifest.json` at runtime and renders from it — proving the registry can drive the site. This is a faithful representation of the current site (same copy, images, logo, palette, fonts), not a redesign. |
| `assets/logo/` | Real brand logos (color + white SVG) downloaded from the live site. |
| `assets/images/` | Real treatment, practitioner, and promo images downloaded from the live site. |
| `_capture/home.html` | Raw HTML snapshot of the live homepage, kept as provenance for the remap. |

## Brand (extracted from the live site)

- **Fonts:** Plus Jakarta Sans (primary), Roboto (secondary)
- **Primary accent:** Bronze `#C4926b` / dark `#af815d`
- **Secondary accent:** Teal `#38C5B5` / dark `#2DA194`
- **Gold:** `#f2af29` · **Dark:** Deep Plum `#1a1230`

## Preview

The baseline is published via **GitHub Pages**: <https://tokenfuelmpc.github.io/OptimalJoy/>

Local preview (any static server works because `index.html` fetches `manifest.json` over HTTP):

```bash
node _dev-server.js   # serves on http://localhost:5050
```

## Roadmap

- [x] Phase 1 — Baseline capture: repo, asset download, `manifest.json` registry, faithful baseline page, Pages preview
- [ ] Phase 2 — Refresh design candidates (new template(s) driven by the same `manifest.json`), staged on branches for shareable approval links
- [ ] Phase 3 — Approved design → full production build
