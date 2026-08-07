import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Blog | Lumyn Technologies",
  description:
    "Insights, guides, and stories for African creators. Read the Lumyn Technologies blog for tips on building portfolios, selling digital products, and growing your creative career.",
  path: "/blog",
  keywords: ["blog", "creative tips", "creator economy", "African creators", "Lumyn Technologies blog"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Blog", url: "https://www.lumyn.co.ke/blog" },
      ])}
      {children}
    </>
  )
}
