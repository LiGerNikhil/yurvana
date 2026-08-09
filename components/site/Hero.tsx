"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Leaf, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-base">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_130%_at_80%_-10%,rgba(201,162,75,0.18),transparent_55%),radial-gradient(90%_110%_at_5%_105%,rgba(47,79,58,0.18),transparent_60%)]"
      />
      <LeafFloating
        className="top-16 -left-6 size-40 rotate-12 text-primary"
        opacity="opacity-[0.07]"
      />
      <LeafFloating
        className="top-10 right-[-3rem] size-56 -rotate-12 text-accent-gold"
        opacity="opacity-[0.1]"
      />
      <SproutFloating
        className="bottom-6 left-1/4 size-24 rotate-6 text-primary-dark"
        opacity="opacity-[0.07]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-24 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-primary uppercase"
        >
          <Sprout className="size-3.5 text-accent-gold" />
          Ayurvedic &amp; Herbal Raw Material Supplier
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-6 max-w-3xl font-heading text-[2.1rem] leading-[1.1] font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
        >
          Certified botanicals in bulk, straight from&nbsp;
          <span className="text-primary">India&apos;s</span>{" "}
          <span className="text-accent-terracotta">source</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg"
        >
          Bulk supply of certified Ayurvedic herbs, seeds, oils, extracts and
          natural ingredients for formulators, contract manufacturers and
          exporters — verified botanicals, COA-backed sourcing, pan-India
          logistics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease: "easeOut" }}
          className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
        >
          <Button asChild size="lg" className="h-12 px-7 text-base">
            <Link href="/catalog">
              Browse Catalog
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="gold" size="lg" className="h-12 px-7 text-base">
            <Link href="/rfq">Request a Quote</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-text-muted uppercase"
        >
          <span>Herbs</span>
          <span className="size-1 rounded-full bg-accent-gold" />
          <span>Seeds</span>
          <span className="size-1 rounded-full bg-accent-gold" />
          <span>Oils</span>
          <span className="size-1 rounded-full bg-accent-gold" />
          <span>Extracts</span>
          <span className="size-1 rounded-full bg-accent-gold" />
          <span>Superfoods</span>
        </motion.div>
      </div>
    </section>
  )
}

function LeafFloating({
  className,
  opacity,
}: {
  className: string
  opacity: string
}) {
  return (
    <Leaf
      aria-hidden
      className={`pointer-events-none absolute select-none ${className} ${opacity}`}
      strokeWidth={1}
    />
  )
}

function SproutFloating({
  className,
  opacity,
}: {
  className: string
  opacity: string
}) {
  return (
    <Sprout
      aria-hidden
      className={`pointer-events-none absolute select-none ${className} ${opacity}`}
      strokeWidth={1}
    />
  )
}