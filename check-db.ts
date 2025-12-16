
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const careers = await prisma.career.findMany()
  console.log("Found careers:", careers.length)
  careers.forEach(c => {
    console.log(`ID: ${c.id}, Title: ${c.title}, Image: '${c.image}'`)
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

