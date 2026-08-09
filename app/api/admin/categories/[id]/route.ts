import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"
import { Category } from "@/models/Category"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  await dbConnect()

  const category = await Category.findById(id).lean()
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 })
  }

  return NextResponse.json(category)
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await request.json()
  const update: Record<string, any> = {}
  if (body.name !== undefined) update.name = body.name
  if (body.slug !== undefined) update.slug = body.slug
  if (body.description !== undefined) update.description = body.description
  if (body.image !== undefined) update.image = body.image
  if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder)
  if (body.isActive !== undefined) update.isActive = body.isActive

  await dbConnect()
  const category = await Category.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean()

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 })
  }
  return NextResponse.json(category)
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  await dbConnect()
  const category = await Category.findByIdAndDelete(id).lean()
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
