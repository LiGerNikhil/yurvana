import { escapeRegExp } from "@/lib/utils";

export type CatalogView = "grid" | "table";

export type CatalogFilters = {
  categories: string[];
  forms: string[];
  minPrice: number | null;
  maxPrice: number | null;
  q: string;
  view: CatalogView;
};

export type CatalogItem = {
  sr: number;
  slug: string;
  name: string;
  categoryName: string;
  form: string;
  unit: string;
  priceLow: number | null;
  priceHigh: number | null;
  priceUpdatedAt: string | null;
};

export type CatalogFacet = {
  slug?: string;
  name: string;
  count: number;
};

export type CatalogPriceBounds = {
  min: number | null;
  max: number | null;
};

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  categories: [],
  forms: [],
  minPrice: null,
  maxPrice: null,
  q: "",
  view: "grid",
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toList(value: string | string[] | undefined): string[] {
  return (firstParam(value) ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function toNumber(value: string | string[] | undefined): number | null {
  const parsed = Number(firstParam(value));
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseCatalogFilters(
  params: Record<string, string | string[] | undefined>
): CatalogFilters {
  const minPrice = toNumber(params.minPrice);
  const maxPrice = toNumber(params.maxPrice);
  const q = firstParam(params.q)?.trim() ?? "";

  return {
    categories: toList(params.category),
    forms: toList(params.form),
    minPrice: minPrice != null && minPrice >= 0 ? minPrice : null,
    maxPrice: maxPrice != null && maxPrice >= 0 ? maxPrice : null,
    q,
    view: firstParam(params.view) === "table" ? "table" : "grid",
  };
}

export function buildCatalogHref(
  filters: CatalogFilters,
  lockedCategory: string | null = null
): string {
  const base = lockedCategory ? `/catalog/${lockedCategory}` : "/catalog";
  const params = new URLSearchParams();

  if (!lockedCategory && filters.categories.length > 0) {
    params.set("category", filters.categories.join(","));
  }
  if (filters.forms.length > 0) {
    params.set("form", filters.forms.join(","));
  }
  if (filters.minPrice != null) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice != null) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.view === "table") {
    params.set("view", "table");
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function buildCatalogQuery(filters: CatalogFilters) {
  const query: Record<string, unknown> = { isActive: true };

  if (filters.categories.length > 0) {
    query.categoryName = { $in: filters.categories };
  }

  if (filters.forms.length > 0) {
    query.form = { $in: filters.forms };
  }

  const range: Record<string, unknown>[] = [];
  if (filters.minPrice != null) {
    range.push({
      $or: [{ priceHigh: { $gte: filters.minPrice } }, { priceHigh: null }],
    });
  }
  if (filters.maxPrice != null) {
    range.push({
      $or: [{ priceLow: { $lte: filters.maxPrice } }, { priceLow: null }],
    });
  }
  if (range.length > 0) {
    query.$and = range;
  }

  const trimmed = filters.q.trim();
  if (trimmed) {
    const pattern = new RegExp(escapeRegExp(trimmed), "i");
    query.$or = [
      { name: pattern },
      { categoryName: pattern },
      { form: pattern },
    ];
  }

  return query;
}

export function serializePriceRange(
  minPrice: number | null,
  maxPrice: number | null
): string {
  if (minPrice == null && maxPrice == null) return "Any";
  if (minPrice != null && maxPrice != null) return `₹${minPrice} – ₹${maxPrice}`;
  return minPrice != null
    ? `From ₹${(minPrice as number).toLocaleString("en-IN")}`
    : `Up to ₹${(maxPrice as number).toLocaleString("en-IN")}`;
}

export function countActiveFilters(filters: CatalogFilters): number {
  let count = filters.categories.length + filters.forms.length;
  if (filters.minPrice != null || filters.maxPrice != null) count += 1;
  if (filters.q) count += 1;
  return count;
}