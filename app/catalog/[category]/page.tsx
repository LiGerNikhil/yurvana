import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { dbConnect } from "@/lib/db";
import {
  buildCatalogQuery,
  parseCatalogFilters,
  type CatalogItem,
} from "@/lib/catalog";
import { Category } from "@/models/Category";
import { Item } from "@/models/Item";

import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogViewer } from "@/components/site/catalog/CatalogViewer";

type CategoryParams = { category?: string | string[] };
type CategorySearchParams = {
  form?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  q?: string | string[];
  view?: string | string[];
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<CategoryParams>;
}): Promise<Metadata> {
  const { category: raw } = await params;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  try {
    await dbConnect();
    const doc = await Category.findOne({ slug, isActive: true }).lean();
    return {
      title: `${doc?.name ?? "Category"} | YURVANA AGRO`,
      description: doc?.description || undefined,
    };
  } catch (error) {
    console.error("[catalog/[category]] generateMetadata failed:", error);
    return { title: "Category | YURVANA AGRO" };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<CategoryParams>;
  searchParams: Promise<CategorySearchParams>;
}) {
  const [{ category: raw }, search] = await Promise.all([params, searchParams]);
  const slug = Array.isArray(raw) ? raw[0] : raw;
  const filters = parseCatalogFilters(search);

  let lockedCategory: { slug: string; name: string } | null = null;
  let categoryDescription: string | undefined;
  let forms: { name: string; count: number }[] = [];
  let items: CatalogItem[] = [];
  let bounds = { min: null, max: null } as {
    min: number | null;
    max: number | null;
  };

  try {
    await dbConnect();

    const category = await Category.findOne({ slug, isActive: true }).lean();
    if (!category) notFound();
    lockedCategory = { slug: category.slug, name: category.name };
    categoryDescription = category.description;

    const [formAgg, boundsAgg, itemDocs] = await Promise.all([
      Item.aggregate<{ _id: string; count: number }>([
        { $match: { isActive: true, form: { $nin: ["", null] } } },
        { $group: { _id: "$form", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Item.aggregate<{ _id: null; min: number | null; max: number | null }>([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            min: { $min: "$priceLow" },
            max: { $max: "$priceHigh" },
          },
        },
      ]),
      Item.find(buildCatalogQuery({ ...filters, categories: [category.name] }))
        .sort({ sr: 1 })
        .lean(),
    ]);

    forms = formAgg.map((f) => ({ name: f._id, count: f.count }));
    const first = boundsAgg[0];
    bounds = { min: first?.min ?? null, max: first?.max ?? null };

    items = itemDocs.map((item) => ({
      sr: item.sr,
      slug: item.slug,
      name: item.name,
      categoryName: item.categoryName ?? "",
      form: item.form ?? "",
      unit: item.unit ?? "kg",
      priceLow: item.priceLow ?? null,
      priceHigh: item.priceHigh ?? null,
      priceUpdatedAt: item.priceUpdatedAt
        ? new Date(item.priceUpdatedAt).toISOString()
        : null,
    }));
  } catch (error) {
    console.error(`[catalog/${slug ?? ""}] Failed to load data:`, error);
    if (!lockedCategory) notFound();
  }

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/catalog"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
        >
          ← Browse all categories
        </Link>
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Raw Material Catalog"
          title={lockedCategory?.name ?? ""}
          description={
            categoryDescription ||
            `${lockedCategory?.name ?? ""} raw materials available for bulk procurement. Prices are indicative and market-linked.`
          }
        />
      </div>

      <div className="mt-10">
        <CatalogViewer
          categories={[]}
          forms={forms}
          bounds={bounds}
          filters={lockedCategory ? { ...filters, categories: [] } : filters}
          items={items}
          total={items.length}
          lockedCategory={lockedCategory}
        />
      </div>
    </main>
  );
}
