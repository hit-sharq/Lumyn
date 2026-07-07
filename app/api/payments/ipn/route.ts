import { type NextRequest, NextResponse } from "next/server"
import { getTransactionStatus } from "@/lib/pesapal"
import { prisma } from "@/lib/db/prisma"
import { autoPostJobToSocial } from "@/lib/marketing/social"
import { verifyHmac } from "@/lib/security"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  return handleIPN(request)
}

export async function POST(request: NextRequest) {
  return handleIPN(request)
}

async function handleIPN(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const orderTrackingId =
      searchParams.get("OrderTrackingId") || searchParams.get("orderTrackingId")
    const merchantReference =
      searchParams.get("OrderMerchantReference") || searchParams.get("ref")

    if (!orderTrackingId) {
      return NextResponse.json({ error: "Missing OrderTrackingId" }, { status: 400 })
    }

    const order = await prisma.paymentOrder.findFirst({
      where: orderTrackingId
        ? { orderTrackingId }
        : { merchantReference: merchantReference! },
    })

    if (!order) {
      return NextResponse.json({ orderNotFound: true }, { status: 200 })
    }

    if (order.status === "COMPLETED") {
      return NextResponse.json({ status: "already_completed" }, { status: 200 })
    }

    // verify IPN authenticity using configured secret
    const incomingSecret = request.nextUrl.searchParams.get("ipn_secret") || request.headers.get("x-ipn-secret")
    if (process.env.PESAPAL_IPN_SECRET) {
      // prefer HMAC-style verification when provider supplies a signature header
      const sigHeader = request.headers.get('x-pesapal-signature') || request.headers.get('x-hub-signature') || request.headers.get('x-signature')
      if (sigHeader) {
        const raw = await request.text()
        const ok = await verifyHmac({ payload: raw, secret: process.env.PESAPAL_IPN_SECRET, signature: sigHeader })
        if (!ok) {
          console.warn('IPN HMAC signature mismatch')
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      } else if (incomingSecret !== process.env.PESAPAL_IPN_SECRET) {
        console.warn('IPN secret mismatch')
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const pesapalStatus = await getTransactionStatus(orderTrackingId)
    const isPaid =
      pesapalStatus.payment_status_description === "Completed" ||
      pesapalStatus.status_code === 1

    if (isPaid) {
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          paymentMethod: pesapalStatus.payment_method,
          confirmationCode: pesapalStatus.confirmation_code,
        },
      })

      if (order.type === "studio_template") {
        const existing = await prisma.studioPurchase.findUnique({
          where: {
            userId_templateId: { userId: order.userId, templateId: order.itemId },
          },
        })
        if (!existing) {
          await prisma.studioPurchase.create({
            data: {
              userId: order.userId,
              userEmail: order.userEmail,
              templateId: order.itemId,
              amount: order.amount,
            },
          })
          await prisma.studioTemplate.update({
            where: { id: order.itemId },
            data: { downloadCount: { increment: 1 } },
          })
        }
      }

      if (order.type === "ai_marketing_subscription") {
        const periodEnd = new Date()
        periodEnd.setMonth(periodEnd.getMonth() + 1)

        await prisma.subscription.upsert({
          where: {
            userId_plan: {
              userId: order.userId,
              plan: "ai_marketing_pro",
            },
          },
          create: {
            userId: order.userId,
            plan: "ai_marketing_pro",
            status: "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd: periodEnd,
            nextBillingDate: periodEnd,
            paymentOrderId: order.id,
          },
          update: {
            status: "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd: periodEnd,
            nextBillingDate: periodEnd,
            paymentOrderId: order.id,
          },
        })
      }

      if (order.type === "job_post") {
        const job = await prisma.paidJobPost.findUnique({
          where: { id: order.itemId },
        })

        if (job) {
          await prisma.paidJobPost.update({
            where: { id: job.id },
            data: {
              isPaid: true,
              isPublished: true,
            },
          })

          if (job.isFeatured) {
            setTimeout(async () => {
              await autoPostJobToSocial(job.id, {
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                location: job.location,
                applicationUrl: job.applicationUrl || undefined,
              })
            }, 1000)
          }
        }
      }
    }

    return NextResponse.json(
      { status: isPaid ? "COMPLETED" : "PENDING" },
      { status: 200 }
    )
  } catch (error) {
    console.error("IPN handler error:", error)
    return NextResponse.json({ error: "IPN processing failed" }, { status: 500 })
  }
}
