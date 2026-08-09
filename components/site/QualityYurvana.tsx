"use client"

import { motion, type Variants } from "framer-motion"
import { BadgeCheck, Boxes, ClipboardCheck, Truck } from "lucide-react"

import { SectionHeading } from "./SectionHeading"

const POINTS = [
  {
    icon: BadgeCheck,
    title: "Botanical Verification",
    body: "Genus-level identification and authentication of every herb before it enters our sourcing pipeline.",
  },
  {
    icon: ClipboardCheck,
    title: "COA-Backed Sourcing",
    body: "Certificate of Analysis on request — heavy-metal, pesticide and microbial compliance data per batch.",
  },
  {
    icon: Boxes,
    title: "Bulk Fulfilment",
    body: "Quote-ready quantities for formulation runs, from pilot batches to container-scale volumes.",
  },
  {
    icon: Truck,
    title: "Pan-India Logistics",
    body: "A managed network of growers and aggregators with door-step delivery across all major regions.",
  },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function QualityYurvana() {
  return (
    <section id="why" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why YURVANA"
          title="Quality you can audit, sourcing you can trust"
          description="We work the way your compliance team expects — traceable, documented and batch-verified."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {POINTS.map((point) => {
            const Icon = point.icon
            return (
              <motion.div
                key={point.title}
                variants={item}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-terracotta">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-text-primary">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {point.body}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}