import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Market | Buy & Sell Digital Products on Lumyn Technologies",
  description:
    "Africa's marketplace for digital products. Buy and sell templates, UI kits, fonts, eBooks, courses, and tools from African creators on Lumyn Technologies Market.",
  path: "/market",
  keywords: ["digital products", "marketplace", "templates", "UI kits", "fonts", "eBooks", "Lumyn Technologies Market"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Market", url: `${BASE_URL}/market` },
      ])}
      {children}
    </>
  )
}
