import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress || ""

    const body = await request.json()
    const { plan, paymentOrderId } = body

    if (!plan || !["creator_pro", "job_unlimited"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        userEmail: email, // Store for records
        plan,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        paymentOrderId,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error: any) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id, status } = body

    if (!id || !["cancelled", "expired"].includes(status || "")) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const subscription = await prisma.subscription.updateMany({
      where: { 
        id, 
        userId 
      },
      data: { status }
    })

    return NextResponse.json({ updated: subscription.count > 0 }, { status: subscription.count > 0 ? 200 : 404 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}

