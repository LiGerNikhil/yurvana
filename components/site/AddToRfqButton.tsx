"use client"

import * as React from "react"
import { Check, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRfqCart } from "./rfq-cart"
import { useToast } from "./toast"

type AddToRfqButtonProps = {
  slug: string
  name: string
  unit?: string
  className?: string
}

export function AddToRfqButton({
  slug,
  name,
  unit = "kg",
  className,
}: AddToRfqButtonProps) {
  const { add } = useRfqCart()
  const { toast } = useToast()
  const [added, setAdded] = React.useState(false)

  React.useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1600)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <Button
      type="button"
      size="sm"
      variant={added ? "default" : "gold"}
      className={cn("w-full", className)}
      onClick={() => {
        add(slug, name, unit)
        setAdded(true)
        toast(`“${name}” added to RFQ cart`)
      }}
    >
      {added ? (
        <>
          <Check data-icon="inline-start" /> Added to RFQ
        </>
      ) : (
        <>
          <Plus data-icon="inline-start" /> Add to RFQ
        </>
      )}
    </Button>
  )
}