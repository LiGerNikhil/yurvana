"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRfqCart } from "./rfq-cart";

export function FloatingRfqButton() {
  const { count, lines, remove, setQuantity, clear } = useRfqCart();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  if (count === 0) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="gold"
              size="lg"
              className="pointer-events-auto max-w-[28rem] w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart />
                RFQ Cart
              </span>
              <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl">
            <SheetHeader>
              <div className="flex items-center justify-between gap-3">
                <SheetTitle>RFQ cart</SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X />
                </Button>
              </div>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              <p className="text-sm text-text-muted">
                {count} item{count === 1 ? "" : "s"} ready for quote.
              </p>
              <div className="space-y-3">
                {lines.map((line) => (
                  <div
                    key={line.slug}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-text-primary">
                          {line.name}
                        </p>
                        <p className="text-xs text-text-muted">{line.unit}</p>
                      </div>
                      <span className="rounded-full bg-accent-gold px-2 py-1 text-[11px] font-semibold text-primary-dark">
                        {line.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/rfq">
                <Button type="button" className="w-full">
                  Review RFQ
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden sm:flex fixed bottom-6 right-6 z-50 items-end">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="gold"
              size="lg"
              className="flex items-center gap-3"
              aria-label="Open RFQ cart"
            >
              <ShoppingCart />
              <span>RFQ</span>
              <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[380px]">
            <SheetHeader>
              <div className="flex items-center justify-between gap-3">
                <SheetTitle>RFQ cart</SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X />
                </Button>
              </div>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              <p className="text-sm text-text-muted">
                {count} item{count === 1 ? "" : "s"} ready for quote.
              </p>
              <div className="space-y-3">
                {lines.map((line) => (
                  <div
                    key={line.slug}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-text-primary">
                          {line.name}
                        </p>
                        <p className="text-xs text-text-muted">{line.unit}</p>
                      </div>
                      <span className="rounded-full bg-accent-gold px-2 py-1 text-[11px] font-semibold text-primary-dark">
                        {line.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/rfq">
                <Button type="button" className="w-full">
                  Review RFQ
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
