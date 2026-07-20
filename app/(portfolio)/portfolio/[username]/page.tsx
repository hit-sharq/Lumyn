import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { renderPortfolioTemplate, loadPortfolioTemplate } from "@/lib/launch/renderer"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

interface PageProps {
  params: { username: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const portfolio = await prisma.launchPortfolio.findUnique({
      where: { username: params.username },
      select: { displayName: true, title: true, about: true, isPublished: true, avatarUrl: true, skills: true },
    })
    if (!portfolio || !portfolio.isPublished) return { title: "Portfolio not found" }
    const name = portfolio.displayName || params.username
    const description = portfolio.title || portfolio.about || `View ${name}'s portfolio.`
    const skillsText = (portfolio.skills || []).slice(0, 5).join(", ")
    const fullDescription = skillsText ? `${description} Skills: ${skillsText}.` : description
    return {
      title: `${name} | Portfolio`,
      description: fullDescription,
      openGraph: {
        title: `${name} | Portfolio`,
        description: fullDescription,
        url: `${BASE_URL}/portfolio/${params.username}`,
        siteName: "Lumyn",
        type: "profile",
        images: portfolio.avatarUrl ? [{ url: portfolio.avatarUrl, width: 1200, height: 630, alt: name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | Portfolio`,
        description: fullDescription,
        images: portfolio.avatarUrl ? [portfolio.avatarUrl] : undefined,
        creator: "@LumynTec",
      },
      alternates: { canonical: `${BASE_URL}/portfolio/${params.username}` },
    }
  } catch {
    return { title: "Portfolio" }
  }
}

function PortfolioJsonLd({ portfolio }: { portfolio: any }) {
  const name = portfolio.displayName || portfolio.username
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${BASE_URL}/portfolio/${portfolio.username}`,
    description: portfolio.title || portfolio.about || `${name}'s portfolio`,
  }

  if (portfolio.avatarUrl) {
    jsonLd.image = portfolio.avatarUrl
  }

  if (portfolio.socialLinks) {
    const sameAs: string[] = []
    if (portfolio.socialLinks.github) sameAs.push(portfolio.socialLinks.github)
    if (portfolio.socialLinks.linkedin) sameAs.push(portfolio.socialLinks.linkedin)
    if (portfolio.socialLinks.twitter) sameAs.push(`https://twitter.com/${portfolio.socialLinks.twitter}`)
    if (portfolio.socialLinks.website) sameAs.push(portfolio.socialLinks.website)
    if (sameAs.length > 0) {
      jsonLd.sameAs = sameAs
    }
  }

  if (portfolio.skills && portfolio.skills.length > 0) {
    jsonLd.knowsAbout = portfolio.skills.slice(0, 10)
  }

  if (portfolio.projects && portfolio.projects.length > 0) {
    jsonLd.hasOccupation = {
      "@type": "Occupation",
      name: portfolio.title || "Creative Professional",
      description: portfolio.about || "",
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
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
  const name = portfolio.displayName || portfolio.username

  const noscriptContent = `
    <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, sans-serif;">
      <h1>${name}</h1>
      ${portfolio.title ? `<p><strong>${portfolio.title}</strong></p>` : ""}
      ${portfolio.about ? `<p>${portfolio.about}</p>` : ""}
      ${portfolio.skills && portfolio.skills.length > 0 ? `<p><strong>Skills:</strong> ${portfolio.skills.join(", ")}</p>` : ""}
      ${portfolio.projects && portfolio.projects.length > 0 ? `
        <h2>Projects</h2>
        <ul>
          ${portfolio.projects.map((p: any) => `<li><strong>${p.title}</strong> - ${p.description || ""}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `

  return (
    <>
      <noscript dangerouslySetInnerHTML={{ __html: noscriptContent }} />
      <PortfolioJsonLd portfolio={portfolio} />
      <iframe
        srcDoc={renderedHtml}
        title={`${name} portfolio`}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, zIndex: 9999 }}
        loading="eager"
      />
    </>
  )
}
