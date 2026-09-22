import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Services | Lumyn Technologies",
  description:
    "Software engineering, design, and marketing services from Lumyn Technologies. From frontend development to brand strategy, get expert help to build and grow your creative business.",
  path: "/services",
  keywords: ["software engineering", "web development", "design services", "marketing services", "creative agency", "Lumyn Technologies services"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Services", url: `${BASE_URL}/services` },
      ])}
      {children}
    </>
  )
}
