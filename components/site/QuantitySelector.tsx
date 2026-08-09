"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9999,
  className,
}: QuantitySelectorProps) {
  const clamp = (next: number) =>
    Math.min(max, Math.max(min, Number.isFinite(next) ? next : min))

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-surface",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Decrease quantity"
        onClick={() => onChange(clamp(value - 1))}
      >
        <Minus />
      </Button>
      <span
        aria-live="polite"
        className="min-w-10 text-center font-heading text-sm font-semibold text-text-primary"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Increase quantity"
        onClick={() => onChange(clamp(value + 1))}
      >
        <Plus />
      </Button>
    </div>
  )
}
