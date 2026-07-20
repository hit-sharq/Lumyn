import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Careers | Join the Lumyn Team",
  description:
    "Explore open roles at Lumyn and help us build the creative economy in Africa. Find jobs in engineering, design, marketing, and operations.",
  path: "/careers",
  keywords: ["careers", "jobs at Lumyn", "hiring", "creative jobs", "Africa tech jobs"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Careers", url: "https://www.lumyn.co.ke/careers" },
      ])}
      {children}
    </>
  )
}
