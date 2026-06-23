import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const raw = await readFile(new URL("../src/data/designs.json", import.meta.url), "utf8");
const data = JSON.parse(raw);

const slugs = new Set(data.designs.map((design) => design.slug));
const categories = new Set(data.designs.map((design) => design.category));

assert.ok(data.designs.length >= 156, "design dataset should include the original card set");
assert.ok(data.categories.includes("All"), "categories should include All");
assert.ok(data.categories.includes("Dark"), "categories should include Dark");
assert.equal(slugs.size, data.designs.length, "design slugs should be unique");
assert.ok(
  Array.from(categories).every((category) => data.categories.includes(category)),
  "categories should include every category used by designs"
);
assert.deepEqual(
  data.categories.slice(1),
  [...data.categories.slice(1)].sort((a, b) => a.localeCompare(b)),
  "categories after All should be sorted"
);
assert.equal(data.designs[0].name, "3D Sculpt", "first card should match the live ordering");
assert.equal(data.designs[0].category, "Dark", "first card category should be Dark");
assert.equal(data.designs[0].colors.background, "rgb(28, 28, 30)", "first card background should be exact");
assert.ok(
  data.designs.some((design) => design.slug === "/design/saas--context-dev"),
  "Context Dev sample should be present"
);
assert.ok(
  data.designs.every((design) => design.name && design.slug && design.description),
  "each design should have display content"
);
