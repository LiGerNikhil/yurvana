import type { Metadata } from "next";

import { dbConnect } from "@/lib/db";
import { Category } from "@/models/Category";
import { Item } from "@/models/Item";

import { Hero } from "@/components/site/Hero";
import { StatsStrip } from "@/components/site/StatsStrip";
import {
  CategoriesShowcase,
  type CategoryCard,
} from "@/components/site/CategoriesShowcase";
import { FeaturedItems, type FeaturedItem } from "@/components/site/FeaturedItems";
import { QualityYurvana } from "@/components/site/QualityYurvana";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = {
  title: "YURVANA AGRO | Certified Ayurvedic & Herbal Raw Materials",
  description:
    "Bulk sourcing of certified Ayurvedic herbs, seeds, oils, extracts and natural ingredients — botanically verified, COA-backed, pan-India logistics.",
};

async function loadHomepageData() {
  try {
    await dbConnect();

    const [categories, grouped, featured] = await Promise.all([
      Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
      Item.aggregate<{ _id: string; count: number }>([
        { $match: { isActive: true } },
        { $group: { _id: "$categoryName", count: { $sum: 1 } } },
      ]),
      Item.find({ isActive: true, isFeatured: true })
        .sort({ name: 1 })
        .limit(12)
        .lean(),
    ]);

    const counts = new Map(grouped.map((group) => [group._id, group.count]));

    const categoryCards: CategoryCard[] = categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      count: counts.get(category.name) ?? 0,
    }));

    const featuredItems: FeaturedItem[] = featured.map((item) => ({
      slug: item.slug,
      name: item.name,
      categoryName: item.categoryName ?? "",
      form: item.form ?? "",
      unit: item.unit ?? "kg",
      priceLow: item.priceLow ?? null,
      priceHigh: item.priceHigh ?? null,
    }));

    return { categoryCards, featuredItems };
  } catch (error) {
    console.error("[homepage] Failed to load catalog data:", error);
    return { categoryCards: [], featuredItems: [] };
  }
}

export default async function HomePage() {
  const { categoryCards, featuredItems } = await loadHomepageData();

  return (
    <>
      <Hero />
      <StatsStrip />
      <CategoriesShowcase categories={categoryCards} />
      <FeaturedItems items={featuredItems} />
      <QualityYurvana />
      <CtaBand />
    </>
  );
}