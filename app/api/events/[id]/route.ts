import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import sanitizeHtml from "sanitize-html"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
    })
    if (!event) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The event you're looking for doesn't exist",
        },
        { status: 404 },
      )
    }
    return NextResponse.json(event)
  } catch (error: any) {
    console.error("[v0] Error fetching event:", error)
    return NextResponse.json(
      {
        error: "Failed to Load",
        message: error.message || "Unable to load this event. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.title || !body.description || !body.date || !body.time || !body.location || !body.category) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Title, description, date, time, location, and category are required fields",
        },
        { status: 400 },
      )
    }

    const updateData: any = {}

    if (body.title && typeof body.title === "string") updateData.title = body.title.trim()
    if (body.description && typeof body.description === "string") {
      updateData.description = sanitizeHtml(body.description.trim())
    }
    if (body.date) updateData.date = new Date(body.date)
    if (body.time && typeof body.time === "string") updateData.time = body.time.trim()
    if (body.location && typeof body.location === "string") updateData.location = body.location.trim()
    if (body.imageUrl || body.image) updateData.image = body.imageUrl || body.image
    if (body.category && typeof body.category === "string") updateData.category = body.category.trim()
    if (body.registrationLink !== undefined) updateData.registrationLink = body.registrationLink
    if (body.isStaple !== undefined) updateData.isStaple = body.isStaple

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(event)
  } catch (error: any) {
    console.error("[v0] Error updating event:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The event you're trying to update doesn't exist",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to Update",
        message: error.message || "Unable to update event. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Check if event exists before deleting
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The event you're trying to delete doesn't exist",
        },
        { status: 404 },
      )
    }

    await prisma.event.delete({
      where: { id },
    })
    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error deleting event:", error)
    return NextResponse.json(
      {
        error: "Failed to Delete",
        message: error.message || "Unable to delete event. Please try again.",
      },
      { status: 500 },
    )
  }
}
