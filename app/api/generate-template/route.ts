import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

export type GeneratedDesign = z.infer<typeof designSchema>

const designSchema = z.object({
  templateTitle: z.string(),
  themeConfig: z.object({
    backgroundColor: z.string(),
    textColor: z.string(),
    accentColor: z.string(),
  }),
  heroSection: z.object({
    heading: z.string(),
    subheading: z.string(),
    ctaText: z.string(),
  }),
  sections: z.array(
    z.object({
      id: z.string(),
      sectionName: z.string(),
      layoutType: z.enum(["GRID", "FLEX_ROW", "LIST"]),
      mockContent: z.array(z.string()),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { description, vertical } = body

    if (!description || !vertical) {
      return NextResponse.json(
        { error: "Missing required fields: description and vertical" },
        { status: 400 }
      )
    }

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ""

    let member = await prisma.member.findUnique({
      where: { userId },
    })

    if (!member) {
      member = await prisma.member.create({
        data: {
          userId,
          email: userEmail,
          firstName: user?.firstName || "User",
          lastName: user?.lastName || "",
        },
      })
    }

    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: designSchema,
      prompt: `You are an expert UI/UX designer and frontend engineer. Generate a complete, modern web layout design structure for a ${vertical} template.

User request: ${description}

Return a JSON object with these exact fields:
- templateTitle: A catchy, professional title for this template
- themeConfig: Colors as Tailwind CSS class-friendly values (e.g., "#0f172a", "#f8fafc", "#3b82f6")
- heroSection: Compelling headline, subheadline, and CTA text
- sections: Array of 3-5 distinct content sections, each with a unique id, descriptive sectionName, layoutType (GRID, FLEX_ROW, or LIST), and mockContent array of 3-6 realistic placeholder strings

Make the design feel premium, cohesive, and production-ready.`,
    })

    const generatedTemplate = await prisma.$transaction(async (tx) => {
      return tx.generatedTemplate.create({
        data: {
          memberId: member!.id,
          title: result.object.templateTitle,
          category: vertical,
          configJson: result.object,
        },
      })
    })

    return NextResponse.json(
      {
        success: true,
        template: generatedTemplate,
        design: result.object,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Template generation error:", error)
    return NextResponse.json(
      { error: error.message || "Template generation failed" },
      { status: 500 }
    )
  }
}
