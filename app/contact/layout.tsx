import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Contact Us | Lumyn",
  description:
    "Get in touch with the Lumyn team. Whether you have a question, partnership idea, or need support, we'd love to hear from you.",
  path: "/contact",
  keywords: ["contact Lumyn", "support", "partnership", "Lumyn contact"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Contact", url: "https://www.lumyn.co.ke/contact" },
      ])}
      {children}
    </>
  )
}
