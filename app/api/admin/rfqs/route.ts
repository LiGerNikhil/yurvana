import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"
import { RFQ } from "@/models/RFQ"

export async function GET(request: Request) {
  await dbConnect()

  const url = new URL(request.url)
  const search = url.searchParams.get("search")?.trim() || ""
  const status = url.searchParams.get("status")?.trim() || ""

  const query: Record<string, any> = {}
  if (search) {
    query.$or = [
      { company: { $regex: search, $options: "i" } },
      { contactName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ]
  }
  if (status) {
    query.status = status
  }

  const rfqs = await RFQ.find(query).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ rfqs })
}
