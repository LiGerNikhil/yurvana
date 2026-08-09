"use client"

import Link from "next/link"
import { CalendarClock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPriceRange, timeAgo } from "@/lib/utils"
import type { CatalogItem } from "@/lib/catalog"
import { AddToRfqButton } from "../AddToRfqButton"

export function CatalogItemCard({ item }: { item: CatalogItem }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent-gold/60 hover:shadow-[0_14px_36px_-16px_rgba(47,79,58,0.3)]">
      <div className="flex flex-col gap-2">
        <Link
          href={`/product/${item.slug}`}
          className="font-heading text-lg leading-snug font-semibold text-text-primary transition-colors group-hover:text-primary"
        >
          {item.name}
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Badge variant="gold">{item.categoryName || "General"}</Badge>
          <span className="text-xs text-text-muted">
            {item.form ? `Form: ${item.form}` : "Form: N/A"}
          </span>
          <span className="text-xs text-text-muted">Unit: {item.unit}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-base font-semibold text-accent-terracotta">
            {formatPriceRange(item.priceLow, item.priceHigh)}
          </span>
          <span className="text-xs text-text-muted">/ {item.unit}</span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
          <CalendarClock className="size-3.5" />
          Price updated {timeAgo(item.priceUpdatedAt)}
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <AddToRfqButton
          slug={item.slug}
          name={item.name}
          unit={item.unit}
          className="!w-auto"
        />
        <Button asChild variant="outline" size="sm">
          <Link href={`/product/${item.slug}`}>View Details</Link>
        </Button>
      </div>
    </article>
  )
}