import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
}

cloudinary.config(cloudinaryConfig)

export async function POST(request: Request) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Cloudinary not configured." }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "yurvana-admin",
      resource_type: "image",
    })
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 })
  }
}
