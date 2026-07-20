import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Events | Lumyn",
  description:
    "Discover workshops, meetups, and conferences for African creators. Find and join creative events on Lumyn.",
  path: "/events",
  keywords: ["events", "workshops", "creative meetups", "conferences", "African creators", "Lumyn events"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Events", url: "https://www.lumyn.co.ke/events" },
      ])}
      {children}
    </>
  )
}
