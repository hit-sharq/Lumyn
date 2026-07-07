import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { sendEmail } from "@/lib/email/service"
import { isAdminUser } from "@/lib/admin"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { reply } = body

    if (!reply || !reply.trim()) {
      return NextResponse.json({ error: "Reply is required" }, { status: 400 })
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: params.id },
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: "Service request not found" }, { status: 404 })
    }

    const updated = await prisma.serviceRequest.update({
      where: { id: params.id },
      data: {
        reply,
        status: "replied",
        repliedAt: new Date(),
        repliedById: userId,
      },
    })

    // Send reply email to user
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lumyn.com"
    await sendEmail({
      to: serviceRequest.userEmail,
      subject: `Re: Your Service Request - ${serviceRequest.serviceType}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0a0a0a; margin-bottom: 16px;">We received your service request</h2>
          <p style="color: #64748b; line-height: 1.6;">Hi ${serviceRequest.userName || "there"},</p>
          <p style="color: #64748b; line-height: 1.6;">
            Thank you for reaching out about our <strong>${serviceRequest.serviceType}</strong> service.
          </p>
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">Your message:</p>
            <p style="color: #334155; line-height: 1.6;">${serviceRequest.message}</p>
          </div>
          <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 16px; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">Our reply:</p>
            <p style="color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${reply}</p>
          </div>
          <p style="color: #64748b; line-height: 1.6;">
            If you have any questions, just reply to this email or contact us at ${process.env.SMTP_FROM || "support@lumyn.com"}.
          </p>
          <p style="color: #64748b; line-height: 1.6; margin-top: 24px;">
            Best regards,<br />
            Lumyn Team
          </p>
        </div>
      `,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Service request reply error:", error)
    return NextResponse.json({ error: "Failed to reply" }, { status: 500 })
  }
}
