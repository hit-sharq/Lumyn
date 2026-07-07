import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const item = await prisma.news.findUnique({
      where: { id: params.id },
      select: { title: true, excerpt: true },
    })
    if (!item) return { title: "News not found | Lumyn" }
    return pageMetadata({
      title: `${item.title} | Lumyn News`,
      description: item.excerpt,
      path: `/news/${params.id}`,
    })
  } catch {
    return { title: "News | Lumyn" }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
