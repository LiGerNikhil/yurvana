"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type {
  CatalogFacet,
  CatalogFilters,
  CatalogPriceBounds,
} from "@/lib/catalog"

type CatalogFiltersProps = {
  categories: CatalogFacet[]
  forms: CatalogFacet[]
  bounds: CatalogPriceBounds
  filters: CatalogFilters
  lockedCategory: { slug: string; name: string } | null
  onPatch: (patch: Partial<CatalogFilters>) => void
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-text-primary uppercase">
        {title}
      </h3>
      {children}
    </div>
  )
}

function PriceRangeSlider({
  bounds,
  filters,
  onPatch,
}: {
  bounds: CatalogPriceBounds
  filters: CatalogFilters
  onPatch: (patch: Partial<CatalogFilters>) => void
}) {
  const { min, max } = bounds
  const lower = min ?? 0
  const upper = max ?? 0
  const hasBounds = lower < upper

  const low = filters.minPrice ?? lower
  const high = filters.maxPrice ?? upper
  const span = hasBounds ? upper - lower : 1
  const lowPct = hasBounds ? ((low - lower) / span) * 100 : 0
  const highPct = hasBounds ? ((high - lower) / span) * 100 : 100

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-5">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: `${lowPct}%`,
            width: `${Math.max(0, highPct - lowPct)}%`,
          }}
        />
        <input
          type="range"
          min={lower}
          max={upper}
          step={1}
          value={filters.minPrice ?? lower}
          aria-label="Minimum price"
          onChange={(event) => onPatch({ minPrice: Number(event.target.value) })}
          className="pointer-events-none absolute inset-0 size-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-surface"
        />
        <input
          type="range"
          min={lower}
          max={upper}
          step={1}
          value={filters.maxPrice ?? upper}
          aria-label="Maximum price"
          onChange={(event) => onPatch({ maxPrice: Number(event.target.value) })}
          className="pointer-events-none absolute inset-0 size-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-surface"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          min={lower}
          max={upper}
          value={filters.minPrice ?? ""}
          placeholder="Min ₹"
          aria-label="Minimum price value"
          onChange={(event) => {
            const value = event.target.value
            onPatch({ minPrice: value === "" ? null : Number(value) })
          }}
          className="h-8 rounded-lg border-border text-sm"
        />
        <Input
          type="number"
          min={lower}
          max={upper}
          value={filters.maxPrice ?? ""}
          placeholder="Max ₹"
          aria-label="Maximum price value"
          onChange={(event) => {
            const value = event.target.value
            onPatch({ maxPrice: value === "" ? null : Number(value) })
          }}
          className="h-8 rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

export function CatalogFilters({
  categories,
  forms,
  bounds,
  filters,
  lockedCategory,
  onPatch,
}: CatalogFiltersProps) {
  const [draftQuery, setDraftQuery] = React.useState(filters.q)

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      if (draftQuery.trim() !== filters.q) onPatch({ q: draftQuery.trim() })
    }, 350)
    return () => window.clearTimeout(timer)
  }, [draftQuery, filters.q, onPatch])

  const toggleCategory = (item: CatalogFacet) => {
    const isActive = filters.categories.includes(item.slug ?? "")
    onPatch({
      categories: isActive
        ? filters.categories.filter((slug) => slug !== item.slug)
        : [...filters.categories, item.slug ?? ""],
    })
  }

  const toggleForm = (item: CatalogFacet) => {
    const isActive = filters.forms.includes(item.name)
    onPatch({
      forms: isActive
        ? filters.forms.filter((name) => name !== item.name)
        : [...filters.forms, item.name],
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <FilterSection title="Search">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Search material name…"
            aria-label="Search materials"
            className="h-9 rounded-lg border-border bg-surface pl-9 text-sm"
          />
        </div>
      </FilterSection>

      {lockedCategory ? (
        <FilterSection title="Category">
          <div className="flex items-center gap-2">
            <Badge variant="gold">{lockedCategory.name}</Badge>
            <Link
              href="/catalog"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Browse all
            </Link>
          </div>
        </FilterSection>
      ) : (
        <FilterSection title="Category">
          {categories.length === 0 ? (
            <p className="text-sm text-text-muted">No categories available.</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {categories.map((item) => {
                const active = filters.categories.includes(item.slug ?? "")
                return (
                  <label
                    key={item.slug}
                    className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-secondary/70"
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleCategory(item)}
                        className="size-4 shrink-0 rounded border-border accent-accent-gold"
                      />
                      <span className="text-sm text-text-primary">{item.name}</span>
                    </span>
                    {item.count > 0 ? (
                      <span className="text-xs text-text-muted tabular-nums">
                        {item.count}
                      </span>
                    ) : null}
                  </label>
                )
              })}
            </div>
          )}
        </FilterSection>
      )}

      <FilterSection title="Form type">
        {forms.length === 0 ? (
          <p className="text-sm text-text-muted">No forms available.</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {forms.map((form) => {
              const active = filters.forms.includes(form.name)
              return (
                <label
                  key={form.name}
                  className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-secondary/70"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleForm(form)}
                      className="size-4 shrink-0 accent-accent-gold"
                    />
                    <span className="text-sm text-text-primary">{form.name}</span>
                  </span>
                  {form.count > 0 ? (
                    <span className="text-xs text-text-muted tabular-nums">
                      {form.count}
                    </span>
                  ) : null}
                </label>
              )
            })}
          </div>
        )}
      </FilterSection>

      <FilterSection title="Price range">
        {bounds.min == null && bounds.max == null ? (
          <p className="text-sm text-text-muted">Prices are market-linked.</p>
        ) : (
          <PriceRangeSlider bounds={bounds} filters={filters} onPatch={onPatch} />
        )}
      </FilterSection>
    </div>
  )
}