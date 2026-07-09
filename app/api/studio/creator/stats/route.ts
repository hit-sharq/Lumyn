import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const templates = await prisma.studioTemplate.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        category: true,
        previewImage: true,
        isFree: true,
        price: true,
        downloadCount: true,
        createdAt: true,
        _count: { select: { purchases: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const earnings = await prisma.studioEarning.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        platformFee: true,
        authorShare: true,
        status: true,
        paidAt: true,
        createdAt: true,
        template: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const totalEarnings = earnings.reduce((sum, e) => sum + e.authorShare, 0)
    const pendingEarnings = earnings
      .filter((e) => e.status === "pending")
      .reduce((sum, e) => sum + e.authorShare, 0)
    const totalSales = templates.reduce((sum, t) => sum + (t._count?.purchases || 0), 0)

    return NextResponse.json({
      templates,
      earnings,
      stats: {
        totalEarnings,
        pendingEarnings,
        totalSales,
        totalTemplates: templates.length,
      },
    })
  } catch (error) {
    console.error("Creator stats GET error:", error)
    return NextResponse.json({ error: "Failed to fetch creator stats" }, { status: 500 })
  }
}
