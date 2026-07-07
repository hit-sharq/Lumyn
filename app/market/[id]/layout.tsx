import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const product = await prisma.marketProduct.findUnique({
      where: { id: params.id },
      select: { title: true, description: true, isPublished: true },
    })
    if (!product || !product.isPublished) return { title: "Product not found | Lumyn" }
    return pageMetadata({
      title: `${product.title} | Lumyn Market`,
      description: product.description,
      path: `/market/${params.id}`,
    })
  } catch {
    return { title: "Market | Lumyn" }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
