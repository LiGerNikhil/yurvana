import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RFQ Submitted | YURVANA AGRO",
  description:
    "Your quote request has been sent to Yurvana Agro. We will follow up with pricing and availability.",
};

export default function RfqSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const rfqNumber = searchParams.id ? `#${searchParams.id}` : "your request";

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-surface p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            RFQ submitted
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Thank you for your quote request.
          </h1>
          <p className="mt-6 text-base leading-7 text-text-muted">
            We have received {rfqNumber}. Our sourcing team will contact you
            with pricing, availability, and next steps within one business day.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full bg-accent-gold px-6 py-3 text-sm font-semibold text-primary-dark transition hover:bg-accent-gold/90"
            >
              Continue browsing
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-muted"
            >
              Return home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
