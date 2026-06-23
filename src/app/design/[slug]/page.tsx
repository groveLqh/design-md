import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignDetail } from "@/components/DesignDetail";
import { designCatalog, getDesignBySlugParam, getDesignId } from "@/lib/designs";

interface DesignPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return designCatalog.designs.map((design) => ({
    slug: getDesignId(design.slug),
  }));
}

export async function generateMetadata({ params }: DesignPageProps): Promise<Metadata> {
  const { slug } = await params;
  const design = getDesignBySlugParam(slug);

  if (!design) {
    return {
      title: "Design not found | DESIGN.md",
    };
  }

  return {
    title: `${design.name} DESIGN.md | DESIGN.md Directory`,
    description: design.description,
  };
}

export default async function DesignPage({ params }: DesignPageProps) {
  const { slug } = await params;
  const design = getDesignBySlugParam(slug);

  if (!design) {
    notFound();
  }

  return <DesignDetail design={design} />;
}
