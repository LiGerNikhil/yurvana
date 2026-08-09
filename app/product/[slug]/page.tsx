import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, ExternalLink, Leaf } from "lucide-react";

import { dbConnect } from "@/lib/db";
import { formatPriceRange, slugify, timeAgo } from "@/lib/utils";
import { Item } from "@/models/Item";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { AddToRfqWithQuantity } from "@/components/site/AddToRfqWithQuantity";
import { ItemCard, type FeaturedItem } from "@/components/site/ItemCard";

type ProductParams = { slug: string };

export const dynamic = "force-dynamic";

type ProductDoc = {
  name: string;
  slug: string;
  categoryName: string | null;
  form: string | null;
  unit: string | null;
  priceLow: number | null;
  priceHigh: number | null;
  priceUpdatedAt: Date | string | null;
  qualityNote: string | null;
  referenceUrl: string | null;
  image: string | null;
  category: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await dbConnect();
    const doc = await Item.findOne({ slug, isActive: true })
      .lean<ProductDoc>();
    if (!doc) {
      return { title: "Material not found | YURVANA AGRO" };
    }
    const description =
      doc.qualityNote?.trim() ||
      `${doc.name} — ${doc.categoryName ?? "Ayurvedic raw material"} available for bulk procurement. Prices are indicative and market-linked.`;
    return {
      title: `${doc.name} | YURVANA AGRO`,
      description,
      keywords: [
        doc.name,
        doc.categoryName,
        doc.form,
        "ayurvedic",
        "herbal raw material",
        "bulk sourcing",
      ]
        .filter(Boolean)
        .join(", "),
    };
  } catch (error) {
    console.error("[product] generateMetadata failed:", error);
    return { title: "Material | YURVANA AGRO" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<ProductParams>;
}) {
  const { slug } = await params;

  let item: ProductDoc | null = null;
  let related: FeaturedItem[] = [];

  try {
    await dbConnect();
    item = await Item.findOne({ slug, isActive: true }).lean<ProductDoc>();
    if (!item) notFound();

    const relatedDocs = await Item.find({
      category: item.category,
      slug: { $ne: item.slug },
      isActive: true,
    })
      .sort({ sr: 1 })
      .limit(4)
      .lean<ProductDoc[]>();

    related = relatedDocs.map((doc) => ({
      slug: doc.slug,
      name: doc.name,
      categoryName: doc.categoryName ?? "",
      form: doc.form ?? "",
      unit: doc.unit ?? "kg",
      priceLow: doc.priceLow ?? null,
      priceHigh: doc.priceHigh ?? null,
    }));
  } catch (error) {
    console.error(`[product/${slug}] Failed to load data:`, error);
    if (!item) notFound();
  }

  const categorySlug = item.categoryName ? slugify(item.categoryName) : null;

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted"
        >
          <Link
            href="/catalog"
            className="transition-colors hover:text-primary"
          >
            Catalog
          </Link>
          <span aria-hidden="true">/</span>
          {categorySlug ? (
            <>
              <Link
                href={`/catalog/${categorySlug}`}
                className="transition-colors hover:text-primary"
              >
                {item.categoryName}
              </Link>
              <span aria-hidden="true">/</span>
            </>
          ) : null}
          <span className="truncate font-medium text-text-primary">
            {item.name}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
          {/* Image / illustration block */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-alt">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-10 text-center">
                <span className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Leaf className="size-10" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {item.categoryName || "Ayurvedic material"}
                </span>
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Badge variant="gold">{item.categoryName || "General"}</Badge>
              {item.form ? (
                <span className="text-sm text-text-muted">
                  Form: <span className="text-text-primary">{item.form}</span>
                </span>
              ) : null}
              <span className="text-sm text-text-muted">
                Unit: <span className="text-text-primary">{item.unit}</span>
              </span>
            </div>

            <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {item.name}
            </h1>

            <div className="flex flex-col gap-1">
              <p className="font-heading text-3xl font-semibold text-accent-terracotta">
                {formatPriceRange(item.priceLow, item.priceHigh)}
                <span className="ml-1 text-base font-normal text-text-muted">
                  / {item.unit}
                </span>
              </p>
              <p className="flex items-center gap-1.5 text-xs text-text-muted">
                <CalendarClock className="size-3.5" aria-hidden="true" />
                Price last updated {timeAgo(item.priceUpdatedAt)}
              </p>
            </div>

            <AddToRfqWithQuantity
              slug={item.slug}
              name={item.name}
              unit={item.unit ?? "kg"}
            />

            {/* {item.referenceUrl ? (
              <p className="text-sm text-text-muted">
                Market reference:{" "}
                <a
                  href={item.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:text-primary-dark hover:underline"
                >
                  {new URL(item.referenceUrl).hostname}
                  <ExternalLink className="size-3.5" aria-hidden="true" />?
                </a>
              </p>
            ) : null} */}

            {item.qualityNote ? (
              <div className="mt-1 flex flex-col gap-2 rounded-2xl border-l-4 border-accent-gold bg-alt/70 p-5">
                <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Quality &amp; Buying Note
                </h2>
                <p className="text-sm leading-relaxed text-text-primary">
                  {item.qualityNote}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16" aria-label="Related items">
            <SectionHeading
              align="left"
              eyebrow="Related Materials"
              title={`More from ${item.categoryName ?? "this category"}`}
            />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((relatedItem) => (
                <ItemCard key={relatedItem.slug} item={relatedItem} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-16 text-center">
          <Button asChild variant="outline">
            <Link href="/catalog">Browse all materials</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
