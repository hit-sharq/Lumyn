import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const isFree = searchParams.get("isFree")
    const featured = searchParams.get("featured")

    const where: any = { isPublished: true }
    if (category && category !== "All") where.category = category
    if (isFree === "true") where.isFree = true
    if (featured === "true") where.featured = true

    const templates = await prisma.studioTemplate.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        _count: { select: { purchases: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Studio templates GET error:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, category, previewImage, previewImages, tags, isFree, price, downloadUrl, featured } = body

    if (!title || !description || !category || !previewImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const template = await prisma.studioTemplate.create({
      data: {
        title,
        description,
        category,
        previewImage,
        previewImages: previewImages || [],
        tags: tags || [],
        isFree: isFree ?? false,
        price: isFree ? 0 : (price || 0),
        downloadUrl: downloadUrl || null,
        featured: featured ?? false,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Studio templates POST error:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
