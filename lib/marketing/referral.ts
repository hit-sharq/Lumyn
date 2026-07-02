import { prisma } from "@/lib/db/prisma"
import { v4 as uuidv4 } from "uuid"

export function generateReferralCode(): string {
  return "LUM" + uuidv4().split("-")[0].toUpperCase().slice(0, 8)
}

export async function getOrCreateReferralCode(memberId: string): Promise<string> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { referralCode: true },
  })

  if (member?.referralCode) {
    return member.referralCode
  }

  const code = generateReferralCode()
  await prisma.member.update({
    where: { id: memberId },
    data: { referralCode: code },
  })

  return code
}

export async function getReferralStats(memberId: string) {
  const [referralsSent, referralsReceived] = await Promise.all([
    prisma.referral.count({
      where: { referrerId: memberId },
    }),
    prisma.referral.count({
      where: { referredId: memberId },
    }),
  ])

  const rewardsEarned = await prisma.referral.count({
    where: {
      OR: [{ referrerId: memberId }, { referredId: memberId }],
      rewardGiven: true,
    },
  })

  return {
    referralsSent,
    referralsReceived,
    rewardsEarned,
  }
}

export async function createReferral({
  referrerId,
  referredEmail,
}: {
  referrerId: string
  referredEmail: string
}) {
  const existing = await prisma.member.findUnique({
    where: { email: referredEmail },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "User not found" }
  }

  if (existing.id === referrerId) {
    return { success: false, error: "Cannot refer yourself" }
  }

  const existingReferral = await prisma.referral.findUnique({
    where: { referredId: existing.id },
  })

  if (existingReferral) {
    return { success: false, error: "User already referred" }
  }

  const code = await getOrCreateReferralCode(referrerId)

  await prisma.member.update({
    where: { id: existing.id },
    data: { referredBy: referrerId },
  })

  const referral = await prisma.referral.create({
    data: {
      referrerId,
      referredId: existing.id,
      referralCode: code,
      status: "pending",
    },
  })

  return { success: true, referral, code }
}

export async function markReferralCompleted(referredId: string) {
  const referral = await prisma.referral.findUnique({
    where: { referredId },
    include: { referrer: true },
  })

  if (!referral || referral.status === "completed") {
    return { success: false, error: "No pending referral" }
  }

  await prisma.referral.update({
    where: { referredId },
    data: { status: "completed" },
  })

  return { success: true, referral }
}

export async function giveReferralReward(referredId: string, rewardType: "featured_job" | "creator_pro_extension") {
  const referral = await prisma.referral.findUnique({
    where: { referredId },
  })

  if (!referral || referral.rewardGiven) {
    return { success: false, error: "Reward already given or no referral" }
  }

  await prisma.referral.update({
    where: { referredId },
    data: { rewardGiven: true, rewardType },
  })

  return { success: true }
}
