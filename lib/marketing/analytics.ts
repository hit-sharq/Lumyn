import { prisma } from "@/lib/db/prisma"

export async function trackEvent({
  event,
  userId,
  properties,
}: {
  event: string
  userId?: string
  properties?: Record<string, any>
}) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", event, properties)
  }

  console.log(`[ANALYTICS] ${event}`, { userId, properties })
}

export async function trackPurchase({
  userId,
  transactionId,
  value,
  currency,
  items,
}: {
  userId?: string
  transactionId: string
  value: number
  currency?: string
  items?: Array<{ item_name: string; item_id: string; price: number }>
}) {
  await trackEvent({
    event: "purchase",
    userId,
    properties: {
      transaction_id: transactionId,
      value,
      currency: currency || "KES",
      items,
    },
  })
}

export async function trackSignUp(userId: string, method: string) {
  await trackEvent({
    event: "sign_up",
    userId,
    properties: { method },
  })
}

export async function trackJobPostCreated(userId: string, jobId: string) {
  await trackEvent({
    event: "job_post_created",
    userId,
    properties: { job_id: jobId },
  })
}

export async function trackTemplatePurchased(userId: string, templateId: string, amount: number) {
  await trackEvent({
    event: "template_purchased",
    userId,
    properties: { template_id: templateId, amount },
  })
}

export async function getAdminAnalytics() {
  const [
    totalRevenue,
    newSignups,
    activeSubscriptions,
    topTemplates,
    topTemplatesByPurchases,
    topJobPosts,
    conversionRate,
  ] = await Promise.all([
    prisma.paymentOrder.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.member.count(),
    prisma.subscription.count({
      where: { status: "active" },
    }),
    prisma.studioTemplate.findMany({
      orderBy: { downloadCount: "desc" },
      take: 5,
      select: { id: true, title: true, downloadCount: true },
    }),
    prisma.studioPurchase.groupBy({
      by: ["templateId"],
      _count: { id: true },
      _sum: { amount: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }).then(async (grouped) => {
      const ids = grouped.map((g) => g.templateId)
      const templates = await prisma.studioTemplate.findMany({
        where: { id: { in: ids } },
        select: { id: true, title: true },
      })
      const map = new Map(templates.map((t) => [t.id, t.title]))
      return grouped.map((g) => ({
        ...g,
        title: map.get(g.templateId) || "Unknown",
      }))
    }),
    prisma.paidJobPost.findMany({
      where: { isPaid: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, jobTitle: true, companyName: true, createdAt: true },
    }),
    prisma.paymentOrder.count({
      where: { status: "COMPLETED" },
    }).then((completed) =>
      prisma.paymentOrder.count().then((total) => ({
        completed,
        total,
        rate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
      }))
    ),
  ])

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    newSignups,
    activeSubscriptions,
    topTemplates,
    topJobPosts,
    conversionRate,
    topTemplatesByPurchases: (topTemplatesByPurchases as Array<{ templateId: string; title: string; _count: { id: number }; _sum: { amount: number | null } }>).map((t) => ({
      id: t.templateId,
      title: t.title,
      downloadCount: 0,
      purchases: t._count.id,
      revenue: t._sum.amount || 0,
    })),
  }
}
