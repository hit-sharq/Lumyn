import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const job = await prisma.career.findUnique({
      where: { id: params.id },
      select: { title: true, company: true, description: true },
    })
    if (!job) return { title: "Job not found | Lumyn Technologies" }
    return pageMetadata({
      title: `Apply: ${job.title} at ${job.company} | Lumyn Technologies Careers`,
      description: job.description,
      path: `/careers/apply/${params.id}`,
    })
  } catch {
    return { title: "Careers | Lumyn Technologies" }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
