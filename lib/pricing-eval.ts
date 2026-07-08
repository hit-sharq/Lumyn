import { prisma } from "@/lib/db/prisma"
import { FREE_LAUNCH_THRESHOLDS } from "./pricing-config"
import { getSystemConfig, invalidatePricingCache, type PricingPhase } from "./pricing"

// Best-effort counters: a missing SystemConfig table (e.g. migration not yet
// applied) must never break the free-launch flow, only disable auto-flip.
export async function recordJobPost(): Promise<void> {
  try {
    await prisma.systemConfig.upsert({
      where: { id: 1 },
      update: { jobPostCount: { increment: 1 } },
      create: { id: 1, jobPostCount: 1, pricingPhase: "FREE_LAUNCH" },
    })
    await evaluateLaunchPricing()
  } catch {
    /* table missing or DB error — free launch still proceeds */
  }
}

export async function recordAIGeneration(): Promise<void> {
  try {
    await prisma.systemConfig.upsert({
      where: { id: 1 },
      update: { aiGenerationCount: { increment: 1 } },
      create: { id: 1, aiGenerationCount: 1, pricingPhase: "FREE_LAUNCH" },
    })
    await evaluateLaunchPricing()
  } catch {
    /* table missing or DB error — free launch still proceeds */
  }
}

// Flips FREE_LAUNCH -> PAID once BOTH thresholds are met. Runs automatically.
export async function evaluateLaunchPricing(): Promise<PricingPhase> {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { id: 1 } })
    if (!config || config.pricingPhase === "PAID") {
      return (config?.pricingPhase as PricingPhase) ?? "FREE_LAUNCH"
    }

    const reachedJobPosts = config.jobPostCount >= FREE_LAUNCH_THRESHOLDS.jobPosts
    const reachedAiGenerations =
      config.aiGenerationCount >= FREE_LAUNCH_THRESHOLDS.aiGenerations

    if (reachedJobPosts && reachedAiGenerations) {
      await prisma.systemConfig.update({
        where: { id: 1 },
        data: { pricingPhase: "PAID", freeLaunchEndedAt: new Date() },
      })
      invalidatePricingCache()
      return "PAID"
    }

    return "FREE_LAUNCH"
  } catch {
    return "FREE_LAUNCH"
  }
}

export { getSystemConfig }
