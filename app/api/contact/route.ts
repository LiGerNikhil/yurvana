import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { sendEmail } from "@/lib/email"

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
})

function buildContactEmailHtml(data: z.infer<typeof contactSchema>) {
  return `
    <div style="font-family:system-ui, sans-serif; color:#1f2a21; line-height:1.6;">
      <h1 style="font-size:24px; margin-bottom:16px;">New general inquiry received</h1>
      <p style="margin-bottom:12px;">A new message has been received from ${data.name}.</p>
      <ul style="list-style:none; padding:0; margin:0 0 20px 0;">
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ""}
      </ul>
      <h2 style="font-size:18px; margin-bottom:12px;">Message</h2>
      <p style="white-space:pre-wrap; margin:0;">${data.message}</p>
    </div>
  `
}

export async function POST(req: NextRequest) {
  let payload: z.infer<typeof contactSchema>

  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    payload = parsed.data
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  try {
    const emailHtml = buildContactEmailHtml(payload)
    const internalRecipient = process.env.CONTACT_EMAIL_TO ?? "quotes@yurvanaagro.com"
    const fromAddress = process.env.EMAIL_FROM ?? "Yurvana Agro <quotes@yurvana.com>"

    await sendEmail({
      to: internalRecipient,
      subject: `General inquiry from ${payload.name}`,
      html: emailHtml,
      from: fromAddress,
    })

    return NextResponse.json({ status: "ok" }, { status: 201 })
  } catch (error) {
    console.error("[api/contact] failed:", error)
    return NextResponse.json(
      { error: "Unable to send inquiry. Please try again later." },
      { status: 500 }
    )
  }
}
