# Parity Harness

Visual regression tests for the Stencil → Astro migration.
Captures full-page screenshots of both apps and pixel-diffs them.

## Setup

```bash
cd parity
npm install
npx playwright install chromium
```

## How to run

You need both apps running locally first.

**Terminal 1 — Stencil dev server (port 3333):**
```bash
cd web-stencil
npm start
```

**Terminal 2 — Astro dev server (port 4321):**
```bash
cd web-astro
npm run dev
```

**Terminal 3 — capture and diff:**
```bash
cd parity
npm run capture:stencil    # screenshots Stencil routes → baselines/stencil/
npm run capture:astro      # screenshots Astro routes  → baselines/astro/
npm run diff               # pixel-diff every matching pair → reports/
```

## Layout

```
parity/
├── playwright.config.ts        # 4 projects: stencil/astro × desktop/mobile
├── tests/capture.spec.ts       # iterates routes, screenshots fullpage
├── scripts/diff.mjs            # pixelmatch diff with status summary
├── baselines/
│   ├── stencil/                # captured Stencil screenshots (gitignored)
│   └── astro/                  # captured Astro screenshots (gitignored)
└── reports/                    # diff images + summary.json (gitignored)
```

## Reading the diff summary

For each route+viewport pair the diff script reports:
- `identical` — 0 mismatched pixels
- `near-match` — < 1% mismatched (likely antialiasing or font rendering)
- `differs` — > 1% mismatched (real visual change, investigate)
- `size-mismatch` — captures had different dimensions
- `missing-astro` — route not yet ported

The cutover criterion: every route shows `identical` or `near-match`,
plus manual smoke testing of interactive features.

## Routes covered

`/`, `/welcome`, `/about-me`, `/contact-me`, `/my-blog`, `/my-projects`, `/console-log`

Add new routes to `tests/capture.spec.ts`'s `ROUTES` array.

## Why not toHaveScreenshot?

Playwright's built-in screenshot regression (`expect(page).toHaveScreenshot()`)
matches against a single golden baseline. Here we want to compare two
*different* captures — Stencil vs Astro — so we capture both and diff
manually with pixelmatch.
