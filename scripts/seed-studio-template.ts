/**
 * Seed script: creates one professional example template in the database.
 * Run with: npx tsx scripts/seed-studio-template.ts
 * Requires DATABASE_URL to be set.
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding example studio template…")

  const existing = await prisma.studioTemplate.findFirst({
    where: { title: "Lumyn Creator Portfolio" },
  })

  if (existing) {
    console.log("✓ Example template already exists, skipping.")
    return
  }

  const template = await prisma.studioTemplate.create({
    data: {
      title: "Lumyn Creator Portfolio",
      description:
        "A sleek, dark-mode-first portfolio template built for digital creators, developers, and designers. Includes sections for hero, work showcase, testimonials, contact form, and blog. Fully responsive and ready to deploy.",
      category: "Portfolio",
      previewImage:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
      previewImages: [
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
      ],
      tags: ["Next.js", "Tailwind CSS", "Dark Mode", "TypeScript", "Responsive"],
      isFree: false,
      price: 1499,
      featured: true,
      isPublished: true,
      downloadUrl: null,
    },
  })

  console.log(`✅ Created template: "${template.title}" (id: ${template.id})`)
  console.log(`   Price: KES ${template.price}  |  Featured: ${template.featured}`)
  console.log("\nDone! Visit /studio to see it.")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
