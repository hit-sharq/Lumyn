import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Hire | Find Jobs & Creative Talent on Lumyn",
  description:
    "Post jobs or find top creative talent across Africa. Lumyn Hire connects companies with designers, developers, marketers, and creators.",
  path: "/hire",
  keywords: ["job board", "hire creatives", "freelance jobs", "creative talent", "Africa jobs", "Lumyn Hire"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Hire", url: "https://www.lumyn.co.ke/hire" },
      ])}
      {children}
    </>
  )
}
