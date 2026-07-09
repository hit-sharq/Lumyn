import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { renderPortfolioTemplate, loadPortfolioTemplate } from "@/lib/launch/renderer"

interface PageProps {
  params: { username: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const portfolio = await prisma.launchPortfolio.findUnique({
      where: { username: params.username },
      select: { displayName: true, title: true, about: true, isPublished: true },
    })
    if (!portfolio || !portfolio.isPublished) return { title: "Portfolio not found" }
    const name = portfolio.displayName || params.username
    return {
      title: `${name} | Portfolio`,
      description: portfolio.title || portfolio.about || `View ${name}'s portfolio.`,
    }
  } catch {
    return { title: "Portfolio" }
  }
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const portfolio = await prisma.launchPortfolio.findUnique({
    where: { username: params.username },
    include: { projects: { orderBy: { order: "asc" } } },
  })

  if (!portfolio || !portfolio.isPublished) {
    notFound()
  }

  const templateHtml = loadPortfolioTemplate(portfolio.templateId || "")
  const renderedHtml = renderPortfolioTemplate(templateHtml, portfolio)

  return (
    <iframe
      srcDoc={renderedHtml}
      title={`${portfolio.displayName} portfolio`}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, zIndex: 9999 }}
      loading="eager"
    />
  )
}
