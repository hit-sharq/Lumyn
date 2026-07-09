/**
 * Updates existing StudioTemplate records with Cloudinary preview images.
 * Run with: npx tsx scripts/update-template-previews.ts
 */
import { PrismaClient } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"
import { writeFileSync, mkdirSync, rmSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dtkadempd",
  api_key: process.env.CLOUDINARY_API_KEY || "364618325885778",
  api_secret: process.env.CLOUDINARY_API_SECRET || "NoD6maJhkktT59FKMAlD7ofq5_s",
})

const templates = [
  { title: "Lumyn Creator Portfolio", category: "Portfolio", bg: "#0a0a0f", fg: "#f59e0b" },
  { title: "SaaS Landing Kit", category: "SaaS", bg: "#0b0d14", fg: "#6366f1" },
  { title: "Minimal Blog Theme", category: "Blog", bg: "#fdfcf8", fg: "#1c1917" },
  { title: "Shop Minimal E-Commerce", category: "E-Commerce", bg: "#0f0f12", fg: "#f59e0b" },
  { title: "Freelancer Portfolio", category: "Portfolio", bg: "#fafaf9", fg: "#1c1917" },
  { title: "Agency Landing Page", category: "Business", bg: "#0f172a", fg: "#6366f1" },
  { title: "Savour Restaurant & Bistro", category: "Restaurant", bg: "#0f0b08", fg: "#d97706" },
  { title: "Wedding & Event", category: "Event", bg: "#0f0b08", fg: "#d97706" },
  { title: "Grace Church & Ministry", category: "Church", bg: "#0d1a12", fg: "#c8b96a" },
  { title: "Sunrise School & Academy", category: "School", bg: "#0f172a", fg: "#6366f1" },
  { title: "Pillar Real Estate", category: "Real Estate", bg: "#08140f", fg: "#cbb079" },
  { title: "MediCare Health Clinic", category: "Medical", bg: "#0a0f0d", fg: "#10b981" },
  { title: "Hope Foundation NGO", category: "Nonprofit", bg: "#0a0f0d", fg: "#10b981" },
  { title: "Artist & Musician", category: "Musician", bg: "#0a0a0f", fg: "#f43f5e" },
  { title: "Startup Launch Page", category: "Landing Page", bg: "#0b0d14", fg: "#6366f1" },
]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const TMP_DIR = "/tmp/kilo-cloudinary-previews"
try { mkdirSync(TMP_DIR, { recursive: true }) } catch {}

async function uploadPreviewImage(slug: string, title: string, bg: string, fg: string): Promise<string> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="${fg}" stop-opacity="0.35" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <rect x="60" y="60" width="1080" height="510" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="1"/>
    <text x="600" y="315" font-family="ui-sans-serif, system-ui, sans-serif" font-size="42" font-weight="600" fill="${fg}" text-anchor="middle" dominant-baseline="middle" opacity="0.95">${title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
    <text x="600" y="375" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="400" fill="${fg}" text-anchor="middle" dominant-baseline="middle" opacity="0.65">Lumyn Studio Template</text>
  </svg>`

  const filePath = join(TMP_DIR, `${slug}.svg`)
  writeFileSync(filePath, svg, "utf-8")

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "lumyn/templates",
    public_id: slug,
    overwrite: true,
    resource_type: "image",
  })

  return result.secure_url
}

async function main() {
  console.log("🖼 Updating StudioTemplate preview images on Cloudinary…\n")

  for (const tpl of templates) {
    const existing = await prisma.studioTemplate.findFirst({
      where: { title: tpl.title },
    })

    if (!existing) {
      console.log(`  ⊘ "${tpl.title}" not found, skipped.`)
      continue
    }

    const slug = slugify(tpl.title)
    console.log(`  Uploading preview for "${tpl.title}" (${tpl.category})…`)

    try {
      const secureUrl = await uploadPreviewImage(slug, tpl.title, tpl.bg, tpl.fg)

      await prisma.studioTemplate.update({
        where: { id: existing.id },
        data: {
          previewImage: secureUrl,
          previewImages: [secureUrl],
          downloadUrl: `https://www.lumyn.co.ke/studio/${existing.id}`,
        },
      })

      console.log(`  ✓ Updated "${tpl.title}"`)
    } catch (err) {
      console.error(`  ✗ Failed "${tpl.title}":`, (err as Error).message)
    }
  }

  console.log("\nDone.")
}

main()
  .catch((e) => {
    console.error("❌ Update error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    try { rmSync(TMP_DIR, { recursive: true, force: true }) } catch {}
  })
