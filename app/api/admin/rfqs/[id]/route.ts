import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"
import { RFQ } from "@/models/RFQ"

const allowedStatuses = ["new", "quoted", "approved", "rejected", "closed"] as const

type AllowedStatus = (typeof allowedStatuses)[number]

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect()
  const { id } = await context.params
  const rfq = await RFQ.findById(id).lean()

  if (!rfq) {
    return NextResponse.json({ error: "RFQ not found." }, { status: 404 })
  }

  return NextResponse.json(rfq)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = (await request.json()) as { status?: string }

  if (!body.status || !allowedStatuses.includes(body.status as AllowedStatus)) {
    return NextResponse.json(
      { error: "Invalid RFQ status." },
      { status: 400 }
    )
  }

  await dbConnect()
  const rfq = await RFQ.findByIdAndUpdate(
    id,
    { status: body.status, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean()

  if (!rfq) {
    return NextResponse.json({ error: "RFQ not found." }, { status: 404 })
  }

  return NextResponse.json(rfq)
}
