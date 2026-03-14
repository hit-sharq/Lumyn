import { type NextRequest, NextResponse } from "next/server"
import { getTransactionStatus } from "@/lib/pesapal"
import { prisma } from "@/lib/db/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderTrackingId = searchParams.get("OrderTrackingId") || searchParams.get("orderTrackingId")
    const merchantReference = searchParams.get("OrderMerchantReference") || searchParams.get("merchantReference")

    if (!orderTrackingId) {
      return NextResponse.json({ error: "Missing OrderTrackingId" }, { status: 400 })
    }

    const status = await getTransactionStatus(orderTrackingId)

    const order = await prisma.paymentOrder.findFirst({
      where: { orderTrackingId },
    })

    if (!order) {
      return NextResponse.json({ orderNotificationType: "IPNCHANGE", orderTrackingId, orderMerchantReference: merchantReference, status: 200 })
    }

    const isPaid = status.payment_status_description === "Completed" || status.status_code === 1

    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: isPaid ? "COMPLETED" : status.payment_status_description,
        paymentMethod: status.payment_method,
        confirmationCode: status.confirmation_code,
      },
    })

    if (isPaid) {
      await fulfillOrder(order.type, order.itemId, order.userId, order.userEmail, order.amount)
    }

    return NextResponse.json({ orderNotificationType: "IPNCHANGE", orderTrackingId, orderMerchantReference: merchantReference, status: 200 })
  } catch (error) {
    console.error("IPN error:", error)
    return NextResponse.json({ error: "IPN processing failed" }, { status: 500 })
  }
}

async function fulfillOrder(type: string, itemId: string, userId: string, userEmail: string, amount: number) {
  try {
    if (type === "studio_template") {
      await prisma.studioPurchase.upsert({
        where: { userId_templateId: { userId, templateId: itemId } },
        create: { userId, userEmail, templateId: itemId, amount },
        update: { amount },
      })
      await prisma.studioTemplate.update({
        where: { id: itemId },
        data: { downloadCount: { increment: 1 } },
      })
    }

    if (type === "market_product") {
      await prisma.marketPurchase.upsert({
        where: { userId_productId: { userId, productId: itemId } },
        create: { userId, userEmail, productId: itemId, amount },
        update: { amount },
      })
      await prisma.marketProduct.update({
        where: { id: itemId },
        data: { salesCount: { increment: 1 } },
      })
    }

    if (type === "job_post") {
      await prisma.paidJobPost.update({
        where: { id: itemId },
        data: { isPaid: true, isPublished: true },
      })
    }
  } catch (error) {
    console.error("Order fulfillment error:", error)
  }
}
