import { Metadata } from "next"
import StudioClient from "./studio-client"

export const metadata: Metadata = {
  title: "Studio — Lumyn",
  description: "Premium templates marketplace. Pixel-perfect designs built to launch.",
}

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
  return <StudioClient initialTemplates={templates} />
}
