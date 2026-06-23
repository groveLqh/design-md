# DESIGN.md Behavior Findings

## Target
- URL: `https://designsmd.vercel.app/`
- Page title: `DESIGN.md`
- Desktop viewport captured at 1440 x 1000.
- Mobile viewport captured at 390 x 900.

## Global Behavior
- No Lenis, Locomotive Scroll, custom scroll container, or scroll snap detected.
- Page uses native document scrolling.
- Header is `position: sticky; top: 0px; z-index: 40` with `backdrop-filter: blur(8px)`.
- Header computed styles do not change between `scrollY = 0` and `scrollY = 300`.

## Category Filter
- Interaction model: click-driven.
- 61 category buttons, including `All`.
- Active button: white background, black text, white border.
- Inactive button: `rgb(16, 16, 16)` background, white/20 border, white/70 text.
- Arrow buttons flank the horizontal category scroller. Left arrow is disabled at initial scroll.
- Clicking a category filters visible cards and updates the counter, for example:
  - `All`: 156 cards
  - `Dark`: 36 cards
  - `Minimal`: 29 cards
  - `Bold`: 36 cards

## Hover States
- Header GitHub link and inactive category buttons use a white/10 hover background.
- Design cards use `transition: all`; no transform change was detected through synthetic hover events.
- Internal action buttons are presentational inside the card anchor in the source page.

## Responsive Behavior
- Desktop 1440px: card grid is 5 columns, 12px gap, section padding 24px 32px.
- Tablet 768px: card grid is 3 columns, 12px gap, section padding 24px 32px.
- Mobile 390px: card grid is 1 column, 12px gap, section padding 24px 16px.
- Header height is 81px on desktop/tablet and 93px on mobile.
- Preview card body height is 214px on `sm` and up, 186px on mobile.

## Detail Page Behavior
- Target URL: `https://designsmd.vercel.app/design/dark--3d-sculpt`.
- Local URL verified: `http://localhost:3000/design/dark--3d-sculpt`.
- Interaction model: static detail content with link navigation.
- Back link navigates to `/`.
- More Designs cards are anchors to `/design/<slug>` detail routes.
- The first directory card was verified locally with href `/design/dark--3d-sculpt`; clicking it navigated to the local detail route and did not render a 404.
- Detail page root uses `data-design="dark--3d-sculpt"` so theme variables resolve from `src/app/design-themes.css`.
- Verified 3D Sculpt variables on local detail:
  - `--card-bg`: `#1c1c1e`
  - `--card-surface`: `#252527`
  - `--card-text`: `#e8e8e6`
  - `--card-muted`: `#8c8b88`
  - `--card-accent`: `#00bfcf`
  - `--card-radius`: `6px`
- Mobile viewport `390px`: document `scrollWidth` equals `clientWidth`; no page-level horizontal overflow.
