import { PrismaClient } from "@prisma/client"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

const templatePath = join(process.cwd(), "templates", "art-marketplace", "index.html")
const htmlContent = existsSync(templatePath) ? readFileSync(templatePath, "utf-8") : ""

async function main() {
  const existing = await prisma.studioTemplate.findFirst({
    where: { title: "THE BIG SIX | Art Marketplace" },
  })

  if (existing) {
    console.log("  ± 'THE BIG SIX | Art Marketplace' already exists, updating...")
    await prisma.studioTemplate.update({
      where: { id: existing.id },
      data: {
        description: "A premium art marketplace template for selling original artworks. Features gallery grid, artist profiles, artwork cards, pricing, and an 'Apply to Sell' CTA. Built for curators and collectors.",
        category: "Marketplace",
        previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
        previewImages: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
        ],
        tags: ["Art", "Marketplace", "Gallery", "Premium"],
        isFree: false,
        price: 3499,
        featured: true,
        isPublished: true,
        htmlContent,
        cssContent: "",
        jsContent: "",
        downloadUrl: "https://example.com/templates/art-marketplace.zip",
      },
    })
    console.log("  ✅ Updated: 'THE BIG SIX | Art Marketplace'")
  } else {
    await prisma.studioTemplate.create({
      data: {
        title: "THE BIG SIX | Art Marketplace",
        description: "A premium art marketplace template for selling original artworks. Features gallery grid, artist profiles, artwork cards, pricing, and an 'Apply to Sell' CTA. Built for curators and collectors.",
        category: "Marketplace",
        previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
        previewImages: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
        ],
        tags: ["Art", "Marketplace", "Gallery", "Premium"],
        isFree: false,
        price: 3499,
        featured: true,
        isPublished: true,
        htmlContent,
        cssContent: "",
        jsContent: "",
        downloadUrl: "https://example.com/templates/art-marketplace.zip",
      },
    })
    console.log("  ✅ Created: 'THE BIG SIX | Art Marketplace'")
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
