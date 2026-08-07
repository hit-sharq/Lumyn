import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "News | Lumyn Technologies",
  description:
    "The latest news, announcements, and updates from Lumyn Technologies and the African creative community.",
  path: "/news",
  keywords: ["news", "Lumyn Technologies news", "creative community", "announcements", "Africa tech"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "News", url: "https://www.lumyn.co.ke/news" },
      ])}
      {children}
    </>
  )
}
