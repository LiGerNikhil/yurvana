import type { Metadata } from "next";

import { dbConnect } from "@/lib/db";
import {
  buildCatalogQuery,
  parseCatalogFilters,
  type CatalogFacet,
  type CatalogItem,
} from "@/lib/catalog";
import { Category } from "@/models/Category";
import { Item } from "@/models/Item";

import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogViewer } from "@/components/site/catalog/CatalogViewer";

export const metadata: Metadata = {
  title: "Catalog | YURVANA AGRO",
  description:
    "Browse and filter the full YURVANA AGRO catalog of certified herbs, seeds, oils, extracts and natural ingredients. Add directly to your RFQ.",
};

type CatalogSearchParams = {
  category?: string | string[];
  form?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  q?: string | string[];
  view?: string | string[];
};

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseCatalogFilters(params);

  let categories: { slug: string; name: string; count: number }[] = [];
  let forms: CatalogFacet[] = [];
  let bounds = { min: null, max: null } as {
    min: number | null;
    max: number | null;
  };
  let items: CatalogItem[] = [];

  try {
    await dbConnect();

    const [categoryDocs, grouped, formAgg, boundsAgg] = await Promise.all([
      Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
      Item.aggregate<{ _id: string; count: number }>([
        { $match: { isActive: true } },
        { $group: { _id: "$categoryName", count: { $sum: 1 } } },
      ]),
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
    ]);

    const countsByCategory = new Map(grouped.map((g) => [g._id, g.count]));
    const bySlug = new Map(categoryDocs.map((c) => [c.slug, c.name]));

    categories = categoryDocs.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: countsByCategory.get(c.name) ?? 0,
    }));

    forms = formAgg.map((f) => ({ name: f._id, count: f.count }));

    const first = boundsAgg[0];
    bounds = { min: first?.min ?? null, max: first?.max ?? null };

    const categoryNames = filters.categories
      .map((slug) => bySlug.get(slug))
      .filter((name): name is string => Boolean(name));

    const itemDocuments = await Item.find(
      buildCatalogQuery({ ...filters, categories: categoryNames }),
    )
      .sort({ sr: 1 })
      .lean();

    items = itemDocuments.map((item) => ({
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
    console.error("[catalog] Failed to load data:", error);
  }

  const activeCount =
    filters.categories.length +
    filters.forms.length +
    (filters.minPrice != null || filters.maxPrice != null ? 1 : 0) +
    (filters.q ? 1 : 0);

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Raw Material Catalog"
          title="Browse all materials"
          description={
            activeCount > 0
              ? `Showing ${items.length} material${items.length === 1 ? "" : "s"} matching your filters.`
              : "Botanically verified and COA-backed raw materials for manufacturers, traders and formulators. Filter by category, form or price — or search by name."
          }
        />
      </div>

      <div className="mt-10">
        <CatalogViewer
          categories={categories}
          forms={forms}
          bounds={bounds}
          filters={filters}
          items={items}
          total={items.length}
          lockedCategory={null}
        />
      </div>
    </main>
  );
}
