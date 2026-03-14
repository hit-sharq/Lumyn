import { type NextRequest, NextResponse } from "next/server"
import { getTransactionStatus } from "@/lib/pesapal"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const orderTrackingId = searchParams.get("orderTrackingId")
    const merchantReference = searchParams.get("ref")

    if (!orderTrackingId && !merchantReference) {
      return NextResponse.json({ error: "Missing order reference" }, { status: 400 })
    }

    const order = await prisma.paymentOrder.findFirst({
      where: orderTrackingId ? { orderTrackingId } : { merchantReference: merchantReference! },
    })

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    if (order.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    if (order.status === "COMPLETED") {
      return NextResponse.json({ status: "COMPLETED", order })
    }

    const pesapalStatus = await getTransactionStatus(order.orderTrackingId)
    const isPaid = pesapalStatus.payment_status_description === "Completed" || pesapalStatus.status_code === 1

    if (isPaid && order.status !== "COMPLETED") {
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          paymentMethod: pesapalStatus.payment_method,
          confirmationCode: pesapalStatus.confirmation_code,
        },
      })
    }

    return NextResponse.json({
      status: isPaid ? "COMPLETED" : pesapalStatus.payment_status_description,
      order,
      pesapalStatus,
    })
  } catch (error) {
    console.error("Payment status error:", error)
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 })
  }
}
