import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Blog | Lumyn",
  description:
    "Insights, guides, and stories for African creators. Read the Lumyn blog for tips on building portfolios, selling digital products, and growing your creative career.",
  path: "/blog",
  keywords: ["blog", "creative tips", "creator economy", "African creators", "Lumyn blog"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
