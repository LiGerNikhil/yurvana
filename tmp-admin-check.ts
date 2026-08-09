import { loadEnvFile } from 'node:process'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import { dbConnect } from './lib/db'
import { AdminUser } from './models/AdminUser'

loadEnvFile(path.resolve(process.cwd(), '.env'))

const email = process.env.ADMIN_EMAIL?.toLowerCase()
if (!email) {
  console.error('ADMIN_EMAIL missing')
  process.exit(1)
}
const password = process.env.ADMIN_PASSWORD || ''

async function main() {
  await dbConnect()
  const user = await AdminUser.findOne({ email }).lean()
  console.log(JSON.stringify(user, null, 2))
  if (user) {
    const ok = await bcrypt.compare(password, user.passwordHash)
    console.log('passwordMatches=', ok)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
