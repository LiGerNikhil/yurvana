import { loadEnvFile } from "node:process"
import path from "node:path"
import bcrypt from "bcryptjs"

import { dbConnect } from "@/lib/db"
import { AdminUser } from "@/models/AdminUser"

loadEnvFile(path.resolve(process.cwd(), ".env"))

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME || "Administrator"

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.")
  process.exit(1)
}

const normalizedEmail = email.toLowerCase()
const passwordValue = password

async function main() {
  await dbConnect()

  const passwordHash = await bcrypt.hash(passwordValue, 12)

  const result = await AdminUser.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        name,
        passwordHash,
        isActive: true,
        role: "admin",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  console.log("Admin user created/updated:", result.email)
  process.exit(0)
}

main().catch((error) => {
  console.error("Failed to create admin user:", error)
  process.exit(1)
})
