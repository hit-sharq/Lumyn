import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ hasSubscription: false, plan: null, status: null })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        plan: "ai_marketing_pro",
        status: "active",
      },
      orderBy: { createdAt: "desc" },
    })

    if (!subscription) {
      return NextResponse.json({ hasSubscription: false, plan: null, status: null })
    }

    const isActive =
      subscription.status === "active" &&
      (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date())

    return NextResponse.json({
      hasSubscription: isActive,
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    })
  } catch (error) {
    console.error("Subscription check error:", error)
    return NextResponse.json({ hasSubscription: false, plan: null, status: null })
  }
}
