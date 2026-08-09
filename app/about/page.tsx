import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "About Us | YURVANA AGRO",
  description:
    "YURVANA AGRO sources botanically verified herbs, seeds, oils and extracts for B2B buyers with COA-backed quality and transparent supply chain standards.",
};

export default function AboutPage() {
  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                About YURVANA AGRO
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
                Trusted B2B sourcing for botanicals, oils and extracts.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
                We partner with India’s most reliable growers and processors to
                bring verified herbal raw materials to manufacturers, traders
                and exporters. Every shipment is sourced with integrity, matched
                to buyer specifications, and backed by documentation for bulk
                orders.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button asChild>
                  <Link href="/catalog">Explore catalog</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            </div>
            <div className="relative bg-primary p-10 text-white sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%)]" />
              <div className="relative space-y-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white">
                  <Leaf className="size-6" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                    Our story
                  </p>
                  <p className="text-2xl font-semibold leading-tight">
                    Built for buyers who need traceable quality, consistent
                    supply and expert sourcing support.
                  </p>
                </div>
                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/10 p-6">
                  <p className="text-sm text-white/80">
                    Since our founding, YURVANA AGRO has focused on premium
                    botanicals that meet formulation, regulatory and commercial
                    needs — without the uncertainty of informal trading.
                  </p>
                  <p className="text-sm text-white/80">
                    From farm gate to container load, we keep the buyer informed
                    and the material verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6 rounded-3xl border border-border bg-surface p-8 shadow-sm sm:p-10">
            <SectionHeading
              align="left"
              eyebrow="Mission"
              title="Deliver reliable botanical sourcing with transparent quality standards."
            />
            <p className="text-base leading-8 text-text-muted">
              We serve brands, manufacturers and bulk traders who demand
              consistent raw materials and a sourcing partner that understands
              supply chain risk, testing requirements and packaging for
              export-ready quantities.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-alt p-6">
                <p className="font-semibold text-text-primary">
                  Customer-first sourcing
                </p>
                <p className="mt-3 text-sm text-text-muted">
                  We match your material specs, order size and delivery window
                  with suppliers who can deliver quality, compliance and
                  availability.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-alt p-6">
                <p className="font-semibold text-text-primary">
                  Verified botanical identity
                </p>
                <p className="mt-3 text-sm text-text-muted">
                  Every product is reviewed for correct species, form, and
                  origin before it enters our catalog.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-border bg-alt p-8 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-primary/10 p-3 text-primary">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Why buyers trust us
                </p>
                <p className="mt-3 text-sm leading-7 text-text-muted">
                  Our focus is on transparency, documentation and partnership
                  for B2B bulk sourcing.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-border bg-surface p-5">
                <p className="font-semibold text-text-primary">
                  Deep category expertise
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  Our sourcing team works with herbs, seeds, oils and extracts
                  that require botanical knowledge, supply chain visibility and
                  testing discipline.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-surface p-5">
                <p className="font-semibold text-text-primary">
                  Scale-ready supply
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  From sample-sized evaluations to container-scale orders, we
                  structure logistics and packaging for bulk B2B movement.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-surface p-5">
                <p className="font-semibold text-text-primary">
                  Trusted documentation
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  COAs, material declarations and provenance notes are provided
                  so your quality team can review before purchase.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-primary/10 p-6">
              <div className="flex items-center gap-3 text-text-primary">
                <Sparkles className="size-5" />
                <p className="font-semibold">
                  Sourcing excellence for raw material teams.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
