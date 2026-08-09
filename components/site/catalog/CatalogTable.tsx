"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPriceRange } from "@/lib/utils"
import type { CatalogItem } from "@/lib/catalog"
import { useRfqCart } from "../rfq-cart"
import { useToast } from "../toast"

export function CatalogTable({ items }: { items: CatalogItem[] }) {
  const { add } = useRfqCart()
  const { toast } = useToast()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-14 text-text-muted">Sr&nbsp;No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Form</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Price Range</TableHead>
          <TableHead className="w-16 text-center">
            <span className="sr-only">Add to RFQ</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.slug}>
            <TableCell className="text-center text-text-muted">{item.sr}</TableCell>
            <TableCell className="min-w-40">
              <Link
                href={`/product/${item.slug}`}
                className="font-medium text-text-primary underline-offset-4 hover:text-primary hover:underline"
              >
                {item.name}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{item.categoryName || "General"}</Badge>
            </TableCell>
            <TableCell className="text-text-muted">{item.form || "—"}</TableCell>
            <TableCell className="text-text-muted">{item.unit}</TableCell>
            <TableCell className="whitespace-nowrap font-medium text-text-primary">
              {formatPriceRange(item.priceLow, item.priceHigh)}
            </TableCell>
            <TableCell className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="border border-border bg-surface hover:border-accent-gold/60 hover:text-primary"
                aria-label={`Add ${item.name} to RFQ`}
                onClick={() => {
                  add(item.slug, item.name, item.unit)
                  toast(`“${item.name}” added to RFQ cart`)
                }}
              >
                <Plus />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}