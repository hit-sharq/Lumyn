import { prisma } from "@/lib/db/prisma"

export type PricingPhase = "FREE_LAUNCH" | "PAID"

const TTL_MS = 30_000
let cache: { phase: PricingPhase; ts: number } | null = null

export function invalidatePricingCache() {
  cache = null
}

export async function getSystemConfig() {
  return prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, pricingPhase: "FREE_LAUNCH" },
  })
}

export async function getPricingPhase(): Promise<PricingPhase> {
  if (cache && Date.now() - cache.ts < TTL_MS) return cache.phase
  const config = await prisma.systemConfig.findUnique({ where: { id: 1 } })
  const phase = (config?.pricingPhase as PricingPhase) ?? "FREE_LAUNCH"
  cache = { phase, ts: Date.now() }
  return phase
}

export async function isFreeLaunch(): Promise<boolean> {
  return (await getPricingPhase()) === "FREE_LAUNCH"
}
