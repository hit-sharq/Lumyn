import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const creator = await prisma.marketCreatorProfile.findUnique({
      where: { userId },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { purchases: true } } },
        },
      },
    })

    return NextResponse.json(creator)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch creator profile" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ""

    const body = await request.json()
    const { displayName, bio, website, twitter } = body

    const creator = await prisma.marketCreatorProfile.upsert({
      where: { userId },
      create: { userId, userEmail, displayName, bio, website, twitter },
      update: { displayName, bio, website, twitter },
    })

    return NextResponse.json(creator)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update creator profile" }, { status: 500 })
  }
}
