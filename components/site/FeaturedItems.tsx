import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionHeading } from "./SectionHeading"
import { ItemCard, type FeaturedItem } from "./ItemCard"

export type { FeaturedItem } from "./ItemCard"

export function FeaturedItems({ items }: { items: FeaturedItem[] }) {
  if (items.length === 0) return null

  return (
    <section id="featured" className="bg-bg-alt/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Top High-Demand Herbs"
            title="Most-sourced botanicals this season"
            description="High-demand, ready-to-quote raw materials — add quantities to your RFQ in one click."
            className="max-w-xl"
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/catalog">
              View all catalog
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}