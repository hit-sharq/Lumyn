import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createLeaderSchema = z.object({
  name: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  role: z.string().min(1).max(200),
  imageUrl: z.string().url().optional(),
  order: z.number().int().min(0).optional(),
})

const updateLeaderSchema = createLeaderSchema.extend({
  id: z.string().min(1),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    console.log("[v0] Fetching leadership team from database")
    const leaders = await prisma.leadershipTeam.findMany({
      orderBy: { order: "asc" },
      take: limit,
    })
    console.log("[v0] Found leaders:", leaders.length)
    return NextResponse.json(leaders, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching leadership team:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createLeaderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    console.log("[v0] Creating new leader:", validatedData.name)
    const leader = await prisma.leadershipTeam.create({
      data: {
        name: validatedData.name.trim(),
        position: validatedData.position.trim(),
        role: validatedData.role.trim(),
        imageUrl: validatedData.imageUrl,
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json(leader)
  } catch (error) {
    console.error("[v0] Error creating leader:", error)
    return NextResponse.json({ error: "Failed to create leader" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = updateLeaderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    console.log("[v0] Updating leader:", validatedData.id)
    const leader = await prisma.leadershipTeam.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name.trim(),
        position: validatedData.position.trim(),
        role: validatedData.role.trim(),
        imageUrl: validatedData.imageUrl,
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json(leader)
  } catch (error) {
    console.error("[v0] Error updating leader:", error)
    return NextResponse.json({ error: "Failed to update leader" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Leader ID is required" }, { status: 400 })
    }

    console.log("[v0] Deleting leader:", id)
    await prisma.leadershipTeam.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting leader:", error)
    return NextResponse.json({ error: "Failed to delete leader" }, { status: 500 })
  }
}
