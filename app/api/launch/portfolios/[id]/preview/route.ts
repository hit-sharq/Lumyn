import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { loadPortfolioTemplate, renderPortfolioTemplate } from "@/lib/launch/renderer"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const portfolio = await prisma.launchPortfolio.findUnique({
      where: { id: params.id },
      include: { projects: { orderBy: { order: "asc" } } },
    })
    if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const templateHtml = loadPortfolioTemplate(portfolio.templateId || "")
    const rendered = renderPortfolioTemplate(templateHtml, portfolio)

    return new NextResponse(rendered, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Preview render error:", error)
    return NextResponse.json({ error: "Failed to load preview" }, { status: 500 })
  }
}
