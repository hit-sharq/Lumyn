import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { sendNewsletter } from "@/lib/email/templates"

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
    const { subject, body: content, segment } = body

    if (!subject || !content) {
      return NextResponse.json({ error: "Missing subject or content" }, { status: 400 })
    }

    let members = await prisma.member.findMany({
      select: { email: true, firstName: true, id: true },
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

    const results = await Promise.allSettled(
      members.map((m) =>
        sendNewsletter({
          to: m.email,
          subject,
          body: content.replace("{{name}}", m.firstName || "there"),
          unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe?email=${encodeURIComponent(m.email)}`,
        })
      )
    )

    const sent = results.filter((r) => r.status === "fulfilled" && r.value.success).length
    const failed = results.length - sent

    return NextResponse.json({
      success: true,
      total: members.length,
      sent,
      failed,
    })
  } catch (error: any) {
    console.error("Newsletter blast error:", error)
    return NextResponse.json({ error: "Newsletter failed" }, { status: 500 })
  }
}
