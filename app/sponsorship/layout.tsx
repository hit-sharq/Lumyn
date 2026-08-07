import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Sponsorship | Partner with Lumyn Technologies",
  description:
    "Sponsor Lumyn Technologies events, creators, and programs. Reach Africa's growing community of creators and build your brand with us.",
  path: "/sponsorship",
  keywords: ["sponsorship", "brand partnership", "sponsor creators", "Lumyn Technologies partnership", "advertising"],
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
