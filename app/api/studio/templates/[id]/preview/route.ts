import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const template = await prisma.studioTemplate.findUnique({
      where: { id: params.id },
      select: { htmlContent: true, title: true },
    })
    if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const html = template.htmlContent || `<!DOCTYPE html><html><body><h1>${template.title}</h1><p>No preview available.</p></body></html>`

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Frame-Options": "SAMEORIGIN",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load preview" }, { status: 500 })
  }
}
