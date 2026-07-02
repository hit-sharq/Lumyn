import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { createNotification } from "@/lib/marketing/notifications"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { userId },
    })

    if (!member) {
      return NextResponse.json([])
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: member.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(notifications)
  } catch (error: any) {
    console.error("Notifications GET error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { userId },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const body = await request.json()
    const { type, message, data } = body

    if (!type || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const notification = await createNotification({
      userId: member.id,
      type,
      message,
      data,
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error: any) {
    console.error("Notifications POST error:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
