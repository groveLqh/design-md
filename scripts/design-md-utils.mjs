const DEFAULT_SHADOW = "rgba(0, 0, 0, 0.26) 0px 8px 24px 0px";

function extractFrontmatter(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    throw new Error("design.md must start with YAML frontmatter delimited by ---");
  }

  const end = normalized.indexOf("\n---", 4);

  if (end !== -1) {
    return normalized.slice(4, end).trimEnd();
  }

  const bodyStart = normalized.slice(4).search(/\n#[^#]/);

  if (bodyStart === -1) {
    return normalized.slice(4).trimEnd();
  }

  return normalized.slice(4, bodyStart + 4).trimEnd();
}

function parseScalar(value) {
  const trimmed = value.trim();

  if (trimmed === "") {
    return "";
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  return trimmed;
}

export function parseYamlSubset(input) {
  const root = {};
  const stack = [{ indent: -1, value: root }];
  const lines = input.split("\n");

  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }

    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    const content = line.trim();
    const colonIndex = content.indexOf(":");

    if (colonIndex === -1) {
      throw new Error(`Unsupported YAML line: ${line}`);
    }

    const key = content.slice(0, colonIndex).trim();
    const value = content.slice(colonIndex + 1);

    while (stack.at(-1).indent >= indent) {
      stack.pop();
    }

    const parent = stack.at(-1).value;

    if (value.trim() === "") {
      parent[key] = {};
      stack.push({ indent, value: parent[key] });
    } else {
      parent[key] = parseScalar(value);
    }
  }

  return root;
}

function getPath(source, path) {
  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return current[key];
    }

    return undefined;
  }, source);
}

function resolveToken(value, source) {
  if (typeof value !== "string") {
    return value === undefined || value === null ? undefined : String(value);
  }

  return value.replace(/\{([^}]+)\}/g, (_, path) => {
    const resolved = getPath(source, path.trim());
    return resolved === undefined ? `{${path}}` : String(resolved);
  });
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function designId(slug) {
  return slug.replace(/^\/design\//, "");
}

function normalizeSlug(slug, category, name) {
  if (slug) {
    const clean = slug.replace(/^\/design\//, "").replace(/^\/+/, "");
    return `/design/${clean}`;
  }

  return `/design/${slugify(category)}--${slugify(name)}`;
}

export function buildDesignFromMarkdown(markdown, options = {}) {
  const metadata = parseYamlSubset(extractFrontmatter(markdown));
  const category = firstString(options.category, metadata.category, "Custom");
  const name = firstString(metadata.name);
  const description = firstString(metadata.description);

  if (!name) {
    throw new Error("design.md frontmatter must include a name");
  }

  if (!description) {
    throw new Error("design.md frontmatter must include a description");
  }

  const colors = metadata.colors && typeof metadata.colors === "object" ? metadata.colors : {};
  const components =
    metadata.components && typeof metadata.components === "object" ? metadata.components : {};
  const rounded =
    metadata.rounded && typeof metadata.rounded === "object" ? metadata.rounded : {};
  const card = components.card && typeof components.card === "object" ? components.card : {};
  const secondaryButton =
    components["button-secondary"] && typeof components["button-secondary"] === "object"
      ? components["button-secondary"]
      : {};

  const source = { ...metadata, colors, components, rounded };
  const background = firstString(
    resolveToken(card.backgroundColor, source),
    resolveToken(colors.neutral, source),
    "#F9FAFB",
  );
  const surface = firstString(resolveToken(colors.surface, source), "#FFFFFF");
  const text = firstString(
    resolveToken(card.textColor, source),
    resolveToken(colors["on-surface"], source),
    "#111111",
  );
  const muted = firstString(
    resolveToken(colors["on-surface-muted"], source),
    resolveToken(colors["border-strong"], source),
    "#6B7280",
  );
  const mutedSurface = firstString(
    resolveToken(colors["muted-surface"], source),
    resolveToken(colors["surface-muted"], source),
    undefined,
  );
  const accent = firstString(
    resolveToken(colors.primary, source),
    resolveToken(colors.secondary, source),
    "#2563EB",
  );
  const border = firstString(
    resolveToken(colors.border, source),
    resolveToken(colors["border-strong"], source),
    muted,
  );
  const installText = firstString(
    resolveToken(secondaryButton.textColor, source),
    resolveToken(colors.surface, source),
    "#FFFFFF",
  );
  const radius = firstString(
    resolveToken(card.rounded, source),
    resolveToken(rounded.lg, source),
    "8px",
  );

  return {
    name,
    category,
    label: `${name.toUpperCase()} / UI`,
    description,
    slug: normalizeSlug(options.slug, category, name),
    colors: {
      background,
      surface,
      text,
      muted,
      ...(mutedSurface ? { mutedSurface } : {}),
      accent,
      border,
      installText,
    },
    radius,
    shadow: DEFAULT_SHADOW,
  };
}

export function upsertDesignCatalog(catalog, design) {
  const existingIndex = catalog.designs.findIndex((item) => item.slug === design.slug);
  const designs =
    existingIndex === -1
      ? [...catalog.designs, design]
      : catalog.designs.map((item, index) => (index === existingIndex ? design : item));
  const categorySet = new Set([
    ...catalog.categories.filter((category) => category !== "All"),
    ...designs.map((item) => item.category),
  ]);
  const categories = [
    "All",
    ...Array.from(categorySet).sort((a, b) => a.localeCompare(b)),
  ];

  return { categories, designs };
}

function cssEscapeValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function designCssRules(designs) {
  const lines = ["/* Generated from src/data/designs.json. Do not edit by hand. */"];

  for (const design of designs) {
    const id = cssEscapeValue(designId(design.slug));
    const { colors } = design;
    const mutedSurfaceTokens = colors.mutedSurface
      ? ` --card-muted-surface: ${colors.mutedSurface}; --card-muted-surface-text: ${colors.accent};`
      : "";

    lines.push(
      `[data-design="${id}"] { --card-bg: ${colors.background}; --card-surface: ${colors.surface}; --card-text: ${colors.text}; --card-muted: ${colors.muted};${mutedSurfaceTokens} --card-accent: ${colors.accent}; --card-border: ${colors.border}; --card-install-text: ${colors.installText}; --card-radius: ${design.radius}; --card-shadow: ${design.shadow}; }`,
    );
  }

  return `${lines.join("\n")}\n`;
}
