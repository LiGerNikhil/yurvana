"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  align?: "center" | "left"
  as?: "h1" | "h2" | "h3"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Comp = as

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
          {eyebrow}
        </p>
      ) : null}
      <Comp className="font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </Comp>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-text-muted">{description}</p>
      ) : null}
    </motion.div>
  )
}