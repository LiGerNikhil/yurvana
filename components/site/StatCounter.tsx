"use client"

import * as React from "react"
import { animate, useInView, useMotionValue } from "framer-motion"

import { cn } from "@/lib/utils"

type StatCounterProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  label?: React.ReactNode
  format?: (value: number) => string
}

function defaultFormat(value: number, decimals: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  label,
  format,
  className,
  ...props
}: StatCounterProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const display = useMotionValue(0)
  const [text, setText] = React.useState(() => defaultFormat(0, decimals))

  React.useEffect(() => {
    if (!inView) return

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        display.set(latest)
        setText(format ? format(latest) : defaultFormat(latest, decimals))
      },
    })

    return () => controls.stop()
  }, [inView, value, decimals, duration, format, display])

  return (
    <div ref={ref} className={cn("text-center", className)} {...props}>
      <p className="font-heading text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
        {prefix}
        {text}
        {suffix}
      </p>
      {label ? <p className="mt-2 text-sm text-text-muted">{label}</p> : null}
    </div>
  )
}