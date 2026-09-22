import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Newsletter | Lumyn Technologies",
  description:
    "Subscribe to the Lumyn Technologies newsletter for creator tips, product updates, and the best work from the African creative community.",
  path: "/newsletter",
  keywords: ["newsletter", "subscribe", "Lumyn Technologies updates", "creator tips"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Newsletter", url: `${BASE_URL}/newsletter` },
      ])}
      {children}
    </>
  )
}
