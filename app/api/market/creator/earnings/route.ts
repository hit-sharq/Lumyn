import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const paymentOrders = await prisma.paymentOrder.findMany({
      where: {
        status: "COMPLETED",
        type: { in: ["market_product", "studio_template"] }, // Adjust for creator types
        // Add creatorId logic based on itemId relation
      },
      select: { amount: true, platformCommission: true, netPayout: true }
    })

    const totalGross = paymentOrders.reduce((sum, o) => sum + o.amount, 0)
    const totalNet = paymentOrders.reduce((sum, o) => sum + o.netPayout, 0)
    const platformCut = paymentOrders.reduce((sum, o) => sum + o.platformCommission, 0)

    return NextResponse.json({ totalGross, totalNet, platformCut, pendingPayout: 0 }) // Pending: unpaid netPayout
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 })
  }
}

