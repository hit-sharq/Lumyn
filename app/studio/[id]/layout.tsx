import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const template = await prisma.studioTemplate.findUnique({
      where: { id: params.id },
      select: { title: true, description: true, isPublished: true },
    })
    if (!template || !template.isPublished) return { title: "Template not found | Lumyn" }
    return pageMetadata({
      title: `${template.title} | Lumyn Studio`,
      description: template.description,
      path: `/studio/${params.id}`,
    })
  } catch {
    return { title: "Studio | Lumyn" }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
