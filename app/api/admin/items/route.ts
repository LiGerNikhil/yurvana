import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"
import { Item } from "@/models/Item"
import { Category } from "@/models/Category"

export async function GET(request: Request) {
  await dbConnect()

  const url = new URL(request.url)
  const search = url.searchParams.get("search")?.trim() || ""
  const category = url.searchParams.get("category") || ""
  const sortBy = url.searchParams.get("sortBy") || "updatedAt"
  const sortDir = url.searchParams.get("sortDir") === "asc" ? 1 : -1

  const query: Record<string, any> = {}
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { categoryName: { $regex: search, $options: "i" } },
    ]
  }
  if (category) {
    query.category = category
  }

  const items = await Item.find(query)
    .sort({ [sortBy]: sortDir })
    .lean()

  const categories = await Category.find({}).sort({ sortOrder: 1 }).lean()

  return NextResponse.json({ items, categories })
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    name,
    slug,
    category,
    categoryName,
    form,
    unit,
    priceLow,
    priceHigh,
    qualityNote,
    referenceUrl,
    image,
    isFeatured,
    isActive,
  } = body

  await dbConnect()

  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required." }, { status: 400 })
  }

  const existing = await Item.findOne({ slug }).lean()
  if (existing) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 400 })
  }

  const item = await Item.create({
    sr: body.sr || 0,
    name,
    slug,
    category: category || null,
    categoryName: categoryName || "",
    form: form || "",
    unit: unit || "kg",
    priceLow: priceLow ?? null,
    priceHigh: priceHigh ?? null,
    qualityNote: qualityNote || "",
    referenceUrl: referenceUrl || "",
    image: image || "",
    priceUpdatedAt: new Date(),
    isFeatured: Boolean(isFeatured),
    isActive: Boolean(isActive),
  })

  return NextResponse.json(item)
}
