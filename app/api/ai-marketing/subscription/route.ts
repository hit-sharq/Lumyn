import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { isFreeLaunch } from "@/lib/pricing"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ hasSubscription: false, plan: null, status: null, freeLaunch: false })
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
      return NextResponse.json({ hasSubscription: false, plan: null, status: null, freeLaunch: await isFreeLaunch() })
    }

    const isActive =
      subscription.status === "active" &&
      (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date())

    return NextResponse.json({
      hasSubscription: isActive,
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      freeLaunch: await isFreeLaunch(),
    })
  } catch (error) {
    console.error("Subscription check error:", error)
    return NextResponse.json({ hasSubscription: false, plan: null, status: null, freeLaunch: false })
  }
}
