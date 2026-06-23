import { DesignDirectory } from "@/components/DesignDirectory";
import designsData from "@/data/designs.json";
import type { DesignCatalog } from "@/types/design";

const catalog = designsData as DesignCatalog;

export default function Home() {
  return <DesignDirectory categories={catalog.categories} designs={catalog.designs} />;
}
