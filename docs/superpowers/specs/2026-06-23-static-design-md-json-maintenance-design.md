# Static Design.md JSON Maintenance Design

## Goal

Keep the deployed Vercel site simple for now: new templates are added by parsing a supplied `design.md` file into the existing static JSON catalog, then committing and redeploying.

## User Model

- Single maintainer workflow.
- No public submissions.
- No database, login, or admin UI in this version.
- Codex can receive a new `design.md`, run the script, commit the JSON change, and redeploy.

## Source Of Truth

The app still renders from:

- `src/data/designs.json`
- `src/app/design-themes.css`

The full original `design.md` is not stored in the app data yet. The generated JSON keeps only the fields needed by the current card grid:

- `name`
- `category`
- `label`
- `description`
- `slug`
- `colors`
- `radius`
- `shadow`

## Input Format

The script expects YAML-style metadata at the top of the supplied file:

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
rounded:
  lg: 14px
components:
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "#030712"
    rounded: "{rounded.lg}"
  button-secondary:
    textColor: "{colors.surface}"
---
```

The closing `---` is accepted but not required, because the current supplied sample only includes the opening delimiter.

## Script Behavior

Command:

```bash
npm run add-design -- path/to/design.md --category SaaS
```

The script:

1. Parses the YAML subset used by the current `design.md` files.
2. Resolves token references such as `{colors.neutral}` and `{rounded.lg}`.
3. Builds the current `DesignSystem` card shape.
4. Upserts by `slug` so rerunning the command updates instead of duplicating.
5. Rebuilds `src/app/design-themes.css` from the JSON catalog.

Default slug format:

```txt
/design/{category-slug}--{name-slug}
```

For the first added template:

```txt
/design/saas--context-dev
```

## Verification

- `node scripts/test-design-md-utils.mjs`
- `npm run verify:data`
- `npm run check`

## Deployment

Because storage is static JSON, production needs a redeploy after each added template:

```bash
npx vercel deploy --prod --yes
```

This is acceptable for the current maintenance model. If template additions become frequent enough to avoid redeploys, revisit the Vercel database/admin UI design.
