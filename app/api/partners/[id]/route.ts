import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { isAdminUser } from "@/lib/admin"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const partner = await prisma.partner.findUnique({
      where: { id: params.id },
      include: {
        conversions_relation: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    })

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error: any) {
    console.error("Partner GET error:", error)
    return NextResponse.json({ error: "Failed to fetch partner" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const partner = await prisma.partner.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(partner)
  } catch (error: any) {
    console.error("Partner PATCH error:", error)
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.partner.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Partner DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
