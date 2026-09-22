import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Gallery | Lumyn Technologies",
  description:
    "Explore a curated gallery of work from African creators across design, photography, illustration, and more on Lumyn Technologies.",
  path: "/gallery",
  keywords: ["gallery", "creative showcase", "artwork", "photography", "design", "Lumyn Technologies gallery"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Gallery", url: `${BASE_URL}/gallery` },
      ])}
      {children}
    </>
  )
}
