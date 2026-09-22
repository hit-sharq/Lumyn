import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Events | Lumyn Technologies",
  description:
    "Discover workshops, meetups, and conferences for African creators. Find and join creative events on Lumyn Technologies.",
  path: "/events",
  keywords: ["events", "workshops", "creative meetups", "conferences", "African creators", "Lumyn Technologies events"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Events", url: `${BASE_URL}/events` },
      ])}
      {children}
    </>
  )
}
