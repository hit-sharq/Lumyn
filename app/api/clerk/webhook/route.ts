import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyHmac } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET
    if (!secret) {
      console.error("[clerk-webhook] Missing CLERK_WEBHOOK_SECRET")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const svixId = request.headers.get("svix-id")
    const svixTimestamp = request.headers.get("svix-timestamp")
    const svixSignature = request.headers.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
    }

    const raw = await request.text()
    const message = `${svixId}.${svixTimestamp}.${raw}`

    const valid = await verifyHmac({
      payload: message,
      secret,
      signature: svixSignature,
      algorithm: "SHA-256",
    })

    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    }

    const event = JSON.parse(raw)
    const eventType = event.type

    if (eventType === "user.created" || eventType === "user.updated") {
      const clerkUser = event.data
      const email = clerkUser.email_addresses?.find((e: any) => e.primary)?.email_address || clerkUser.email_addresses?.[0]?.email_address
      const firstName = clerkUser.first_name || ""
      const lastName = clerkUser.last_name || ""
      const phone = clerkUser.phone_numbers?.find((p: any) => p.primary)?.phone_number || clerkUser.phone_numbers?.[0]?.phone_number || null
      const clerkUserId = clerkUser.id

      if (!email) {
        return NextResponse.json({ error: "User has no email" }, { status: 400 })
      }

      if (eventType === "user.created") {
        await prisma.member.create({
          data: {
            email,
            firstName,
            lastName,
            phone,
            userId: clerkUserId,
            joinedAt: new Date(clerkUser.created_at),
          },
        })
      } else if (eventType === "user.updated") {
        await prisma.member.upsert({
          where: { userId: clerkUserId },
          update: {
            email,
            firstName,
            lastName,
            phone,
          },
          create: {
            email,
            firstName,
            lastName,
            phone,
            userId: clerkUserId,
            joinedAt: new Date(clerkUser.created_at),
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[clerk-webhook] Error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
