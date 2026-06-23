#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildDesignFromMarkdown,
  designCssRules,
  upsertDesignCatalog,
} from "./design-md-utils.mjs";

const DATA_PATH = new URL("../src/data/designs.json", import.meta.url);
const CSS_PATH = new URL("../src/app/design-themes.css", import.meta.url);

function usage() {
  return [
    "Usage:",
    "  npm run add-design -- <path-to-design.md> [--category SaaS] [--slug saas--context-dev] [--dry-run]",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { dryRun: false };
  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--category") {
      options.category = argv[index + 1];
      index += 1;
    } else if (arg === "--slug") {
      options.slug = argv[index + 1];
      index += 1;
    } else if (arg.startsWith("--category=")) {
      options.category = arg.slice("--category=".length);
    } else if (arg.startsWith("--slug=")) {
      options.slug = arg.slice("--slug=".length);
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length !== 1) {
    throw new Error(usage());
  }

  return {
    filePath: resolve(positional[0]),
    options,
  };
}

async function main() {
  const { filePath, options } = parseArgs(process.argv.slice(2));
  const [markdown, rawCatalog] = await Promise.all([
    readFile(filePath, "utf8"),
    readFile(DATA_PATH, "utf8"),
  ]);
  const design = buildDesignFromMarkdown(markdown, options);
  const catalog = upsertDesignCatalog(JSON.parse(rawCatalog), design);
  const css = designCssRules(catalog.designs);

  if (!options.dryRun) {
    await Promise.all([
      writeFile(DATA_PATH, `${JSON.stringify(catalog, null, 2)}\n`),
      writeFile(CSS_PATH, css),
    ]);
  }

  const mode = options.dryRun ? "Would add" : "Added";
  console.log(`${mode} ${design.name} (${design.category}) at ${design.slug}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
