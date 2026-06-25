import Link from "next/link";
import type { DesignSystem } from "@/types/design";

interface DesignCardProps {
  design: DesignSystem;
  itemClassName?: string;
}

function designId(slug: string) {
  return slug.replace("/design/", "");
}

export function DesignCard({ design, itemClassName }: DesignCardProps) {
  return (
    <li className={itemClassName}>
      <Link
        href={design.slug}
        data-design={designId(design.slug)}
        className="design-card block h-full overflow-hidden border p-3 sm:p-3.5"
      >
        <div className="h-[186px] sm:h-[214px]">
          <div className="design-card-preview flex h-full flex-col overflow-hidden border p-3 sm:p-3.5">
            <div className="flex items-center justify-between text-[10px] text-[var(--card-muted)]">
              <span className="inline-block h-5 w-11 rounded-md border border-[var(--card-border)] bg-[var(--card-muted-surface)]" />
              <span className="text-[9px] tracking-[0.08em] uppercase">{design.category}</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[var(--card-accent)]" />
              <p className="min-w-0 flex-1 overflow-hidden text-[13px] font-semibold text-ellipsis whitespace-nowrap tracking-[0.05em] uppercase">
                {design.label}
              </p>
            </div>

            <div className="mt-4 hidden gap-4 text-[10px] text-[var(--card-muted)] sm:flex">
              <span>Foundations</span>
              <span>Components</span>
            </div>

            <div className="mt-4 flex gap-2 text-[10px]">
              <span className="rounded-md border border-[var(--card-border)] px-2.5 py-1 font-semibold">
                DOCS
              </span>
              <span className="rounded-md bg-[var(--card-accent)] px-2.5 py-1 font-semibold tracking-[0.08em] text-[var(--card-install-text)] uppercase">
                INSTALL
              </span>
            </div>

            <div className="mt-auto hidden items-center justify-between border-t border-[var(--card-border)] pt-3 sm:flex">
              <p className="text-[10px] tracking-[0.08em] text-[var(--card-muted)] uppercase">
                Preview
              </p>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[var(--card-accent)]" />
                <span className="h-2.5 w-2.5 rounded-sm bg-[var(--card-muted-surface)]" />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[var(--card-border)] pt-2.5 sm:hidden">
              <p className="text-[9px] tracking-[0.08em] text-[var(--card-muted)] uppercase">
                Preview
              </p>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--card-accent)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--card-muted-surface)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="my-2 h-px bg-[var(--card-border)] sm:my-3" />

        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] leading-tight font-semibold sm:text-[19px]">
            {design.name}
          </h3>
          <span className="rounded-full bg-[var(--card-accent)] px-2 py-1 text-[9px] font-semibold tracking-[0.08em] text-[var(--card-install-text)] uppercase">
            {design.category}
          </span>
        </div>

        <p className="mt-1 overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-[var(--card-muted)] sm:text-xs">
          {design.description}
        </p>

        <div className="mt-2 flex items-center justify-between sm:hidden">
          <span className="rounded-full border border-[var(--card-border)] bg-[var(--card-muted-surface)] px-2 py-1 text-[9px] tracking-[0.08em] uppercase">
            {design.category.toLowerCase()}
          </span>
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--card-accent)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--card-muted-surface)]" />
          </div>
        </div>

        <div className="mt-1 hidden sm:mt-2 sm:block">
          <span className="rounded-full border border-[var(--card-border)] bg-[var(--card-muted-surface)] px-2 py-1 text-[9px] tracking-[0.08em] uppercase">
            {design.category.toLowerCase()}
          </span>
        </div>
      </Link>
    </li>
  );
}
