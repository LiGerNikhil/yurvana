import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Flower, Shield, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Sourcing Standards | YURVANA AGRO",
  description:
    "YURVANA AGRO sourcing standards cover botanical identity, COA-backed quality, adulteration screening and logistics for bulk herbal raw materials.",
};

const standardCards = [
  {
    icon: Flower,
    title: "Botanical identity verification",
    body: "Every herb, seed and extract is evaluated for correct species, form and provenance before it reaches our catalog.",
  },
  {
    icon: Shield,
    title: "COA & laboratory testing",
    body: "Material is backed by certificates of analysis, microbial screening and chemical profiling for business buyers.",
  },
  {
    icon: CheckCircle2,
    title: "Adulteration & purity checks",
    body: "We review each lot for authenticity, contamination and quality claims before recommending it to customers.",
  },
  {
    icon: Truck,
    title: "Bulk packaging & logistics",
    body: "Orders are prepared for safe transit with buyer-ready packing, documentation and handling guidance.",
  },
];

export default function SourcingStandardsPage() {
  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-sm sm:p-10 lg:p-14">
          <SectionHeading
            align="left"
            eyebrow="Sourcing standards"
            title="Quality principles for botanical sourcing and bulk supply"
          />
          <p className="mt-4 max-w-3xl text-base leading-8 text-text-muted">
            Our sourcing philosophy blends botanical expertise with practical
            quality controls. We source raw materials for buyers who need
            authentic, tested and traceable ingredients at scale.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {standardCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-3xl border border-border bg-alt p-6 shadow-sm"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-text-primary">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-text-muted">
                    {card.body}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-text-primary">
                How we maintain quality at every step
              </h2>
              <div className="space-y-5 text-sm leading-7 text-text-muted">
                <div>
                  <p className="font-semibold text-text-primary">
                    Identifying the material correctly
                  </p>
                  <p>
                    We verify species names, botanical form and sourcing origin
                    so buyers receive the exact raw material they requested.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    Certifying quality with COA
                  </p>
                  <p>
                    Certificates of analysis and test reports are used to
                    confirm moisture, ash, heavy metals, pesticide residue and
                    other quality parameters.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    Guarding against adulteration
                  </p>
                  <p>
                    We screen suppliers and lots for adulteration, substitution
                    and improper processing before the item enters our
                    catalogue.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-alt p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-text-primary">
                Packaging and logistics for bulk orders
              </h2>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                Bulk shipments are packed for safe handling and long distance
                transit. We advise on packaging, labeling and transport modes so
                your order arrives in market-ready condition.
              </p>
              <ul className="mt-6 space-y-4 text-sm text-text-muted">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    ✓
                  </span>
                  <span>
                    Industrial-grade bagging, liners and palletization for bulk
                    quantities.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    ✓
                  </span>
                  <span>
                    Documentation for customs, material declaration and
                    handling.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    ✓
                  </span>
                  <span>
                    Supply chain coordination for timely delivery across India
                    and export markets.
                  </span>
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/contact">Speak with sourcing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
