import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import { sendEmail } from "@/lib/email/service"
import { isAdminUser } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {}
    if (status) {
      where.status = status
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(requests)
  } catch (error: any) {
    console.error("Service requests GET error:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, userName, serviceType, budget, timeline, message, userId } = body

    if (!userEmail || !serviceType || !message) {
      return NextResponse.json(
        { error: "Missing required fields: userEmail, serviceType, message" },
        { status: 400 }
      )
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId,
        userEmail,
        userName,
        serviceType,
        budget,
        timeline,
        message,
      },
    })

    // Notify admin about new request
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Service Request: ${serviceType}`,
        html: `
          <h1>New Service Request</h1>
          <p><strong>From:</strong> ${userName || userEmail}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Service:</strong> ${serviceType}</p>
          <p><strong>Budget:</strong> ${budget || "Not specified"}</p>
          <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/service-requests">View in Admin Panel</a></p>
        `,
      })
    }

    return NextResponse.json(serviceRequest, { status: 201 })
  } catch (error: any) {
    console.error("Service request POST error:", error)
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 })
  }
}
