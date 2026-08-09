"use client"

import * as React from "react"
import { Check, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRfqCart } from "./rfq-cart"
import { useToast } from "./toast"
import { QuantitySelector } from "./QuantitySelector"

type AddToRfqWithQuantityProps = {
  slug: string
  name: string
  unit: string
}

export function AddToRfqWithQuantity({
  slug,
  name,
  unit,
}: AddToRfqWithQuantityProps) {
  const { add } = useRfqCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = React.useState(1)
  const [added, setAdded] = React.useState(false)

  React.useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1600)
    return () => window.clearTimeout(timer)
  }, [added])

  const handleAdd = () => {
    add(slug, name, unit, quantity)
    setAdded(true)
    toast(
      quantity > 1
        ? `${quantity} × “${name}” added to RFQ cart`
        : `“${name}” added to RFQ cart`
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-muted">Quantity</span>
        <QuantitySelector value={quantity} onChange={setQuantity} />
      </div>
      <Button
        type="button"
        size="lg"
        variant={added ? "default" : "gold"}
        className="w-full sm:w-auto sm:min-w-52"
        onClick={handleAdd}
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
    </div>
  )
}
