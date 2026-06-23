# DesignDetail Specification

## Overview
- **Target file:** `src/components/DesignDetail.tsx`
- **Route file:** `src/app/design/[slug]/page.tsx`
- **Screenshots:** `docs/design-references/designsmd-detail-dark-3d-sculpt-desktop.png`, `docs/design-references/designsmd-detail-dark-3d-sculpt-mobile.png`
- **Interaction model:** Mostly static. Directory and related design cards are links. Copy/download controls are visual controls in the cloned UI. Color token/resource buttons have hover/cursor affordance only.

## DOM Structure
- Page root uses the current design slug as `data-design`, allowing generated `src/app/design-themes.css` variables to theme the page from `src/data/designs.json`.
- Top container: back link, design title, description, tag pills.
- Product preview: large bordered shell with top nav, centered hero copy/buttons, feature cards, metric strip, waitlist form, footer.
- Content grid: left `DESIGN.md` code panel, right metadata panel with color tokens, typography, tags.
- Resources section: category title, count, vertical list of same-category markdown paths.
- More Designs section: horizontal list of same-category `DesignCard` links excluding the current design.

## Computed Styles From Target
- Page background: `rgb(28, 28, 30)` for 3D Sculpt.
- Page text: `rgb(232, 232, 230)`.
- Muted/border: `rgb(140, 139, 136)`.
- Surface: `rgb(37, 37, 39)`.
- Accent: `rgb(0, 191, 207)`.
- Outer max width: target desktop content spans roughly `1376px` within 32px page padding on a 1440px viewport.
- Detail cards/panels use 1px borders, `6px` radius for 3D Sculpt, and `rgba(0, 0, 0, 0.26) 0px 8px 24px 0px` shadow from data.
- Hero title desktop: about `48px`, `600`, Space Grotesk; mobile scales down.
- Body/UI text: Inter; labels use small uppercase tracking.

## States & Behaviors
- Back link href: `/`.
- More Designs `View all` href: `/?style=<category>`.
- More Designs cards link to their own `design.slug` detail pages.
- Card hover should preserve existing card transition behavior.
- Desktop uses a two-column docs/metadata grid. Mobile stacks sections vertically.

## Data Rules
- All colors, radius, shadow, title, category, label, description, slug, resources, and related designs come from `src/data/designs.json`.
- For 3D Sculpt, local data has 24 Dark designs; the live page reports 36. The clone must prefer local `designs.json` for consistency with the requested data source.
- Markdown text is generated from the same design object so the page and data remain synchronized.

## Responsive Behavior
- **Desktop (1440px):** full-width max container, two-column docs grid, 3 feature columns, 4 metric columns, horizontal card rail.
- **Tablet (768px):** docs grid may remain two columns if space allows; product sections compress gaps.
- **Mobile (390px):** stacked panels, nav wraps, hero title smaller, feature/metric/waitlist controls stack, horizontal rail scrolls.
