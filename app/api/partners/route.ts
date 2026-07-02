import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        conversions_relation: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    return NextResponse.json(partners)
  } catch (error: any) {
    console.error("Partners GET error:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      logoUrl,
      website,
      category,
      contactName,
      contactEmail,
      contactPhone,
      dealType,
      commissionType,
      commissionValue,
      status,
      startDate,
      endDate,
      notes,
    } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        description,
        logoUrl,
        website,
        category: category || "general",
        contactName,
        contactEmail,
        contactPhone,
        dealType,
        commissionType,
        commissionValue: commissionValue ? parseFloat(commissionValue) : null,
        status: status || "active",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        notes,
      },
    })

    return NextResponse.json(partner, { status: 201 })
  } catch (error: any) {
    console.error("Partners POST error:", error)
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 })
  }
}
