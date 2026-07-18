import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { isAdminUser } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const isAdmin = userId ? isAdminUser(userId) : false

    const adminParam = request.nextUrl.searchParams.get("admin")

    if (adminParam === "true" && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (adminParam === "true") {
      const partners = await prisma.partner.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        include: {
          conversions_relation: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      })

      return NextResponse.json(partners)
    }

    const partners = await prisma.partner.findMany({
      where: { status: "active" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        website: true,
        category: true,
        featured: true,
        order: true,
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

    if (!isAdminUser(userId)) {
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
