import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { getAdminAnalytics } from "@/lib/marketing/analytics"

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

    const analytics = await getAdminAnalytics()

    return NextResponse.json(analytics)
  } catch (error: any) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
