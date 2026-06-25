import Link from "next/link";
import { DesignCard } from "@/components/DesignCard";
import { DesignFileActions } from "@/components/DesignFileActions";
import { getDesignId, getDesignsByCategory, getRelatedDesigns } from "@/lib/designs";
import type { DesignSystem } from "@/types/design";

interface DesignDetailProps {
  design: DesignSystem;
}

interface TokenItem {
  key: "bg" | "surface" | "mutedSurface" | "accent" | "text" | "muted" | "border";
  label: string;
  value: string;
}

const featureCards = ["Fast integration", "Built for scale", "Obsessed with quality"];

const stats = [
  { value: "99.99%", label: "Uptime" },
  { value: "4.8M", label: "Monthly users" },
  { value: "147ms", label: "Median response" },
  { value: "24/7", label: "Support" },
];

function rgbToHex(value: string) {
  const channels = value.match(/\d+/g)?.slice(0, 3).map(Number);

  if (!channels || channels.length !== 3) {
    return value;
  }

  return `#${channels
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function slugLeaf(design: DesignSystem) {
  return getDesignId(design.slug).split("--").at(1) ?? getDesignId(design.slug);
}

function markdownPath(design: DesignSystem) {
  return `/design-mds/${design.category.toLowerCase()}/${slugLeaf(design)}/design.md`;
}

function markdownFilename(design: DesignSystem) {
  return `${getDesignId(design.slug)}.design.md`;
}

function buildMarkdown(design: DesignSystem) {
  const primary = rgbToHex(design.colors.text);
  const secondary = rgbToHex(design.colors.muted);
  const tertiary = rgbToHex(design.colors.accent);
  const neutral = rgbToHex(design.colors.background);
  const surface = rgbToHex(design.colors.surface);
  const onPrimary = rgbToHex(design.colors.installText);

  return `---
version: alpha
name: ${design.name}
description: ${design.description}
colors:
  primary: "${primary}"
  secondary: "${secondary}"
  tertiary: "${tertiary}"
  neutral: "${neutral}"
  surface: "${surface}"
  on-primary: "${onPrimary}"
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 3.5rem
    fontWeight: 600
    letterSpacing: "-0.02em"
  h1:
    fontFamily: Space Grotesk
    fontSize: 1.85rem
    fontWeight: 600
  body:
    fontFamily: Inter
    fontSize: 0.92rem
    lineHeight: 1.55
  label:
    fontFamily: IBM Plex Mono
    fontSize: 0.7rem
    letterSpacing: "0.06em"
rounded:
  sm: 3px
  md: ${design.radius}
  lg: 10px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: 24px
---

## Overview

A token-first interface system for ${design.description.toLowerCase()}

## Colors

The palette is built around high-contrast neutrals and a single accent that drives interaction.

- **Primary (${primary}):** Headlines and core text.
- **Secondary (${secondary}):** Borders, captions, and metadata.
- **Tertiary (${tertiary}):** The sole driver for interaction. Reserve it.
- **Neutral (${neutral}):** The page foundation.

## Typography

- **display:** Space Grotesk 3.5rem
- **h1:** Space Grotesk 1.85rem
- **body:** Inter 0.92rem
- **label:** IBM Plex Mono 0.7rem

## Do's and Don'ts

- **Do** use Tertiary for exactly one action per screen.
- **Do** let Neutral carry the composition - negative space is a feature.
- **Don't** introduce unrelated accents.
- **Don't** let decorative styling outrank token consistency.`;
}

function colorTokens(design: DesignSystem): TokenItem[] {
  return [
    { key: "bg", label: "bg", value: rgbToHex(design.colors.background) },
    { key: "surface", label: "surface", value: rgbToHex(design.colors.surface) },
    {
      key: "mutedSurface",
      label: "mutedSurface",
      value: rgbToHex(design.colors.mutedSurface ?? design.colors.muted),
    },
    { key: "accent", label: "accent", value: rgbToHex(design.colors.accent) },
    { key: "text", label: "text", value: rgbToHex(design.colors.text) },
    { key: "muted", label: "muted", value: rgbToHex(design.colors.muted) },
    { key: "border", label: "border", value: rgbToHex(design.colors.border) },
  ];
}

export function DesignDetail({ design }: DesignDetailProps) {
  const tags = [design.category.toUpperCase(), slugLeaf(design).replaceAll("-", " ").toUpperCase(), "DESIGN-MD"];
  const resources = getDesignsByCategory(design.category);
  const relatedDesigns = getRelatedDesigns(design);
  const markdown = buildMarkdown(design);

  return (
    <main data-design={getDesignId(design.slug)} className="design-detail min-h-screen">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-6 sm:px-8 sm:py-10">
        <section className="space-y-5">
          <Link href="/" className="inline-flex text-sm font-semibold text-[var(--card-accent)]">
            &larr; Back to Directory
          </Link>

          <div className="space-y-4">
            <div>
              <h1 className="font-display text-5xl leading-none font-semibold tracking-normal sm:text-6xl">
                {design.name}
              </h1>
              <p className="mt-5 max-w-3xl text-lg font-semibold text-[var(--card-muted)]">
                {design.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className={
                    index === 0
                      ? "rounded-full bg-[var(--card-accent)] px-3 py-1 text-xs font-bold text-[var(--card-install-text)]"
                      : "rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-semibold text-[var(--card-text)]"
                  }
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="design-detail-panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--card-border)] px-5 py-4">
              <div className="flex items-center gap-2 font-bold">
                <span className="h-3 w-3 rounded-full bg-[var(--card-accent)]" />
                {design.name}
              </div>
              <nav className="flex gap-5 text-sm font-semibold text-[var(--card-muted)]">
                <span>Features</span>
                <span>Docs</span>
                <span>Pricing</span>
                <span>Blog</span>
              </nav>
              <button type="button" className="rounded-md bg-[var(--card-accent)] px-4 py-3 text-sm font-bold text-[var(--card-install-text)]">
                Start now
              </button>
            </div>

            <div className="px-5 py-16 text-center sm:py-20">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--card-accent)] uppercase">
                Real product preview
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                Build with {design.name}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm font-semibold text-[var(--card-muted)]">
                {design.description}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" className="rounded-md bg-[var(--card-accent)] px-5 py-3 text-sm font-bold text-[var(--card-install-text)]">
                  Primary action
                </button>
                <button type="button" className="rounded-md border border-[var(--card-border)] px-5 py-3 text-sm font-bold">
                  Secondary
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map((title) => (
              <article key={title} className="design-detail-panel p-5">
                <span className="block h-8 w-8 rounded-md bg-[var(--card-accent)]" />
                <h3 className="mt-7 text-base font-bold">{title}</h3>
                <p className="mt-3 text-sm font-semibold text-[var(--card-muted)]">
                  Purpose-built components that reflect this brand language in every interaction.
                </p>
              </article>
            ))}
          </div>

          <div className="design-detail-panel grid overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border-b border-[var(--card-border)] px-5 py-6 text-center sm:border-r sm:border-b-0 last:border-r-0">
                <p className="text-3xl font-bold text-[var(--card-accent)]">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--card-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="design-detail-panel p-5">
            <h2 className="text-xl font-bold">Get early access</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input className="rounded-md bg-[var(--card-muted-surface)] px-4 py-3 text-sm font-bold text-[var(--card-text)] placeholder:text-[var(--card-muted)]" placeholder="Your name" />
              <input className="rounded-md bg-[var(--card-muted-surface)] px-4 py-3 text-sm font-bold text-[var(--card-text)] placeholder:text-[var(--card-muted)]" placeholder="Work email" />
              <button type="button" className="rounded-md bg-[var(--card-accent)] px-5 py-3 text-sm font-bold text-[var(--card-install-text)]">
                Join waitlist
              </button>
            </div>
          </div>

          <footer className="design-detail-panel p-5">
            <div className="grid gap-8 border-b border-[var(--card-border)] pb-6 md:grid-cols-4">
              <div>
                <h2 className="font-bold">{design.name}</h2>
                <p className="mt-3 text-sm font-semibold text-[var(--card-muted)]">
                  Built from token-first design decisions.
                </p>
              </div>
              {["Product", "Resources", "Company"].map((group) => (
                <div key={group}>
                  <h3 className="text-sm font-bold">{group}</h3>
                  <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--card-muted)]">
                    <li>Overview</li>
                    <li>Guides</li>
                    <li>Pricing</li>
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-5 text-sm font-semibold text-[var(--card-muted)]">
              <p>&copy; 2026 {design.name}</p>
              <p className="tracking-[0.35em]">...</p>
            </div>
          </footer>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <article className="design-detail-panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] px-5 py-4">
              <h2 className="text-sm font-bold tracking-[0.12em] uppercase">DESIGN.md</h2>
              <DesignFileActions
                content={markdown}
                filename={markdownFilename(design)}
                copyLabel="Copy Markdown"
                downloadLabel="Download .md"
                size="md"
              />
            </div>
            <pre className="max-h-[580px] overflow-auto bg-slate-800/70 p-5 text-xs leading-6 text-slate-300">
              <code>{markdown}</code>
            </pre>
          </article>

          <aside className="design-detail-panel self-start p-5">
            <h2 className="text-xl font-bold">Color Tokens</h2>
            <div className="mt-5 space-y-3">
              {colorTokens(design).map((token) => (
                <button key={token.key} type="button" data-token={token.key} className="design-token-row">
                  <span className="flex items-center gap-2">
                    <span className="design-token-swatch" />
                    {token.value}
                  </span>
                  <span>{token.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-[var(--card-border)] pt-5">
              <h3 className="font-bold">Typography</h3>
              <dl className="mt-4 text-sm font-semibold text-[var(--card-muted)]">
                <div>Font: Inter</div>
                <div>Radius: {design.radius}</div>
                <div>Shadow: {design.shadow}</div>
              </dl>
            </div>

            <div className="mt-8 border-t border-[var(--card-border)] pt-5">
              <h3 className="font-bold">Tags</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--card-muted-surface)] px-3 py-1 text-xs font-bold text-[var(--card-muted-surface-text)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="design-detail-panel p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Resources - {design.category}</h2>
            <p className="text-sm font-semibold text-[var(--card-muted)]">
              {resources.length} markdown files
            </p>
          </div>
          <div className="max-h-[380px] overflow-auto pr-1">
            {resources.map((resource) => (
              <div key={resource.slug} className="mb-3 grid gap-3 rounded-md border border-[var(--card-border)] bg-[var(--card-muted-surface)] p-4 text-[var(--card-text)] md:grid-cols-[1fr_auto] md:items-center">
                <div className="min-w-0">
                  <h3 className="font-bold">{resource.name}</h3>
                  <p className="mt-2 truncate text-sm font-semibold">{markdownPath(resource)}</p>
                </div>
                <DesignFileActions content={buildMarkdown(resource)} filename={markdownFilename(resource)} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">More Designs</h2>
            <Link href={`/?style=${encodeURIComponent(design.category)}`} className="text-sm font-bold text-[var(--card-accent)]">
              View all &rarr;
            </Link>
          </div>
          <ul className="no-scrollbar flex gap-4 overflow-x-auto p-4">
            {relatedDesigns.map((relatedDesign) => (
              <DesignCard
                key={relatedDesign.slug}
                design={relatedDesign}
                itemClassName="min-w-[250px] list-none sm:min-w-[280px]"
              />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
