import { prisma } from "@/lib/db/prisma"

const AT_USERNAME = process.env.AFRICASTALKING_USERNAME || "sandbox"
const AT_API_KEY = process.env.AFRICASTALKING_API_KEY

export async function sendSms({
  to,
  message,
  senderId,
  reference,
}: {
  to: string
  message: string
  senderId?: string
  reference?: string
}) {
  const log = await prisma.smsLog.create({
    data: {
      recipient: to,
      message,
      senderId: senderId || process.env.AFRICASTALKING_SENDER_ID || "LUMYN",
      status: "pending",
    },
  })

  if (!AT_API_KEY) {
    console.log(`[SMS] ${message} → ${to}`)
    await prisma.smsLog.update({
      where: { id: log.id },
      data: { status: "skipped", sentAt: new Date() },
    })
    return { success: true, skipped: true, id: log.id }
  }

  try {
    const response = await fetch(
      `https://api.africastalking.com/version1/messaging`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "apiKey": AT_API_KEY,
        },
        body: new URLSearchParams({
          username: AT_USERNAME,
          to: to,
          message: message,
          from: senderId || process.env.AFRICASTALKING_SENDER_ID || "LUMYN",
          reference: reference || log.id,
        }),
      }
    )

    const data = await response.json()

    if (data.SMSMessageData?.Recipients?.[0]?.status === "Success") {
      await prisma.smsLog.update({
        where: { id: log.id },
        data: { status: "sent", sentAt: new Date() },
      })
      return { success: true, id: log.id }
    } else {
      const errorMsg = data.SMSMessageData?.Recipients?.[0]?.status || "Unknown error"
      await prisma.smsLog.update({
        where: { id: log.id },
        data: { status: "failed", error: errorMsg },
      })
      return { success: false, error: errorMsg, id: log.id }
    }
  } catch (error: any) {
    await prisma.smsLog.update({
      where: { id: log.id },
      data: { status: "failed", error: error.message },
    })
    console.error("SMS send error:", error)
    return { success: false, error: error.message, id: log.id }
  }
}

export async function sendBulkSms({
  recipients,
  message,
  senderId,
}: {
  recipients: string[]
  message: string
  senderId?: string
}) {
  const results = await Promise.allSettled(
    recipients.map((to) => sendSms({ to, message, senderId }))
  )
  return results
}
