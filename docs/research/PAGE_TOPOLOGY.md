# DESIGN.md Page Topology

## Sections
1. Sticky header
   - Contains title, subtitle, and GitHub link.
   - Fixed in visual flow with `position: sticky`.
   - Interaction model: hover-only link.

2. Category controls
   - Category label and count row.
   - Horizontal scrollable pill list with previous/next arrow controls.
   - Interaction model: click-driven filtering and horizontal scroller controls.

3. Design card grid
   - Unordered list of 156 cards in live order.
   - Responsive columns: 1 / 2 / 3 / 4 / 5 at Tailwind `sm` / `md` / `lg` / `xl`.
   - Interaction model: card anchors navigate to design detail URLs; internal controls are visual only.

## Layout
- `main` background: `rgb(10, 10, 10)`.
- Main content max width: 1500px.
- Header and section share horizontal padding of 16px on mobile and 32px on `md`.
- No images, videos, background images, or favicons were present in the inspected DOM.
- One inline SVG star-like GitHub icon is used in the header.

## Detail Page Topology
1. Detail intro
   - Back link, title, description, and three tag pills.
   - Interaction model: back link navigation.

2. Product preview
   - Bordered hero shell with nav, primary CTA, secondary CTA, feature cards, metric strip, waitlist form, and footer.
   - Interaction model: visual controls only.

3. Documentation and token grid
   - Left column: generated `DESIGN.md` code panel.
   - Right column: color tokens, typography metadata, tags.
   - Interaction model: visual copy/download/token controls only.

4. Resources
   - Same-category markdown resource rows generated from local `src/data/designs.json`.
   - Interaction model: visual copy/download controls only.

5. More Designs
   - Horizontal rail of same-category `DesignCard` links excluding the current design.
   - Interaction model: anchor navigation to other detail routes.

## Detail Layout
- Detail root is themed by `data-design=<slug>` and generated card variables.
- Desktop 1440px: docs/token area is a two-column grid; feature cards are three columns; metrics are four columns.
- Mobile 390px: sections stack vertically; related cards remain a horizontal scroll rail.
- Local data is treated as source of truth for counts and related resources.
