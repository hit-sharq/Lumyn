import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const post = await prisma.blog.findUnique({
      where: { id: params.id },
      select: { title: true, excerpt: true, isPublished: true },
    })
    if (!post || !post.isPublished) return { title: "Post not found | Lumyn" }
    return pageMetadata({
      title: `${post.title} | Lumyn Blog`,
      description: post.excerpt,
      path: `/blog/${params.id}`,
    })
  } catch {
    return { title: "Blog | Lumyn" }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
