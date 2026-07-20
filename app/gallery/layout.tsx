import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Gallery | Lumyn",
  description:
    "Explore a curated gallery of work from African creators across design, photography, illustration, and more on Lumyn.",
  path: "/gallery",
  keywords: ["gallery", "creative showcase", "artwork", "photography", "design", "Lumyn gallery"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Gallery", url: "https://www.lumyn.co.ke/gallery" },
      ])}
      {children}
    </>
  )
}
