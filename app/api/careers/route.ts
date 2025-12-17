import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"
import sanitizeHtml from "sanitize-html"

const createCareerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  salary: z.string().optional(),
  image: z.string().optional(),
  applicationDeadline: z.string().optional(),
  applicationUrl: z.string().optional(),
  contactEmail: z.string().email().optional(),
  featured: z.boolean().optional(),
})

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(careers)
  } catch (error: any) {
    console.error("[v0] Error fetching careers:", error)
    return NextResponse.json(
      {
        error: "Unable to Fetch Careers",
        message: "There was a problem loading the careers. Please try again later.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = createCareerSchema.safeParse(body)
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

    const career = await prisma.career.create({
      data: {
        title: validatedData.title.trim(),
        company: validatedData.company.trim(),
        description: sanitizeHtml(validatedData.description),
        requirements: validatedData.requirements ? sanitizeHtml(validatedData.requirements) : "",
        location: validatedData.location || "",
        type: validatedData.type || "full-time",
        salary: validatedData.salary || "",
        image: validatedData.image || "",
        applicationDeadline: validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline) : null,
        applicationUrl: validatedData.applicationUrl || "",
        contactEmail: validatedData.contactEmail || "",
        featured: validatedData.featured || false,
      },
    })
    return NextResponse.json(career, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creating career:", error)
    return NextResponse.json(
      {
        error: "Failed to Create",
        message: error.message || "Unable to create career opportunity. Please try again.",
      },
      { status: 500 },
    )
  }
}
