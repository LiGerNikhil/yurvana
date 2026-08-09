import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"
import { Item } from "@/models/Item"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await context.params
  const item = await Item.findById(id).lean()
  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 })
  }
  return NextResponse.json(item)
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await request.json()
  const update: Record<string, any> = {}

  if (body.priceLow !== undefined) update.priceLow = body.priceLow
  if (body.priceHigh !== undefined) update.priceHigh = body.priceHigh
  if (body.isActive !== undefined) update.isActive = body.isActive
  if (body.isFeatured !== undefined) update.isFeatured = body.isFeatured
  if (body.name !== undefined) update.name = body.name
  if (body.slug !== undefined) update.slug = body.slug
  if (body.category !== undefined) update.category = body.category
  if (body.categoryName !== undefined) update.categoryName = body.categoryName
  if (body.form !== undefined) update.form = body.form
  if (body.unit !== undefined) update.unit = body.unit
  if (body.qualityNote !== undefined) update.qualityNote = body.qualityNote
  if (body.referenceUrl !== undefined) update.referenceUrl = body.referenceUrl
  if (body.image !== undefined) update.image = body.image

  if (body.priceLow !== undefined || body.priceHigh !== undefined) {
    update.priceUpdatedAt = new Date()
  }

  await dbConnect()
  const item = await Item.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean()
  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 })
  }
  return NextResponse.json(item)
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  await dbConnect()
  const item = await Item.findByIdAndDelete(id).lean()
  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
