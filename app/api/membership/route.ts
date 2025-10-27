import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"
import { z } from "zod"

const membershipSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number too long"),
  year: z.enum(["freshman", "sophomore", "junior", "senior", "graduate", "other"], {
    errorMap: () => ({ message: "Please select a valid academic year" }),
  }),
  major: z.string().min(1, "Major is required").max(100, "Major too long"),
  interests: z.string().max(500, "Interests too long").optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = membershipSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.format()
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { firstName, lastName, email, phone, year, major, interests } = validation.data

    const membership = await prisma.member.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        year,
        major,
        interests: interests || "",
      },
    })

    return NextResponse.json({ success: true, data: membership }, { status: 201 })
  } catch (error) {
    logger.error("[v0] Error creating membership:", error)
    return NextResponse.json({ success: false, error: "Failed to create membership" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const memberships = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(memberships)
  } catch (error) {
    logger.error("[v0] Error fetching memberships:", error)
    return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 })
  }
}
