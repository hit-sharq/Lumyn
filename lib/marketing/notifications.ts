import { prisma } from "@/lib/db/prisma"
import { sendPushNotification } from "@/lib/push/service"

export async function createNotification({
  userId,
  type,
  message,
  data,
}: {
  userId: string
  type: string
  message: string
  data?: Record<string, any>
}) {
  const notification = await prisma.notification.create({
    data: { userId, type, message, data },
  })

  const subs = await prisma.pushSubscription.findMany({
    where: { userId, enabled: true },
  })

  if (subs.length > 0) {
    await sendPushNotification({
      userId,
      title: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      message,
      data,
    })
  }

  return notification
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  })
}

export async function getNotifications(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function markAsRead(id: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification || notification.userId !== userId) {
    return null
  }

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  })
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })
}
