import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Services | Lumyn",
  description:
    "Software engineering, design, and marketing services from Lumyn. From frontend development to brand strategy, get expert help to build and grow your creative business.",
  path: "/services",
  keywords: ["software engineering", "web development", "design services", "marketing services", "creative agency", "Lumyn services"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
