import { Metadata } from "next"
import StudioClient from "./studio-client"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Studio — Premium Templates & Digital Assets",
  description: "Premium templates marketplace. Pixel-perfect designs built to launch. Browse UI kits, themes, and creative assets from African creators.",
  path: "/studio",
  keywords: ["templates", "UI kits", "digital assets", "premium designs", "Lumyn Studio", "creative tools"],
})

async function getTemplates() {
  if (!process.env.DATABASE_URL) return []
  try {
    const { prisma } = await import("@/lib/db/prisma")
    const templates = await prisma.studioTemplate.findMany({
      where: { isPublished: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        _count: { select: { purchases: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    })
    return templates
  } catch {
    return []
  }
}

export default async function StudioPage() {
  const templates = await getTemplates()
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Studio", url: "https://www.lumyn.co.ke/studio" },
      ])}
      <StudioClient initialTemplates={templates} />
    </>
  )
}
