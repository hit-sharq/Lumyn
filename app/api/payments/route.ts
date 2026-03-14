import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { submitOrder, registerIPN } from "@/lib/pesapal"
import { prisma } from "@/lib/db/prisma"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress || ""
    const firstName = user?.firstName || "Customer"
    const lastName = user?.lastName || ""

    const body = await request.json()
    const { type, itemId, amount, currency = "KES", description } = body

    if (!type || !itemId || !amount) {
      return NextResponse.json({ error: "Missing required fields: type, itemId, amount" }, { status: 400 })
    }

    if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 })
    }

    const merchantReference = randomUUID()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000")

    const callbackUrl = `${appUrl}/payment/callback?type=${type}&itemId=${itemId}&ref=${merchantReference}`

    let ipnId = process.env.PESAPAL_IPN_ID || ""
    if (!ipnId) {
      try { ipnId = await registerIPN() } catch { ipnId = "" }
    }

    const result = await submitOrder({
      id: merchantReference,
      currency,
      amount: parseFloat(amount),
      description: description || `Lumyn payment for ${type}`,
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: { email_address: email, first_name: firstName, last_name: lastName },
    })

    // Calculate commission (20%)
    const commissionRate = type === 'job_post' ? 1.0 : 0.2
    const commission = parseFloat(amount) * commissionRate
    const netPayout = parseFloat(amount) * (1 - commissionRate)

    await prisma.paymentOrder.create({
      data: {
        merchantReference,
        orderTrackingId: result.order_tracking_id,
        userId,
        userEmail: email,
        type,
        itemId,
        amount: parseFloat(amount),
        platformCommission: commission,
        netPayout,
        currency,
        status: "PENDING",
      },
    })

    return NextResponse.json({
      redirect_url: result.redirect_url,
      order_tracking_id: result.order_tracking_id,
      merchant_reference: merchantReference,
    })
  } catch (error: any) {
    console.error("Payment initiation error:", error)
    return NextResponse.json({ error: error.message || "Payment initiation failed" }, { status: 500 })
  }
}
