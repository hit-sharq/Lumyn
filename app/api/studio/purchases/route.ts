import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const purchases = await prisma.studioPurchase.findMany({
      where: { userId },
      include: { template: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(purchases)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ""

    const body = await request.json()
    const { templateId } = body

    const template = await prisma.studioTemplate.findUnique({ where: { id: templateId } })
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 })

    const existing = await prisma.studioPurchase.findUnique({
      where: { userId_templateId: { userId, templateId } },
    })
    if (existing) return NextResponse.json(existing)

    const purchase = await prisma.studioPurchase.create({
      data: { userId, userEmail, templateId, amount: template.isFree ? 0 : template.price },
    })

    await prisma.studioTemplate.update({
      where: { id: templateId },
      data: { downloadCount: { increment: 1 } },
    })

    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
  }
}
