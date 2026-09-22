import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Lumyn Technologies",
  description:
    "How Lumyn Technologies collects, uses, and protects your personal data. Read our privacy policy to understand your rights.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "Lumyn Technologies privacy"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Privacy Policy", url: `${BASE_URL}/privacy` },
      ])}
      {children}
    </>
  )
}
