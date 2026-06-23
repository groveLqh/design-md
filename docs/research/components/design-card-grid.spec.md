# DesignCardGrid Specification

## Overview
- **Target files:** `src/components/DesignCard.tsx`, `src/components/DesignGrid.tsx`
- **Screenshot:** `docs/design-references/designsmd-desktop-full.png`
- **Interaction model:** static card anchors with click navigation

## DOM Structure
- `ul` grid
  - `li`
    - `a` card wrapper
      - preview panel with top meta, label row, action buttons, preview footer
      - divider
      - title/category row
      - description
      - bottom tag row

## Computed Styles
- Grid: display grid, gap 12px, margin 0, padding 0, list-style none.
- Desktop columns at 1440px: five columns around 265.6px each.
- Card: Inter, padding 14px on desktop, border 1px solid theme border, shadow `rgba(0, 0, 0, 0.26) 0px 8px 24px`, overflow hidden.
- Preview panel: height 214px on `sm+`, 186px on mobile; rounded by card radius; same border and shadow family.
- Header label: 13px, font-weight 600, uppercase, letter spacing 0.65px.
- Action buttons: 10px, font-weight 600, padding 4px 10px.
- Card title: 19px desktop, 15px mobile, font-weight 600.
- Description: 12px desktop, 11px mobile, single-line ellipsis.

## Content
- Data source: `src/data/designs.json`.
- Card count: 156.
- No bitmap assets are used.

## Responsive Behavior
- Mobile: 1 column, section padding 16px, preview footer switches to compact circles.
- Tablet: 3 columns at 768px.
- Desktop: 5 columns at 1440px.

