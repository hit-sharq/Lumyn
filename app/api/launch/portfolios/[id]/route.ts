import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const portfolio = await prisma.launchPortfolio.findUnique({
      where: { id: params.id },
      include: { projects: { orderBy: { order: "asc" } } },
    })
    if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(portfolio)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const portfolio = await prisma.launchPortfolio.findUnique({ where: { id: params.id } })
    if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (portfolio.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()

    const updated = await prisma.launchPortfolio.update({
      where: { id: params.id },
      data: {
        displayName: body.displayName,
        title: body.title,
        about: body.about,
        skills: body.skills || [],
        socialLinks: body.socialLinks || {},
        avatarUrl: body.avatarUrl,
        isPublished: body.isPublished,
        templateId: body.templateId,
      },
      include: { projects: { orderBy: { order: "asc" } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const portfolio = await prisma.launchPortfolio.findUnique({ where: { id: params.id } })
    if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (portfolio.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await prisma.launchPortfolio.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 })
  }
}
