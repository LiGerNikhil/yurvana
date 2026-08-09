import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-primary-dark py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_90%_0%,rgba(201,162,75,0.25),transparent_55%)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-[#fbf7f0] sm:text-4xl">
          Need a custom quote for bulk sourcing?
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#fbf7f0]/70">
          Tell us the material, grade and quantity. Our sourcing desk will
          respond with a verified price and lead time.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" variant="gold" className="h-12 px-7 text-base">
            <Link href="/rfq">
              Request a Quote
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-[#fbf7f0]/25 bg-transparent px-7 text-base text-[#fbf7f0] hover:bg-[#fbf7f0]/10"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}