import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata } from "@/lib/seo"
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
    if (!portfolio || !portfolio.isPublished) return { title: "Portfolio not found | Lumyn" }
    const name = portfolio.displayName || params.username
    return pageMetadata({
      title: `${name} | Lumyn Portfolio`,
      description: portfolio.title || portfolio.about || `View ${name}'s portfolio on Lumyn.`,
      path: `/portfolio/${params.username}`,
    })
  } catch {
    return { title: "Portfolio | Lumyn" }
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

  const socialLinks = (portfolio.socialLinks as any) || {}

  const templateHtml = loadPortfolioTemplate(portfolio.templateId || "")
  const renderedHtml = renderPortfolioTemplate(templateHtml, portfolio)

  return (
    <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  )
}
