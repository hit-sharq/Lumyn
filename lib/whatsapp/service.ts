import { prisma } from "@/lib/db/prisma"

const AT_USERNAME = process.env.AFRICASTALKING_USERNAME || "sandbox"
const AT_API_KEY = process.env.AFRICASTALKING_API_KEY

export async function sendWhatsApp({
  to,
  message,
}: {
  to: string
  message: string
}) {
  if (!AT_API_KEY) {
    console.log(`[WHATSAPP] ${message} → ${to}`)
    return { success: true, skipped: true }
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
          from: process.env.AFRICASTALKING_WHATSAPP_SENDER_ID || "LUMYN",
        }),
      }
    )

    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    console.error("WhatsApp send error:", error)
    return { success: false, error: error.message }
  }
}

export async function sendWhatsAppSupportAutoReply({
  to,
  userName,
}: {
  to: string
  userName?: string
}) {
  const message = `Hi ${userName || "there"}, thanks for contacting Lumyn Support. Our team will get back to you within 24 hours. For urgent issues, email support@lumyn.com.`

  return sendWhatsApp({ to, message })
}

export async function sendWeeklyJobDigest({
  to,
  jobs,
}: {
  to: string
  jobs: Array<{ title: string; company: string; location: string; applyUrl: string }>
}) {
  let message = `Lumyn Weekly Job Digest\n\n`
  jobs.slice(0, 5).forEach((job, i) => {
    message += `${i + 1}. ${job.title} at ${job.company} (${job.location})\n   Apply: ${job.applyUrl}\n\n`
  })
  message += `Browse all jobs: ${process.env.NEXT_PUBLIC_APP_URL}/hire`

  return sendWhatsApp({ to, message })
}
