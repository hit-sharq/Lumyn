import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "About Lumyn | Our Story & Mission",
  description:
    "Lumyn is the complete creative platform for African creators. Learn about our mission to empower creators with the tools to build, sell, and grow.",
  path: "/about",
  keywords: ["about Lumyn", "creative platform", "African creators", "company mission", "Lumyn team"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "About", url: "https://www.lumyn.co.ke/about" },
      ])}
      {children}
    </>
  )
}
