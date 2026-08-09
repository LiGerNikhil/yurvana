"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useRfqCart } from "./rfq-cart";

const NAV_LINKS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "/sourcing-standards", label: "Sourcing Standards" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/login", label: "Admin Login" },
];

function Wordmark() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-primary-dark">
        <Leaf className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[15px] font-semibold tracking-wide text-text-primary">
          YURVANA <span className="text-accent-gold">AGRO</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-text-muted uppercase">
          Raw Material Sourcing
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { count } = useRfqCart();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary",
                  active && "bg-secondary text-text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="default"
            className="relative h-9 px-3"
            aria-label={`RFQ cart with ${count} item${count === 1 ? "" : "s"}`}
          >
            <Link href="/rfq">
              <ShoppingCart data-icon="inline-start" />
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-gold px-1 text-[11px] font-semibold text-primary-dark">
                  {count}
                </span>
              ) : null}
              <span className="sr-only">Open RFQ cart</span>
            </Link>
          </Button>

          <span className="hidden text-sm font-medium text-text-muted sm:inline">
            RFQ
          </span>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-2" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-secondary hover:text-text-primary",
                      (pathname === link.href ||
                        pathname.startsWith(`${link.href}/`)) &&
                        "bg-secondary text-text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/rfq"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm font-medium text-text-primary"
                >
                  RFQ Cart
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent-gold text-[11px] font-semibold text-primary-dark">
                    {count}
                  </span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
