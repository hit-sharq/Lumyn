import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Newsletter | Lumyn",
  description:
    "Subscribe to the Lumyn newsletter for creator tips, product updates, and the best work from the African creative community.",
  path: "/newsletter",
  keywords: ["newsletter", "subscribe", "Lumyn updates", "creator tips"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Newsletter", url: "https://www.lumyn.co.ke/newsletter" },
      ])}
      {children}
    </>
  )
}
