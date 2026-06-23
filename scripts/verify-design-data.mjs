import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const raw = await readFile(new URL("../src/data/designs.json", import.meta.url), "utf8");
const data = JSON.parse(raw);

assert.equal(data.designs.length, 156, "design dataset should include all 156 cards");
assert.ok(data.categories.includes("All"), "categories should include All");
assert.ok(data.categories.includes("Dark"), "categories should include Dark");
assert.equal(data.designs[0].name, "3D Sculpt", "first card should match the live ordering");
assert.equal(data.designs[0].category, "Dark", "first card category should be Dark");
assert.equal(data.designs[0].colors.background, "rgb(28, 28, 30)", "first card background should be exact");
assert.ok(
  data.designs.every((design) => design.name && design.slug && design.description),
  "each design should have display content"
);
