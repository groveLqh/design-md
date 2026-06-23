import designsData from "@/data/designs.json";
import type { DesignCatalog, DesignSystem } from "@/types/design";

export const designCatalog = designsData as DesignCatalog;

export function getDesignId(slug: string) {
  return slug.replace(/^\/design\//, "");
}

export function getDesignBySlugParam(slug: string) {
  return designCatalog.designs.find((design) => getDesignId(design.slug) === slug);
}

export function getDesignsByCategory(category: string) {
  return designCatalog.designs.filter((design) => design.category === category);
}

export function getRelatedDesigns(design: DesignSystem, limit = 6) {
  return getDesignsByCategory(design.category)
    .filter((candidate) => candidate.slug !== design.slug)
    .slice(0, limit);
}
