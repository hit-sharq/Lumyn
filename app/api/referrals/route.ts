import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import {
  createReferral,
  getReferralStats,
  getOrCreateReferralCode,
  markReferralCompleted,
  giveReferralReward,
} from "@/lib/marketing/referral"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { userId },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const [code, stats, referrals] = await Promise.all([
      getOrCreateReferralCode(member.id),
      getReferralStats(member.id),
      prisma.referral.findMany({
        where: { OR: [{ referrerId: member.id }, { referredId: member.id }] },
        include: {
          referrer: { select: { firstName: true, lastName: true, email: true } },
          referred: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return NextResponse.json({ code, stats, referrals })
  } catch (error: any) {
    console.error("Referrals GET error:", error)
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { userId },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const body = await request.json()
    const { referredEmail } = body

    if (!referredEmail) {
      return NextResponse.json({ error: "Missing referredEmail" }, { status: 400 })
    }

    const result = await createReferral({
      referrerId: member.id,
      referredEmail,
    })

    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  } catch (error: any) {
    console.error("Referrals POST error:", error)
    return NextResponse.json({ error: "Failed to create referral" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { userId },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const body = await request.json()
    const { action, referredId, rewardType } = body

    if (action === "complete" && referredId) {
      const result = await markReferralCompleted(referredId)
      return NextResponse.json(result)
    }

    if (action === "reward" && referredId && rewardType) {
      const result = await giveReferralReward(referredId, rewardType)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Referrals PATCH error:", error)
    return NextResponse.json({ error: "Failed to update referral" }, { status: 500 })
  }
}
