import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"
import { z } from "zod"
import sanitizeHtml from "sanitize-html"

const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required").max(10000),
  category: z.string().min(1, "Category is required").max(100),
  image: z.string().optional(),
  imageUrl: z.string().optional(),
  author: z.string().min(1, "Author is required").max(100),
  publishedAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    const news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      take: limit,
    })
    return NextResponse.json(news, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    logger.error("[v0] Error fetching news:", error)
    return NextResponse.json(
      {
        error: "Unable to Fetch News",
        message: "There was a problem loading the news. Please try again later.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = createNewsSchema.safeParse(body)
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      return NextResponse.json(
        {
          error: "Validation Error",
          message: firstError.message || "Please check your input and try again",
          details: validationResult.error.issues,
        },
        { status: 400 },
      )
    }

    const validatedData = validationResult.data

    // Sanitize content
    const sanitizedContent = sanitizeHtml(validatedData.content)

    const data: any = {
      title: validatedData.title.trim(),
      excerpt: validatedData.excerpt.trim(),
      content: sanitizedContent,
      category: validatedData.category.trim(),
      image: validatedData.image || validatedData.imageUrl || "",
      author: validatedData.author.trim(),
    }

    if (validatedData.publishedAt) {
      data.publishedAt = new Date(validatedData.publishedAt)
    }

    const news = await prisma.news.create({
      data,
    })
    return NextResponse.json(news, { status: 201 })
  } catch (error: any) {
    logger.error("[v0] Error creating news:", error)
    return NextResponse.json(
      {
        error: "Failed to Create",
        message: error.message || "Unable to create news item. Please try again.",
      },
      { status: 500 },
    )
  }
}
