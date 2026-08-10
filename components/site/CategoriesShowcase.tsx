"use client"

import Link from "next/link"
import Image from "next/image"
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

const CATEGORY_IMAGES: Record<string, string> = {
  "premium-herbs":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpItxvuf4W4Kz5LZjETQSI9GP5YP6wZC2MGlSCXnk6Eg&s=10",
  seeds: "https://www.grocery.coop/wp-content/uploads/2015/12/The_Benefits_of_Seeds_0.jpg",
  "fruits-dry-materials":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrzdJ97A-4txkPzLKRX7JwtUQhQTXL-kyS7phVRJimhwhrJ1RooGAkgPTG&s=10",
  leaves:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt2ah3NMq_DeaL6XMunyGdzO_sPsX3LsngUXbeniImCfRUKjJgXEqZf-YO&s=10",
  flowers:
    "https://images.unsplash.com/photo-1685613858397-64f79a0f3603?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9tYW50aWMlMjBmbG93ZXJzfGVufDB8fDB8fHww",
  oils: "https://amscardiology.com/wp-content/uploads/2021/09/healthiest-cooking-oils.jpg",
  "natural-ingredients":
    "https://www.savvyandshine.com/cdn/shop/articles/top-view-natural-cosmetics-table_596e7e7c-f487-4943-a4f8-da94609c8115.jpg?v=1737273287",
  "herbal-extracts":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQf5slGlrRInC6ID-QhEfV4gTHFxt72m6OVJBWMTOi1PVY_D9JU2EfhLts&s=10",
  superfoods:
    "https://domf5oio6qrcr.cloudfront.net/medialibrary/9545/conversions/healthy-superfoods-thumb.jpg",
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
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? Leaf
            const image = CATEGORY_IMAGES[category.slug]
            return (
              <motion.div key={category.slug} variants={item}>
                <Link
                  href={`/catalog/${category.slug}`}
                  aria-label={`Browse ${category.name} raw materials`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/60 hover:shadow-[0_14px_36px_-16px_rgba(47,79,58,0.35)] sm:aspect-[4/3]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={category.name}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-primary/10">
                      <Icon className="size-8 text-primary" />
                    </span>
                  )}

                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/25 to-primary-dark/5 transition-opacity duration-300 group-hover:from-primary-dark/90" />

                  <span className="absolute inset-x-0 bottom-0 flex items-start gap-2.5 p-3 sm:gap-3 sm:p-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-gold text-primary-dark transition-transform duration-300 group-hover:scale-105 sm:size-10">
                      <Icon className="size-4 sm:size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-sm leading-snug font-semibold text-white sm:text-base">
                        {category.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-white/75 sm:text-xs">
                        {category.count} raw material{category.count === 1 ? "" : "s"}
                      </span>
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
