import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"
import { z } from "zod"
import sanitizeHtml from "sanitize-html"

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required").max(50),
  location: z.string().min(1, "Location is required").max(200),
  image: z.string().optional(),
  category: z.string().min(1, "Category is required").max(100),
  registrationLink: z.string().optional(),
  isStaple: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get("upcoming") === "true"

    const where = upcoming
      ? {
          date: {
            gte: new Date(),
          },
        }
      : {}

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "desc" },
    })
    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    logger.error("[v0] Error fetching events:", error)
    return NextResponse.json(
      {
        error: "Unable to Fetch Events",
        message: "There was a problem loading the events. Please try again later.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = createEventSchema.safeParse(body)
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

    // Sanitize description
    const sanitizedDescription = sanitizeHtml(validatedData.description)

    const event = await prisma.event.create({
      data: {
        title: validatedData.title.trim(),
        description: sanitizedDescription,
        date: new Date(validatedData.date),
        time: validatedData.time.trim(),
        location: validatedData.location.trim(),
        image: validatedData.image || "",
        category: validatedData.category.trim(),
        registrationLink: validatedData.registrationLink || "",
        isStaple: validatedData.isStaple || false,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error: any) {
    logger.error("[v0] Error creating event:", error)
    return NextResponse.json(
      {
        error: "Failed to Create",
        message: error.message || "Unable to create event. Please try again.",
      },
      { status: 500 },
    )
  }
}
