import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Creators | Discover African Creators on Lumyn",
  description:
    "Discover and connect with talented African creators across design, development, photography, writing, and more on Lumyn.",
  path: "/creators",
  keywords: ["creators", "African creators", "creative directory", "designers", "developers", "Lumyn creators"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
