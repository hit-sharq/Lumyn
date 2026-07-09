import { type NextRequest, NextResponse } from "next/server"
import { loadPortfolioTemplate, renderPortfolioTemplate } from "@/lib/launch/renderer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const templateId = body?.templateId || ""
    const portfolio = body?.portfolio || {}

    const templateHtml = loadPortfolioTemplate(templateId)
    const rendered = renderPortfolioTemplate(templateHtml, portfolio)

    return new NextResponse(rendered, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Template preview error:", error)
    return NextResponse.json({ error: "Failed to render preview" }, { status: 500 })
  }
}
