# DESIGN.md

A public directory of reusable `design.md` templates for AI coding agents.

- Site: [design-md-phi.vercel.app](https://design-md-phi.vercel.app)
- Repository: [groveLqh/design-md](https://github.com/groveLqh/design-md)
- Current data source: static JSON in `src/data/designs.json`

## What This Site Does

The homepage renders a searchable visual catalog of design systems. Each card is built from the small `DesignSystem` shape used by the app:

```ts
{
  name: string;
  category: string;
  label: string;
  description: string;
  slug: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    border: string;
    installText: string;
  };
  radius: string;
  shadow: string;
}
```

For now, new templates are added by parsing a `design.md` file into that JSON format. No database is required.

## Add A Template

Give the script a `design.md` file:

```bash
npm run add-design -- ./path/to/design.md --category SaaS
```

Optional flags:

```bash
npm run add-design -- ./path/to/design.md --category SaaS --slug saas--context-dev
npm run add-design -- ./path/to/design.md --category SaaS --dry-run
```

The script updates:

- `src/data/designs.json`
- `src/app/design-themes.css`

It reads the template frontmatter first. The important fields are:

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

If `components.card` is present, those values win. Otherwise the script falls back to the nearest matching `colors` and `rounded` tokens.

## Friendly Link

The header includes a `友情链接` link to the current created template:

```txt
#saas--context-dev
```

The target comes from the generated slug `/design/saas--context-dev`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
node scripts/test-design-md-utils.mjs
npm run verify:data
npm run check
```

`npm run check` runs lint, TypeScript, and the production build.

## Deployment

This project is deployed on Vercel. After changing JSON or code:

```bash
npx vercel deploy --prod --yes
```

Because the current storage is static JSON, every new template needs a commit and redeploy before it appears on the production site.
