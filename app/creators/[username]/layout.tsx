import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  try {
    const portfolio = await prisma.launchPortfolio.findUnique({
      where: { username: params.username },
      select: { displayName: true, title: true, about: true, isPublished: true },
    })
    if (!portfolio || !portfolio.isPublished) return { title: "Portfolio not found | Lumyn Technologies" }
    const name = portfolio.displayName || params.username
    return pageMetadata({
      title: `${name} | Lumyn Technologies Creator`,
      description: portfolio.title || portfolio.about || `View ${name}'s portfolio on Lumyn Technologies.`,
      path: `/creators/${params.username}`,
    })
  } catch {
    return { title: "Creators | Lumyn Technologies" }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
