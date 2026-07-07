import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Market | Buy & Sell Digital Products on Lumyn",
  description:
    "Africa's marketplace for digital products. Buy and sell templates, UI kits, fonts, eBooks, courses, and tools from African creators on Lumyn Market.",
  path: "/market",
  keywords: ["digital products", "marketplace", "templates", "UI kits", "fonts", "eBooks", "Lumyn Market"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
