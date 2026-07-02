import cron from "node-cron"
import { prisma } from "@/lib/db/prisma"
import { sendAbandonedCartReminder } from "@/lib/email/templates"
import { sendRenewalReminder } from "@/lib/email/templates"
import { sendOnboardingDrip } from "@/lib/email/templates"
import { createNotification } from "@/lib/marketing/notifications"

let cronJob: cron.ScheduledTask | null = null

export function startCronJobs() {
  if (cronJob) {
    console.log("[CRON] Already running")
    return
  }

  if (process.env.NEXT_PHASE === 'build') {
    return
  }

  console.log("[CRON] Starting scheduled jobs...")

  cronJob = cron.schedule("0 * * * *", async () => {
    console.log("[CRON] Running abandoned cart check...")
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
      const abandoned = await prisma.paymentOrder.findMany({
        where: {
          status: "PENDING",
          createdAt: { lt: twoHoursAgo },
        },
      })

      for (const order of abandoned) {
        const member = await prisma.member.findUnique({
          where: { userId: order.userId },
        })

        if (member) {
          await sendAbandonedCartReminder({
            to: member.email,
            name: member.firstName || "there",
            item: `Payment for ${order.type}`,
            amount: `${order.currency} ${order.amount}`,
            resumeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment?order=${order.merchantReference}`,
          })

          await createNotification({
            userId: member.id,
            type: "abandoned_cart",
            message: `Your ${order.type} payment is pending. Complete it now.`,
            data: { orderId: order.id },
          })
        }
      }
    } catch (error) {
      console.error("[CRON] Abandoned cart error:", error)
    }
  })

  cron.schedule("0 8 * * *", async () => {
    console.log("[CRON] Running renewal reminder check...")
    try {
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      const expiring = await prisma.subscription.findMany({
        where: {
          status: "active",
          nextBillingDate: { lte: sevenDaysFromNow },
        },
      })

      for (const sub of expiring) {
        const member = await prisma.member.findUnique({
          where: { userId: sub.userId },
        })

        if (member) {
          await sendRenewalReminder({
            to: member.email,
            name: member.firstName || "there",
            plan: sub.plan,
            renewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions`,
          })

          await createNotification({
            userId: member.id,
            type: "subscription_renewal",
            message: `Your ${sub.plan} subscription renews in 7 days.`,
            data: { subscriptionId: sub.id },
          })
        }
      }
    } catch (error) {
      console.error("[CRON] Renewal reminder error:", error)
    }
  })

  cron.schedule("0 9 * * *", async () => {
    console.log("[CRON] Running onboarding drip check...")
    try {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const day1Users = await prisma.member.findMany({
        where: { joinedAt: { gte: oneDayAgo, lte: oneDayAgo } },
      })

      const day3Users = await prisma.member.findMany({
        where: { joinedAt: { gte: threeDaysAgo, lte: threeDaysAgo } },
      })

      const day7Users = await prisma.member.findMany({
        where: { joinedAt: { gte: sevenDaysAgo, lte: sevenDaysAgo } },
      })

      for (const m of day1Users) {
        await sendOnboardingDrip({
          to: m.email,
          name: m.firstName || "there",
          day: 1,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        })
      }

      for (const m of day3Users) {
        await sendOnboardingDrip({
          to: m.email,
          name: m.firstName || "there",
          day: 3,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        })
      }

      for (const m of day7Users) {
        await sendOnboardingDrip({
          to: m.email,
          name: m.firstName || "there",
          day: 7,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        })
      }
    } catch (error) {
      console.error("[CRON] Onboarding drip error:", error)
    }
  })
}
