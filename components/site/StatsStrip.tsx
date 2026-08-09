"use client"

import { motion } from "framer-motion"
import { CheckCircle2, MapPinned } from "lucide-react"

import { StatCounter } from "./StatCounter"

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-bg-alt/60 py-12 sm:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        <StatCounter
          value={114}
          suffix="+"
          label="Raw materials sourced directly"
        />
        <StatCounter
          value={9}
          label="Specialist Sourcing Categories"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-heading text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            Pan-India
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-text-muted">
            <MapPinned className="size-4 text-accent-gold" />
            Origin + Sourcing Network
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-heading text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            100%
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-text-muted">
            <CheckCircle2 className="size-4 text-accent-gold" />
            Quality-Verified Batches
          </p>
        </motion.div>
      </div>
    </section>
  )
}