import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "About Lumyn Technologies | Our Story & Mission",
  description:
    "Lumyn Technologies is the complete creative platform for African creators. Learn about our mission to empower creators with the tools to build, sell, and grow.",
  path: "/about",
  keywords: ["about Lumyn Technologies", "creative platform", "African creators", "company mission", "Lumyn Technologies team"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "About", url: `${BASE_URL}/about` },
      ])}
      {children}
    </>
  )
}
