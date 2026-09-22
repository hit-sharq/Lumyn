import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Contact Us | Lumyn Technologies",
  description:
    "Get in touch with the Lumyn Technologies team. Whether you have a question, partnership idea, or need support, we'd love to hear from you.",
  path: "/contact",
  keywords: ["contact Lumyn Technologies", "support", "partnership", "Lumyn Technologies contact"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Contact", url: `${BASE_URL}/contact` },
      ])}
      {children}
    </>
  )
}
