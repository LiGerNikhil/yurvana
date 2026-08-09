import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"
import { Item } from "@/models/Item"

export async function PATCH(request: Request) {
  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids : []
  const percent = Number(body.percent)
  if (!ids.length || Number.isNaN(percent)) {
    return NextResponse.json({ error: "ids and percent are required." }, { status: 400 })
  }

  await dbConnect()
  const items = await Item.find({ _id: { $in: ids } })
  const updates = items.map((item) => {
    const priceLow = item.priceLow != null ? Math.max(0, Math.round(item.priceLow * (1 + percent / 100))) : item.priceLow
    const priceHigh = item.priceHigh != null ? Math.max(0, Math.round(item.priceHigh * (1 + percent / 100))) : item.priceHigh
    return Item.findByIdAndUpdate(item._id, {
      priceLow,
      priceHigh,
      priceUpdatedAt: new Date(),
    }, { new: true, runValidators: true }).lean()
  })

  const result = await Promise.all(updates)
  return NextResponse.json({ items: result })
}
