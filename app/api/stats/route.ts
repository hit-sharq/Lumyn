import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [memberCount, eventCount, newsCount] = await Promise.all([
      prisma.member.count(),
      prisma.event.count(),
      prisma.news.count(),
    ])

    return NextResponse.json({
      members: memberCount,
      events: eventCount,
      news: newsCount,
      yearsActive: 10, // This can be calculated from founding date
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    // Return default values instead of error during build time
    return NextResponse.json({
      members: 0,
      events: 0,
      news: 0,
      yearsActive: 10,
    }, { status: 200 })
  }
}
