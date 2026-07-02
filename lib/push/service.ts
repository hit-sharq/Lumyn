import { prisma } from "@/lib/db/prisma"

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY

export async function sendPushNotification({
  userId,
  title,
  message,
  data,
  url,
}: {
  userId: string
  title: string
  message: string
  data?: Record<string, any>
  url?: string
}) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId, enabled: true },
  })

  if (subscriptions.length === 0) {
    return { success: true, sent: 0 }
  }

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
    console.log(`[PUSH] ${title} → ${userId}`)
    return { success: true, sent: 0, skipped: true }
  }

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_external_user_ids: [userId],
        headings: { en: title },
        contents: { en: message },
        data: data || {},
        url: url || process.env.NEXT_PUBLIC_APP_URL,
      }),
    })

    const result = await response.json()

    if (result.errors) {
      console.error("OneSignal error:", result.errors)
      return { success: false, error: result.errors, sent: 0 }
    }

    return { success: true, sent: result.recipients || 0 }
  } catch (error: any) {
    console.error("Push notification error:", error)
    return { success: false, error: error.message, sent: 0 }
  }
}

export async function sendBulkPush({
  userIds,
  title,
  message,
  data,
  url,
}: {
  userIds: string[]
  title: string
  message: string
  data?: Record<string, any>
  url?: string
}) {
  const results = await Promise.allSettled(
    userIds.map((uid) => sendPushNotification({ userId: uid, title, message, data, url }))
  )
  return results
}
