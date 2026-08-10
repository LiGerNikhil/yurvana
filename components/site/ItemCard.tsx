"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { getItemImage } from "@/lib/item-images"
import { AddToRfqButton } from "./AddToRfqButton"

export type FeaturedItem = {
  slug: string
  name: string
  categoryName: string
  form: string
  unit: string
  priceLow: number | null
  priceHigh: number | null
}

function formatPrice(low: number | null, high: number | null) {
  if (low == null && high == null) return "Market-linked"
  if (low != null && high != null) {
    return `₹${low.toLocaleString("en-IN")} – ₹${high.toLocaleString("en-IN")}`
  }
  const single = low ?? high
  return `₹${single?.toLocaleString("en-IN")}`
}

export function ItemCard({ item }: { item: FeaturedItem }) {
  const image = getItemImage(item.slug)
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent-gold/60"
    >
      {image ? (
        <Link
          href={`/product/${item.slug}`}
          aria-label={item.name}
          className="relative mb-4 block aspect-[4/3] overflow-hidden rounded-xl bg-alt"
        >
          <Image
            src={image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <Link href={`/product/${item.slug}`} className="min-w-0">
          <h3 className="font-heading text-lg leading-snug font-semibold text-text-primary transition-colors group-hover:text-primary">
            {item.name}
          </h3>
          <p className="mt-1 truncate text-xs text-text-muted">
            {item.categoryName}
            {item.form ? ` · ${item.form}` : ""}
          </p>
        </Link>
        <Badge variant="gold" className="shrink-0">
          {item.unit}
        </Badge>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-heading text-base font-semibold text-accent-terracotta">
          {formatPrice(item.priceLow, item.priceHigh)}
        </span>
        <span className="text-xs text-text-muted">/ {item.unit}</span>
      </div>

      <div className="mt-auto pt-5">
        <AddToRfqButton slug={item.slug} name={item.name} unit={item.unit} />
      </div>
    </motion.article>
  )
}