import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "AI Marketing Suite | Lumyn",
  description:
    "Generate marketing copy, build multi-channel campaigns, and optimize content with AI. The all-in-one AI marketing toolkit for African creators and businesses.",
  path: "/ai-marketing",
  keywords: ["AI marketing", "content generator", "campaign builder", "marketing automation", "Lumyn AI"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "AI Marketing", url: "https://www.lumyn.co.ke/ai-marketing" },
      ])}
      {children}
    </>
  )
}
