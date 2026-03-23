import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const template = await prisma.studioTemplate.findUnique({
      where: { id: params.id },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        _count: { select: { purchases: true, reviews: true } },
      },
    })
    if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const template = await prisma.studioTemplate.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        previewImage: body.previewImage,
        previewImages: body.previewImages || [],
        tags: body.tags || [],
        isFree: body.isFree ?? false,
        price: body.isFree ? 0 : (body.price || 0),
        downloadUrl: body.downloadUrl || null,
        featured: body.featured ?? false,
        isPublished: body.isPublished ?? true,
      },
    })
    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const template = await prisma.studioTemplate.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await prisma.studioTemplate.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}
