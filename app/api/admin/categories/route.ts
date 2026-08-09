import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"
import { Category } from "@/models/Category"

export async function GET() {
  await dbConnect()
  const categories = await Category.find({}).sort({ sortOrder: 1 }).lean()
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, slug, description, image, sortOrder, isActive } = body
  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required." }, { status: 400 })
  }

  await dbConnect()
  const existing = await Category.findOne({ slug }).lean()
  if (existing) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 400 })
  }

  const category = await Category.create({
    name,
    slug,
    description: description || "",
    image: image || "",
    sortOrder: Number(sortOrder) || 0,
    isActive: Boolean(isActive),
  })

  return NextResponse.json(category)
}
