import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildDesignFromMarkdown,
  designCssRules,
  upsertDesignCatalog,
} from "./design-md-utils.mjs";

const sample = await readFile(
  "/Users/a123/.codex/attachments/ee5a907b-6e63-4f54-a939-59240daaabce/pasted-text.txt",
  "utf8",
);

const design = buildDesignFromMarkdown(sample, { category: "SaaS" });

assert.equal(design.name, "Context Dev");
assert.equal(design.category, "SaaS");
assert.equal(design.label, "CONTEXT DEV / UI");
assert.equal(design.slug, "/design/saas--context-dev");
assert.equal(design.colors.background, "#F9FAFB");
assert.equal(design.colors.surface, "#FFFFFF");
assert.equal(design.colors.text, "#030712");
assert.equal(design.colors.muted, "#4B5563");
assert.equal(design.colors.accent, "#2563EB");
assert.equal(design.colors.border, "#E5E7EB");
assert.equal(design.colors.installText, "#FFFFFF");
assert.equal(design.radius, "14px");

const catalog = upsertDesignCatalog(
  { categories: ["All", "Dark"], designs: [] },
  design,
);

assert.deepEqual(catalog.categories, ["All", "Dark", "SaaS"]);
assert.equal(catalog.designs.length, 1);
assert.equal(catalog.designs[0].slug, "/design/saas--context-dev");
assert.match(designCssRules([design]), /\[data-design="saas--context-dev"\]/);
