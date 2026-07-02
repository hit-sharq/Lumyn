import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { markAllAsRead } from "@/lib/marketing/notifications"

export async function DELETE(request: NextRequest) {
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

    await markAllAsRead(member.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Notifications clear error:", error)
    return NextResponse.json({ error: "Failed to clear notifications" }, { status: 500 })
  }
}
