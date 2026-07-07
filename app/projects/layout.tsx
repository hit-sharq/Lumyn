import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Projects | Featured Work on Lumyn",
  description:
    "Discover featured projects from African creators across design, development, marketing, and more on Lumyn Projects.",
  path: "/projects",
  keywords: ["projects", "creative work", "portfolio showcase", "African creators", "Lumyn Projects"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
