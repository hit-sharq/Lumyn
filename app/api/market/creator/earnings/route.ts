import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const creatorProfile = await prisma.marketCreatorProfile.findUnique({
      where: { userId },
      select: { id: true }
    })

    if (!creatorProfile) return NextResponse.json({ totalGross: 0, totalNet: 0, platformCut: 0, pendingPayout: 0 })

    const paymentOrders = await prisma.paymentOrder.findMany({
      where: {
        status: "COMPLETED",
        type: "market_product",
        itemId: {
          in: await prisma.marketPurchase.groupBy({
            by: ['productId'],
            where: {
              product: { creatorId: creatorProfile.id }
            },
            _count: { id: true }
          }).then(groups => groups.map(g => g.productId))
        }
      },
      select: { amount: true, platformCommission: true, netPayout: true }
    })

    const totalGross = paymentOrders.reduce((sum, o) => sum + o.amount, 0)
    const totalNet = paymentOrders.reduce((sum, o) => sum + o.netPayout, 0)
    const platformCut = paymentOrders.reduce((sum, o) => sum + o.platformCommission, 0)

    return NextResponse.json({ totalGross, totalNet, platformCut, pendingPayout: 0 })
  } catch (error) {
    console.error("Earnings error:", error)
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 })
  }
}

