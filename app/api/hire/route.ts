import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const where: any = { isPublished: true, isPaid: true }
    if (category && category !== "All") where.category = category

    const jobs = await prisma.paidJobPost.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ""

    const body = await request.json()
    const {
      companyName, companyLogo, companyWebsite, jobTitle, jobDescription,
      location, jobType, salary, applicationUrl, applicationEmail,
      category, tags, plan
    } = body

    if (!companyName || !jobTitle || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prices: Record<string, number> = { basic: 500, standard: 1200, featured: 2500 }
    const amount = prices[plan] || prices.basic

    const job = await prisma.paidJobPost.create({
      data: {
        userId,
        userEmail,
        companyName,
        companyLogo: companyLogo || null,
        companyWebsite: companyWebsite || null,
        jobTitle,
        jobDescription,
        location: location || "Remote",
        jobType: jobType || "Full-time",
        salary: salary || null,
        applicationUrl: applicationUrl || null,
        applicationEmail: applicationEmail || null,
        category: category || "Technology",
        tags: tags || [],
        plan,
        amount,
        isPaid: false,
        isPublished: false,
        isFeatured: plan === "featured",
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error("Job post error:", error)
    return NextResponse.json({ error: "Failed to create job post" }, { status: 500 })
  }
}
