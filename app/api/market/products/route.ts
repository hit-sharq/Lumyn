import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const creatorId = searchParams.get("creatorId")

    const where: any = { isPublished: true }
    if (category && category !== "All") where.category = category
    if (featured === "true") where.isFeatured = true
    if (creatorId) where.creatorId = creatorId

    const products = await prisma.marketProduct.findMany({
      where,
      include: { creator: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ""

    let creator = await prisma.marketCreatorProfile.findUnique({ where: { userId } })
    if (!creator) {
      creator = await prisma.marketCreatorProfile.create({
        data: {
          userId,
          userEmail,
          displayName: user?.fullName || user?.firstName || "Creator",
        },
      })
    }

    const body = await request.json()
    const { title, description, category, price, fileUrl, previewImage, tags } = body

    if (!title || !description || !category || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await prisma.marketProduct.create({
      data: {
        creatorId: creator.id,
        title,
        description,
        category,
        price: parseFloat(price),
        fileUrl,
        previewImage,
        tags: tags || [],
      },
      include: { creator: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Market products POST error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
