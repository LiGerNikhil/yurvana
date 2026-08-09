"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  Citrus,
  Droplets,
  FlaskConical,
  Flower,
  Flower2,
  Leaf,
  Sprout,
  TestTube,
  Wheat,
  type LucideIcon,
} from "lucide-react"

import { SectionHeading } from "./SectionHeading"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "premium-herbs": Flower2,
  seeds: Sprout,
  "fruits-dry-materials": Citrus,
  leaves: Leaf,
  flowers: Flower,
  oils: Droplets,
  "natural-ingredients": FlaskConical,
  "herbal-extracts": TestTube,
  superfoods: Wheat,
}

export type CategoryCard = {
  slug: string
  name: string
  count: number
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function CategoriesShowcase({ categories }: { categories: CategoryCard[] }) {
  if (categories.length === 0) return null

  return (
    <section id="categories" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sourcing Categories"
          title="Nine curated categories of raw materials"
          description="Every commodity is botanically verified and graded at the source before it reaches your batch."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? Leaf
            return (
              <motion.div key={category.slug} variants={item}>
                <Link
                  href={`/catalog/${category.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent-gold/60 hover:shadow-[0_14px_36px_-16px_rgba(47,79,58,0.3)]"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-accent-gold group-hover:text-primary-dark">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-heading text-[15px] leading-snug font-semibold text-text-primary">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-xs text-text-muted">
                      {category.count} raw material{category.count === 1 ? "" : "s"}
                    </span>
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}