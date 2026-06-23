"use client";

import { useMemo, useRef, useState } from "react";
import { DesignCard } from "@/components/DesignCard";
import { LogoIcon } from "@/components/icons";
import type { DesignSystem } from "@/types/design";

interface DesignDirectoryProps {
  categories: string[];
  designs: DesignSystem[];
}

export function DesignDirectory({ categories, designs }: DesignDirectoryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categoryScrollerRef = useRef<HTMLDivElement>(null);

  const filteredDesigns = useMemo(() => {
    if (activeCategory === "All") {
      return designs;
    }

    return designs.filter((design) => design.category === activeCategory);
  }, [activeCategory, designs]);

  const scrollCategories = (direction: -1 | 1) => {
    categoryScrollerRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-4 py-4 md:px-8">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">DESIGN.md</h1>
            <p className="text-xs text-white/60 md:text-sm">
              A directory of design systems for AI coding agents
            </p>
          </div>
          <a
            href="https://github.com/Hermitxxx/designmd"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs transition-colors hover:bg-white/10"
          >
            <LogoIcon className="h-4 w-4 fill-current" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1500px] px-4 pt-[2px] pb-[57px] md:px-8">
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] font-medium tracking-[0.08em] text-white/45 uppercase">
            Categories
          </p>
          <p className="text-xs text-white/60">
            {filteredDesigns.length}/{designs.length}
          </p>
        </div>

        <div className="mt-2 flex items-start gap-2">
          <button
            type="button"
            aria-label="Previous categories"
            onClick={() => scrollCategories(-1)}
            disabled
            className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#101010] text-[11px] leading-none text-white/70 transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            &larr;
          </button>

          <div
            ref={categoryScrollerRef}
            className="no-scrollbar flex flex-1 gap-2 overflow-x-auto pb-1"
          >
            {categories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={
                    isActive
                      ? "whitespace-nowrap rounded-full border border-white bg-white px-3 py-1 text-xs text-black transition"
                      : "whitespace-nowrap rounded-full border border-white/20 bg-[#101010] px-3 py-1 text-xs text-white/70 transition hover:bg-white/10"
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next categories"
            onClick={() => scrollCategories(1)}
            className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#101010] text-[11px] leading-none text-white/70 transition"
          >
            &rarr;
          </button>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8">
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredDesigns.map((design) => (
            <DesignCard key={design.slug} design={design} />
          ))}
        </ul>
      </section>
    </main>
  );
}
