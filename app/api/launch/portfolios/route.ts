import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const portfolios = await prisma.launchPortfolio.findMany({
      where: { userId },
      include: { projects: { orderBy: { order: "asc" } } },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(portfolios)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ""

    const body = await request.json()
    const { username, displayName, templateId, title, about, skills, socialLinks, avatarUrl } = body

    if (!username || !displayName || !templateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existing = await prisma.launchPortfolio.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    const portfolio = await prisma.launchPortfolio.create({
      data: {
        userId,
        userEmail,
        username: username.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        displayName,
        templateId,
        title,
        about,
        skills: skills || [],
        socialLinks: socialLinks || {},
        avatarUrl,
      },
      include: { projects: true },
    })

    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error("Launch portfolio POST error:", error)
    return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 })
  }
}
