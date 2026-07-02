import { prisma } from "@/lib/db/prisma"

export function generatePartnerCode(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20)
  const suffix = Math.random().toString(36).slice(2, 6)
  return `PTR_${slug}_${suffix}`.toUpperCase()
}

export async function trackPartnerClick(partnerCode: string) {
  const partner = await prisma.partner.findFirst({
    where: {
      OR: [
        { id: partnerCode },
        { name: { contains: partnerCode } },
      ],
    },
  })

  if (!partner) return null

  await prisma.partner.update({
    where: { id: partner.id },
    data: { clicks: { increment: 1 } },
  })

  return partner
}

export async function trackPartnerConversion({
  partnerId,
  userId,
  type,
  referenceId,
  amount,
  commission,
  metadata,
}: {
  partnerId: string
  userId?: string
  type: string
  referenceId?: string
  amount?: number
  commission?: number
  metadata?: Record<string, any>
}) {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
  })

  if (!partner) return null

  await prisma.partnerConversion.create({
    data: {
      partnerId,
      userId,
      type,
      referenceId,
      amount,
      commission,
      metadata,
    },
  })

  await prisma.partner.update({
    where: { id: partnerId },
    data: {
      conversions: { increment: 1 },
      revenue: { increment: amount || 0 },
    },
  })

  return partner
}

export async function getPartnerStats(partnerId: string) {
  const [partner, conversions] = await Promise.all([
    prisma.partner.findUnique({
      where: { id: partnerId },
    }),
    prisma.partnerConversion.findMany({
      where: { partnerId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  if (!partner) return null

  const totalRevenue = conversions.reduce((sum, c) => sum + (c.amount || 0), 0)
  const totalCommission = conversions.reduce((sum, c) => sum + (c.commission || 0), 0)

  return {
    partner,
    conversions,
    stats: {
      clicks: partner.clicks,
      conversions: partner.conversions,
      revenue: totalRevenue,
      commission: totalCommission,
      conversionRate: partner.clicks > 0 ? ((partner.conversions / partner.clicks) * 100).toFixed(2) : 0,
    },
  }
}
