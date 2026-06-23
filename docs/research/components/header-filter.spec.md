# HeaderFilter Specification

## Overview
- **Target file:** `src/components/HeaderFilter.tsx`
- **Screenshot:** `docs/design-references/designsmd-desktop-full.png`
- **Interaction model:** click-driven category filter, hover-only GitHub link

## DOM Structure
- `header`
  - max-width flex container
  - title/subtitle block
  - GitHub anchor with inline SVG icon
- category band below header in page flow
  - label/count row
  - previous arrow button
  - horizontal scrollable category button row
  - next arrow button

## Computed Styles
- Header: height 81px desktop, sticky top 0, z-index 40, background `lab(2.74175 0 0.00000596046 / 0.85)`, border-bottom white/10, backdrop blur 8px.
- Title: Fira Code, 20px, 700, 28px line-height, letter spacing `-0.5px`, white.
- Subtitle: Fira Code, 14px desktop / 12px mobile, white/60.
- GitHub link: 12px, border white/20, rounded-full, padding 8px 12px, gap 8px.
- Category label: 11px, uppercase, letter spacing 0.88px, white/45.
- Counter: 12px, white/60.
- Category pills: 12px, rounded-full, padding 4px 12px, transition 150ms cubic-bezier.

## States & Behaviors
- Active category: border white, background white, color black.
- Inactive category: border white/20, background `rgb(16, 16, 16)`, color white/70, hover background white/10.
- Arrow disabled: opacity 0.3, not-allowed cursor.
- Category row horizontally scrolls; arrow buttons call `scrollBy`.

## Assets
- `LogoIcon` from `src/components/icons.tsx` implements the inspected SVG.

