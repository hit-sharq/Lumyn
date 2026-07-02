import { type NextRequest, NextResponse } from "next/server"
import { getTransactionStatus } from "@/lib/pesapal"
import { prisma } from "@/lib/db/prisma"
import { autoPostJobToSocial } from "@/lib/marketing/social"

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
