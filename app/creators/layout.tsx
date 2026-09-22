import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Creators | Discover African Creators on Lumyn Technologies",
  description:
    "Discover and connect with talented African creators across design, development, photography, writing, and more on Lumyn Technologies.",
  path: "/creators",
  keywords: ["creators", "African creators", "creative directory", "designers", "developers", "Lumyn Technologies creators"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Creators", url: `${BASE_URL}/creators` },
      ])}
      {children}
    </>
  )
}
