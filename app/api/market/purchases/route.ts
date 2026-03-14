import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const purchases = await prisma.marketPurchase.findMany({
      where: { userId },
      include: { product: { include: { creator: true } } },
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
    const { productId } = body

    const product = await prisma.marketProduct.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    const existing = await prisma.marketPurchase.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (existing) return NextResponse.json(existing)

    const purchase = await prisma.marketPurchase.create({
      data: { userId, userEmail, productId, amount: product.price },
    })

    await prisma.marketProduct.update({
      where: { id: productId },
      data: { salesCount: { increment: 1 } },
    })

    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
  }
}
