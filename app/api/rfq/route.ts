import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { dbConnect } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { Item } from "@/models/Item"
import { RFQ } from "@/models/RFQ"

const rfqItemSchema = z.object({
  itemId: z.string().min(1),
  name: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number().int().min(1),
})

const rfqPayloadSchema = z.object({
  company: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(rfqItemSchema).min(1),
})

function buildItemQuery(itemId: string) {
  if (mongoose.isValidObjectId(itemId)) {
    return { $or: [{ slug: itemId }, { _id: new mongoose.Types.ObjectId(itemId) }] }
  }
  return { slug: itemId }
}

function buildRfqEmailHtml(data: z.infer<typeof rfqPayloadSchema>, rfqNumber: number) {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border:1px solid #ddd;">${item.name}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.unit}</td></tr>`
    )
    .join("")

  return `
    <div style="font-family:system-ui, sans-serif; color:#1f2a21; line-height:1.6;">
      <h1 style="font-size:24px; margin-bottom:16px;">RFQ ${rfqNumber} received</h1>
      <p style="margin-bottom:12px;">Thank you for your request, ${data.contactName}.</p>
      <p style="margin-bottom:20px;">We have received your quote request and will follow up shortly with pricing and availability.</p>
      <h2 style="font-size:18px; margin-bottom:12px;">Buyer details</h2>
      <ul style="list-style:none; padding:0; margin:0 0 20px 0;">
        <li><strong>Company:</strong> ${data.company}</li>
        <li><strong>Contact:</strong> ${data.contactName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ""}
        ${data.city ? `<li><strong>City:</strong> ${data.city}</li>` : ""}
        ${data.country ? `<li><strong>Country:</strong> ${data.country}</li>` : ""}
      </ul>
      <h2 style="font-size:18px; margin-bottom:12px;">Requested items</h2>
      <table style="border-collapse:collapse; width:100%; margin-bottom:20px;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Material</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:center;">Quantity</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:center;">Unit</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
    </div>
  `
}

export async function POST(req: NextRequest) {
  let payload: z.infer<typeof rfqPayloadSchema>

  try {
    const body = await req.json()
    const parsed = rfqPayloadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    payload = parsed.data
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  try {
    await dbConnect()

    const itemIds = Array.from(new Set(payload.items.map((item) => item.itemId)))
    const query = { $or: itemIds.map((itemId) => buildItemQuery(itemId)) }
    const foundItems = await Item.find(query).lean()

    if (foundItems.length !== itemIds.length) {
      const foundSlugs = new Set(foundItems.map((item) => item.slug))
      const missing = itemIds.filter((itemId) => !foundSlugs.has(itemId))
      return NextResponse.json(
        {
          error: `Unable to resolve ${missing.length} item${missing.length === 1 ? "" : "s"} from the RFQ cart. Please refresh the catalog and try again.`,
        },
        { status: 400 }
      )
    }

    const counts = payload.items.reduce((sum, item) => sum + item.quantity, 0)
    const lastRfq = await RFQ.findOne({}).sort({ rfqNumber: -1 }).select("rfqNumber").lean()
    const rfqNumber = (lastRfq?.rfqNumber ?? 1000) + 1

    const itemBySlug = new Map(foundItems.map((item) => [item.slug, item]))
    const items = payload.items.map((line) => {
      const item = itemBySlug.get(line.itemId)
      if (!item) {
        throw new Error(`Missing item for cart line ${line.itemId}`)
      }
      return {
        item: item._id,
        name: item.name,
        unit: item.unit ?? "kg",
        quantity: line.quantity,
        targetPrice: null,
      }
    })

    const rfqDoc = await RFQ.create({
      rfqNumber,
      company: payload.company,
      contactName: payload.contactName,
      email: payload.email,
      phone: payload.phone ?? "",
      city: payload.city ?? "",
      country: payload.country ?? "",
      notes: payload.notes ?? "",
      items,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const emailHtml = buildRfqEmailHtml(payload, rfqNumber)
    const internalRecipient = process.env.QUOTE_EMAIL_TO ?? "quotes@yurvanaagro.com"
    const customerRecipient = payload.email
    const fromAddress = process.env.EMAIL_FROM ?? "Yurvana Agro <quotes@yurvana.com>"

    await Promise.allSettled([
      sendEmail({
        to: internalRecipient,
        subject: `New RFQ ${rfqNumber} from ${payload.company}`,
        html: emailHtml,
        from: fromAddress,
      }),
      sendEmail({
        to: customerRecipient,
        subject: `Your RFQ request ${rfqNumber} has been received`,
        html: emailHtml,
        from: fromAddress,
      }),
    ])

    return NextResponse.json({ id: rfqDoc._id, rfqNumber }, { status: 201 })
  } catch (error) {
    console.error("[api/rfq] failed:", error)
    return NextResponse.json(
      { error: "Unable to create RFQ. Please try again later." },
      { status: 500 }
    )
  }
}
