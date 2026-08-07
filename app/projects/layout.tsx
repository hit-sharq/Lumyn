import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Projects | Featured Work on Lumyn Technologies",
  description:
    "Discover featured projects from African creators across design, development, marketing, and more on Lumyn Technologies Projects.",
  path: "/projects",
  keywords: ["projects", "creative work", "portfolio showcase", "African creators", "Lumyn Technologies Projects"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Projects", url: "https://www.lumyn.co.ke/projects" },
      ])}
      {children}
    </>
  )
}
