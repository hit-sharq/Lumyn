import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import sanitizeHtml from "sanitize-html"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const career = await prisma.career.findUnique({
      where: { id },
    })

    if (!career) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The career opportunity you're looking for doesn't exist",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(career)
  } catch (error: any) {
    console.error("[v0] Error fetching career:", error)
    return NextResponse.json(
      {
        error: "Failed to Load",
        message: error.message || "Unable to load this career opportunity. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.title || !body.company || !body.description) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Title, company, and description are required fields",
        },
        { status: 400 },
      )
    }

    const updateData: any = {}

    if (body.title) updateData.title = body.title.trim()
    if (body.company) updateData.company = body.company.trim()
    if (body.description) updateData.description = sanitizeHtml(body.description)
    if (body.requirements) updateData.requirements = sanitizeHtml(body.requirements)
    if (body.location !== undefined) updateData.location = body.location
    if (body.type !== undefined) updateData.type = body.type
    if (body.salary !== undefined) updateData.salary = body.salary
    if (body.image !== undefined) updateData.image = body.image || ""
    if (body.applicationDeadline !== undefined) {
      updateData.applicationDeadline = body.applicationDeadline ? new Date(body.applicationDeadline) : null
    }
    if (body.applicationUrl !== undefined) updateData.applicationUrl = body.applicationUrl
    if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail
    if (body.featured !== undefined) updateData.featured = body.featured

    const career = await prisma.career.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(career)
  } catch (error: any) {
    console.error("[v0] Error updating career:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The career opportunity you're trying to update doesn't exist",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to Update",
        message: error.message || "Unable to update career opportunity. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.career.delete({
      where: { id },
    })
    return NextResponse.json({
      success: true,
      message: "Career opportunity deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error deleting career:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The career opportunity you're trying to delete doesn't exist",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to Delete",
        message: error.message || "Unable to delete career opportunity. Please try again.",
      },
      { status: 500 },
    )
  }
}
