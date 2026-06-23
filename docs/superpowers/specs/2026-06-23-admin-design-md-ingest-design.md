# Admin Design.md Ingest Design

## Goal

Build a private admin workflow for adding new design templates to the Vercel-deployed site by pasting a complete `design.md` document. The database stores only necessary operational fields plus the original markdown; the public directory derives card data from that markdown at read time.

## User Model

- Single-user admin only.
- No public submissions.
- No multi-user roles, audit history, or review workflow in the first version.
- Access is protected by a single `ADMIN_PASSWORD` environment variable.

## Storage Model

Use Neon Postgres through Vercel Marketplace.

Create one table, `design_templates`, with only durable operational data:

- `id`: UUID primary key
- `slug`: stable unique URL/card identifier
- `category`: category used by directory filters
- `source_markdown`: complete pasted `design.md`
- `published`: boolean; only published templates appear on the homepage
- `sort_order`: integer; controls display order after seeded JSON templates
- `created_at`: timestamp
- `updated_at`: timestamp

Do not store parsed card JSON, frontmatter JSON, colors, typography, components, or derived category lists. Those are computed from `source_markdown` so the markdown stays the source of truth.

## Source Markdown Format

Each pasted `design.md` has YAML frontmatter followed by markdown body:

```md
---
version: alpha
name: Context Dev
description: A clean, high-trust SaaS landing page...
colors:
  primary: "#2563EB"
  neutral: "#F9FAFB"
  surface: "#FFFFFF"
  on-surface: "#000000"
  on-surface-muted: "#4B5563"
  border: "#E5E7EB"
components:
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "#030712"
    rounded: "{rounded.lg}"
  button-secondary:
    textColor: "{colors.surface}"
rounded:
  lg: 14px
---

# Context Dev
...
```

The admin form provides `slug` and `category` separately because the supplied markdown may not include them and both must be stable for the directory.

## Parsing Model

Add a server-safe parser that:

1. Splits YAML frontmatter from markdown body.
2. Parses frontmatter with a YAML parser.
3. Resolves simple token references like `{colors.neutral}` and `{rounded.lg}` against the frontmatter object.
4. Builds the existing `DesignSystem` card shape:
   - `name`: frontmatter `name`
   - `category`: database `category`
   - `label`: uppercase name plus `/ UI`
   - `description`: frontmatter `description`
   - `slug`: `/design/${db.slug}`
   - `colors.background`: `components.card.backgroundColor` resolved, fallback `colors.neutral`
   - `colors.surface`: `colors.surface`
   - `colors.text`: `components.card.textColor` resolved, fallback `colors.on-surface`
   - `colors.muted`: `colors.on-surface-muted`
   - `colors.accent`: `colors.primary`
   - `colors.border`: `colors.border`
   - `colors.installText`: `components.button-secondary.textColor` resolved, fallback `colors.surface`
   - `radius`: `components.card.rounded` resolved, fallback `rounded.lg`, then `8px`
   - `shadow`: existing default `rgba(0, 0, 0, 0.26) 0px 8px 24px 0px`

If parsing fails, the admin save action returns a validation error and does not write the row.

## Public Directory Data Flow

The homepage keeps the existing seeded JSON templates as a fallback/base catalog. It then reads published database templates and appends them after the seeded templates by `sort_order`, then `created_at`.

Categories are derived from the final template list:

1. Start with `All`.
2. Include categories from seeded JSON templates.
3. Include categories from database templates.
4. Deduplicate while preserving first-seen order.

Card theme CSS should no longer require a generated static CSS rule for database templates. Instead, `DesignCard` should set CSS variables from `design.colors` through a typed React `style` object so both seeded and database templates render the same way.

## Admin UX

Route: `/admin`

First version UI:

- Password gate using `ADMIN_PASSWORD`.
- Form fields:
  - `slug`
  - `category`
  - `published`
  - `sort_order`
  - `source_markdown`
- Preview panel generated from the pasted markdown before saving.
- Save button writes to Neon Postgres through a Server Action.

No edit/list/delete UI is required in the first version. A future version can add those screens without changing the table shape.

## Environment Variables

- `DATABASE_URL`: Neon Postgres connection string, provisioned through Vercel Marketplace.
- `ADMIN_PASSWORD`: private admin password, configured in Vercel and local `.env.local`.

Local development should keep working without `DATABASE_URL`: the public homepage falls back to seeded JSON, and `/admin` shows a setup message instead of crashing.

## Verification

- Unit-test parser behavior with the provided sample markdown format.
- Verify homepage still renders 156 seeded templates without database env vars.
- Verify admin route does not crash without database env vars.
- Verify `npm run check` passes.
- After Vercel env vars are configured, deploy and confirm adding a database template makes it appear on the public homepage.
