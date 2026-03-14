import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!["active", "cancelled", "expired"].includes(status || "")) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(subscription)
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}

