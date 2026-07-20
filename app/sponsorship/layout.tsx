import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Sponsorship | Partner with Lumyn",
  description:
    "Sponsor Lumyn events, creators, and programs. Reach Africa's growing community of creators and build your brand with us.",
  path: "/sponsorship",
  keywords: ["sponsorship", "brand partnership", "sponsor creators", "Lumyn partnership", "advertising"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Sponsorship", url: "https://www.lumyn.co.ke/sponsorship" },
      ])}
      {children}
    </>
  )
}
