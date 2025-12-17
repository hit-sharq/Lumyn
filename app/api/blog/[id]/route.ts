

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"
import sanitizeHtml from "sanitize-html"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await prisma.blog.findUnique({
      where: { id },
    })
    if (!post) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The blog post you're looking for doesn't exist",
        },
        { status: 404 },
      )
    }
    return NextResponse.json(post)
  } catch (error: any) {

    logger.error("[v0] Error fetching blog post:", error)
    return NextResponse.json(
      {
        error: "Failed to Load",
        message: error.message || "Unable to load this blog post. Please try again.",
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

    if (body.title && typeof body.title === "string") updateData.title = body.title.trim()
    if (body.excerpt && typeof body.excerpt === "string") {
      updateData.excerpt = sanitizeHtml(body.excerpt.trim())
    }
    if (body.content && typeof body.content === "string") {
      updateData.content = sanitizeHtml(body.content.trim())
    }
    if (body.author && typeof body.author === "string") updateData.author = body.author.trim()
    if (body.category && typeof body.category === "string") updateData.category = body.category.trim()
    if (body.tags && Array.isArray(body.tags)) updateData.tags = body.tags

    if (body.imageUrl || body.image) updateData.image = body.imageUrl || body.image
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished
    if (body.featured !== undefined) updateData.featured = body.featured

    const post = await prisma.blog.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(post)
  } catch (error: any) {

    logger.error("[v0] Error updating blog post:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The blog post you're trying to update doesn't exist",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to Update",
        message: error.message || "Unable to update blog post. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Check if blog post exists before deleting
    const existingPost = await prisma.blog.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The blog post you're trying to delete doesn't exist",
        },
        { status: 404 },
      )
    }

    await prisma.blog.delete({
      where: { id },
    })
    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    })
  } catch (error: any) {

    logger.error("[v0] Error deleting blog post:", error)
    return NextResponse.json(
      {
        error: "Failed to Delete",
        message: error.message || "Unable to delete blog post. Please try again.",
      },
      { status: 500 },
    )
  }
}
