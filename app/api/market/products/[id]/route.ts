import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.marketProduct.findUnique({
      where: { id: params.id },
      include: { creator: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const product = await prisma.marketProduct.findUnique({
      where: { id: params.id },
      include: { creator: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (product.creator.userId !== userId) {
      const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
      if (!adminIds.includes(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const updated = await prisma.marketProduct.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        price: parseFloat(body.price),
        fileUrl: body.fileUrl,
        previewImage: body.previewImage,
        tags: body.tags || [],
        isPublished: body.isPublished ?? true,
      },
      include: { creator: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const product = await prisma.marketProduct.findUnique({
      where: { id: params.id },
      include: { creator: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (product.creator.userId !== userId) {
      const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
      if (!adminIds.includes(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.marketProduct.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
