import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const action = request.nextUrl.searchParams.get("action")

    if (action === "list") {
      const proposals = await prisma.internalSalesProposal.findMany({
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(proposals)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Proposal action GET error:", error)
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
    if (!adminIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const action = request.nextUrl.searchParams.get("action")

    if (action === "approve") {
      const id = request.nextUrl.searchParams.get("id")
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 })
      }

      await prisma.internalSalesProposal.update({
        where: { id },
        data: { isApprovedBySales: true },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Proposal action POST error:", error)
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 })
  }
}
