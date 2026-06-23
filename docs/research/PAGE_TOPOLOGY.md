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

