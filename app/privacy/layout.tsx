import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Lumyn",
  description:
    "How Lumyn collects, uses, and protects your personal data. Read our privacy policy to understand your rights.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "Lumyn privacy"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Privacy Policy", url: "https://www.lumyn.co.ke/privacy" },
      ])}
      {children}
    </>
  )
}
