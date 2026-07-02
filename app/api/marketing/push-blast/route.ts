import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { sendBulkPush } from "@/lib/push/service"

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
    const { title, message, segment, url } = body

    if (!title || !message) {
      return NextResponse.json({ error: "Missing title or message" }, { status: 400 })
    }

    let members = await prisma.member.findMany({
      select: { id: true },
    })

    if (segment === "creators") {
      const creatorIds = await prisma.marketCreatorProfile.findMany({
        select: { userId: true },
      })
      members = members.filter((m) => creatorIds.some((c) => c.userId === m.id))
    } else if (segment === "employers") {
      const employerIds = await prisma.paidJobPost.findMany({
        where: { isPaid: true },
        select: { userId: true },
        distinct: ["userId"],
      })
      members = members.filter((m) => employerIds.some((e) => e.userId === m.id))
    } else if (segment === "pro") {
      const proIds = await prisma.subscription.findMany({
        where: { status: "active", plan: { in: ["creator_pro", "job_unlimited"] } },
        select: { userId: true },
      })
      members = members.filter((m) => proIds.some((p) => p.userId === m.id))
    }

    const userIds = members.map((m) => m.id)

    const results = await sendBulkPush({
      userIds,
      title,
      message,
      url,
    })

    const sent = results.filter((r) => r.status === "fulfilled" && r.value.sent > 0).length
    const failed = results.length - sent

    return NextResponse.json({
      success: true,
      total: userIds.length,
      sent,
      failed,
    })
  } catch (error: any) {
    console.error("Push blast error:", error)
    return NextResponse.json({ error: "Push blast failed" }, { status: 500 })
  }
}
