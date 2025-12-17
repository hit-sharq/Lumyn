import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import sanitizeHtml from "sanitize-html"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const news = await prisma.news.findUnique({
      where: { id },
    })
    if (!news) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The news item you're looking for doesn't exist",
        },
        { status: 404 },
      )
    }
    return NextResponse.json(news)
  } catch (error: any) {
    console.error("[v0] Error fetching news:", error)
    return NextResponse.json(
      {
        error: "Failed to Load",
        message: error.message || "Unable to load this news item. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.title || !body.excerpt || !body.content || !body.author || !body.category) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Title, excerpt, content, author, and category are required fields",
        },
        { status: 400 },
      )
    }

    const updateData: any = {}

    if (body.title) updateData.title = body.title.trim()
    if (body.excerpt) updateData.excerpt = body.excerpt.trim()
    if (body.content) updateData.content = sanitizeHtml(body.content.trim())
    if (body.author) updateData.author = body.author.trim()
    if (body.category) updateData.category = body.category.trim()
    if (body.image || body.imageUrl) updateData.image = body.image || body.imageUrl
    if (body.publishedAt) updateData.publishedAt = new Date(body.publishedAt)

    const news = await prisma.news.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(news)
  } catch (error: any) {
    console.error("[v0] Error updating news:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The news item you're trying to update doesn't exist",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to Update",
        message: error.message || "Unable to update news item. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.news.delete({
      where: { id },
    })
    return NextResponse.json({
      success: true,
      message: "News item deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error deleting news:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The news item you're trying to delete doesn't exist",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to Delete",
        message: error.message || "Unable to delete news item. Please try again.",
      },
      { status: 500 },
    )
  }
}
