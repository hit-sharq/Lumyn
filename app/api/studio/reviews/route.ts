import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ""
    const userName = user?.fullName || user?.firstName || "Anonymous"

    const body = await request.json()
    const { templateId, rating, comment } = body

    if (!templateId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const review = await prisma.studioReview.upsert({
      where: { userId_templateId: { userId, templateId } },
      create: { userId, userEmail, userName: userName || "Anonymous", templateId, rating, comment },
      update: { rating, comment },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
