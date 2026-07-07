import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getAdminAnalytics } from "@/lib/marketing/analytics"
import { isAdminUser } from "@/lib/admin"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const analytics = await getAdminAnalytics()

    return NextResponse.json(analytics)
  } catch (error: any) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
