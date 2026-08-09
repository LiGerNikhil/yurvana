import { loadEnvFile } from "node:process";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { dbConnect } from "../lib/db";
import { Category } from "../models/Category";
import { Item } from "../models/Item";
import { slugify } from "../lib/utils";

try {
  loadEnvFile(path.resolve(process.cwd(), ".env"));
} catch (error) {
  console.warn("[seed] Could not load .env:", (error as Error).message);
}

type SeedItem = {
  srNo: number;
  category: string;
  name: string;
  slug: string;
  form?: string;
  unit?: string;
  priceLow?: number;
  priceHigh?: number;
  qualityNote?: string;
  referenceSource?: string;
};

const FEATURED_NAMES = [
  "Ashwagandha",
  "Safed Musli",
  "Shilajit",
  "Giloy",
  "Tulsi",
  "Brahmi",
  "Shatavari",
  "Gokhru",
  "Amla",
  "Moringa",
  "Aloe Vera",
  "Neem",
  "Arjun Chhal",
  "Mulethi",
  "Guggul",
  "Kalmegh",
  "Punarnava",
  "Isabgol",
  "Pippali",
  "Haldi",
];

async function main() {
  const mongoose = await dbConnect();

  const raw = await readFile(
    path.resolve(process.cwd(), "yurvana_seed_items.json"),
    "utf8"
  );
  const seedRows = JSON.parse(raw) as SeedItem[];
  if (!Array.isArray(seedRows)) {
    throw new Error("yurvana_seed_items.json must contain a JSON array of items");
  }

  // 1. Derive categories in first-appearance order and upsert them.
  const categoryNames = seedRows.reduce<string[]>((acc, item) => {
    if (!acc.includes(item.category)) {
      acc.push(item.category);
    }
    return acc;
  }, []);

  await Category.bulkWrite(
    categoryNames.map((name, i) => ({
      updateOne: {
        filter: { slug: slugify(name) },
        update: {
          $setOnInsert: {
            name,
            slug: slugify(name),
            sortOrder: i,
            isActive: true,
          },
        },
        upsert: true,
      },
    }))
  );

  const categories = await Category.find({});
  const categoryIdBySlug = new Map<string, typeof categories[number]["_id"]>();
  for (const cat of categories) {
    categoryIdBySlug.set(cat.slug, cat._id);
  }
  const unmatchedCategories = new Set<string>();

  // 2. Insert all items, linking each to its category by slug match.
  const seenSlugs = new Set<string>();
  const slugRenames: string[] = [];

  const itemOps = seedRows.map((item) => {
    let slug = slugify(item.slug || item.name);
    if (seenSlugs.has(slug)) {
      let n = 2;
      while (seenSlugs.has(`${slug}-${n}`)) n++;
      slugRenames.push(`${slug} -> ${slug}-${n}`);
      slug = `${slug}-${n}`;
    }
    seenSlugs.add(slug);

    const categorySlug = slugify(item.category);
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      unmatchedCategories.add(item.category);
    }

    return {
      updateOne: {
        filter: { slug },
        update: {
          $set: {
            sr: item.srNo,
            name: item.name,
            slug,
            category: categoryId ?? null,
            categoryName: item.category,
            form: item.form ?? "",
            unit: item.unit ?? "kg",
            priceLow: item.priceLow ?? null,
            priceHigh: item.priceHigh ?? null,
            qualityNote: item.qualityNote ?? "",
            referenceUrl: item.referenceSource ?? "",
            isActive: true,
            priceUpdatedAt: new Date(),
          },
          $setOnInsert: {
            isFeatured: false,
          },
        },
        upsert: true,
      },
    };
  });

  await Item.bulkWrite(itemOps);

  // 3. Mark the 20 featured items (exact name first, then closest match).
  const allItems = await Item.find({});

  const findItems = (name: string) => {
    const lower = name.toLowerCase();
    const exact = allItems.filter((i) => i.name.toLowerCase() === lower);
    if (exact.length > 0) return exact;
    const includes = allItems.filter((i) =>
      i.name.toLowerCase().includes(lower)
    );
    if (includes.length > 0) {
      return [includes.sort((a, b) => a.name.length - b.name.length)[0]];
    }
    return [];
  };

  const featuredMarked: string[] = [];
  const featuredMissing: string[] = [];

  for (const name of FEATURED_NAMES) {
    const matched = findItems(name);
    if (matched.length === 0) {
      featuredMissing.push(name);
      continue;
    }
    await Item.updateMany(
      { _id: { $in: matched.map((i) => i._id) } },
      { $set: { isFeatured: true } }
    );
    for (const m of matched) {
      featuredMarked.push(m.name);
    }
  }

  // 3. Log a summary.
  const categoryCount = await Category.countDocuments();
  const itemCount = await Item.countDocuments();
  const featuredCount = await Item.countDocuments({ isFeatured: true });

  console.log("\n=== YURVANA SEED SUMMARY ===");
  console.log(`Categories (first-appearance order):`);
  categoryNames.forEach((name, i) => console.log(`  ${i + 1}. ${name} (${slugify(name)})`));
  console.log(`\nItems in source JSON: ${seedRows.length}`);
  if (slugRenames.length > 0) {
    console.log(`Duplicate slugs renamed: ${slugRenames.join(", ")}`);
  }
  if (unmatchedCategories.size > 0) {
    console.warn(`Categories with no match: ${[...unmatchedCategories].join(", ")}`);
  }
  console.log(`\nFeatured items marked (${featuredMarked.length}): ${featuredMarked.join(", ")}`);
  if (featuredMissing.length > 0) {
    console.warn(`Featured names NOT found (skipped): ${featuredMissing.join(", ")}`);
  }
  console.log(
    `\nDB totals -> categories: ${categoryCount}, items: ${itemCount}, featured: ${featuredCount}`
  );

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("[seed] FAILED:", error);
  process.exit(1);
});