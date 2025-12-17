
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"
import { z } from "zod"
import sanitizeHtml from "sanitize-html"


const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt must be less than 500 characters"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  tags: z.array(z.string()).optional().default([]),
  image: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const featured = searchParams.get("featured") === "true"
    const category = searchParams.get("category")
    const isPublished = searchParams.get("isPublished")

    const where: any = {}
    
    if (featured) {
      where.featured = true
    }
    
    if (category) {
      where.category = category
    }
    
    if (isPublished !== null && isPublished !== undefined) {
      where.isPublished = isPublished === "true"
    }


    const posts = await prisma.blog.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" }
      ],
      take: limit,
    })
    
    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    logger.error("[v0] Error fetching blog posts:", error)
    return NextResponse.json(
      {
        error: "Unable to Fetch Blog Posts",
        message: "There was a problem loading the blog posts. Please try again later.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = createBlogSchema.safeParse(body)
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

    // Sanitize content and excerpt
    const sanitizedContent = sanitizeHtml(validatedData.content)
    const sanitizedExcerpt = sanitizeHtml(validatedData.excerpt)


    const post = await prisma.blog.create({
      data: {
        title: validatedData.title.trim(),
        excerpt: sanitizedExcerpt,
        content: sanitizedContent,
        author: validatedData.author.trim(),
        category: validatedData.category.trim(),
        tags: validatedData.tags || [],
        image: validatedData.imageUrl || validatedData.image || "",
        isPublished: validatedData.isPublished,
        featured: validatedData.featured,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    logger.error("[v0] Error creating blog post:", error)
    return NextResponse.json(
      {
        error: "Failed to Create",
        message: error.message || "Unable to create blog post. Please try again.",
      },
      { status: 500 },
    )
  }
}
