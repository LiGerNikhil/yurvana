"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  List,
  LayoutGrid,
  PackageSearch,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  buildCatalogHref,
  countActiveFilters,
  EMPTY_CATALOG_FILTERS,
  type CatalogFacet,
  type CatalogFilters,
  type CatalogItem,
  type CatalogPriceBounds,
  type CatalogView,
} from "@/lib/catalog";
import { CatalogFilters as FiltersPanel } from "./CatalogFilters";
import { CatalogItemCard } from "./CatalogItemCard";
import { CatalogTable } from "./CatalogTable";

type CatalogResultsProps = {
  items: CatalogItem[];
  view: CatalogView;
  onReset: () => void;
};

function CatalogResults({ items, view, onReset }: CatalogResultsProps) {
  if (items.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PackageSearch className="size-6" />
        </span>
        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            No materials found
          </h2>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            Try widening your price range or clearing some filters.
          </p>
        </div>
        <Button type="button" variant="gold" onClick={onReset}>
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <>
      {view === "table" ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
          <CatalogTable items={items} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <CatalogItemCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </>
  );
}

type CatalogViewerProps = {
  categories: CatalogFacet[];
  forms: CatalogFacet[];
  bounds: CatalogPriceBounds;
  filters: CatalogFilters;
  items: CatalogItem[];
  total: number;
  lockedCategory: { slug: string; name: string } | null;
};

export function CatalogViewer({
  categories,
  forms,
  bounds,
  filters,
  items,
  total,
  lockedCategory,
}: CatalogViewerProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const lockedSlug = lockedCategory?.slug ?? null;
  const pageKey = buildCatalogHref(filters, lockedSlug);
  const activeCount = countActiveFilters(filters);

  const patch = (next: Partial<CatalogFilters>) => {
    router.push(buildCatalogHref({ ...filters, ...next }, lockedSlug));
  };

  const setView = (view: CatalogView) => {
    if (view === filters.view) return;
    patch({ view });
  };

  const reset = () => {
    router.push(
      buildCatalogHref(
        { ...EMPTY_CATALOG_FILTERS, view: filters.view },
        lockedSlug,
      ),
    );
  };

  const filtersPanel = (
    <FiltersPanel
      key={pageKey}
      categories={categories}
      forms={forms}
      bounds={bounds}
      filters={filters}
      lockedCategory={lockedCategory}
      onPatch={patch}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="gap-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-text-primary">
                Filters
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={reset}
                className={cn(
                  "h-7 px-2 text-xs",
                  activeCount === 0 && "pointer-events-none opacity-40",
                )}
              >
                <X data-icon="inline-start" />
                Reset
              </Button>
            </div>
            {filtersPanel}
          </div>
        </aside>

        <section className="mt-6 lg:mt-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted">
              <span className="font-semibold text-text-primary">
                {items.length}
              </span>{" "}
              material{items.length === 1 ? "" : "s"}
              {items.length < total ? ` of ${total}` : ""}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
                <button
                  type="button"
                  aria-pressed={filters.view === "grid"}
                  aria-label="Grid view"
                  onClick={() => setView("grid")}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md transition-colors",
                    filters.view === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-text-muted hover:bg-secondary hover:text-text-primary",
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  aria-pressed={filters.view === "table"}
                  aria-label="Table view"
                  onClick={() => setView("table")}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md transition-colors",
                    filters.view === "table"
                      ? "bg-primary text-primary-foreground"
                      : "text-text-muted hover:bg-secondary hover:text-text-primary",
                  )}
                >
                  <List className="size-4" />
                </button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="default"
                className="relative lg:hidden"
                onClick={() => setSheetOpen(true)}
              >
                <SlidersHorizontal data-icon="inline-start" />
                Filters
                {activeCount > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-gold px-1 text-[11px] font-semibold text-primary-dark">
                    {activeCount}
                  </span>
                ) : null}
              </Button>
            </div>
          </div>

          <div key={pageKey}>
            <CatalogResults items={items} view={filters.view} onReset={reset} />
          </div>
        </section>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton
          className="max-h-[85vh] overflow-y-auto rounded-t-2xl pb-2"
        >
          <SheetHeader className="border-b border-border">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="px-4">{filtersPanel}</div>
          <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 pt-4 pb-4 backdrop-blur">
            <Button
              type="button"
              variant="gold"
              size="lg"
              className="w-full"
              onClick={() => setSheetOpen(false)}
            >
              Show {items.length} result{items.length === 1 ? "" : "s"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
