import type { Metadata } from "next"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "FAQ | Lumyn",
  description:
    "Find answers to frequently asked questions about Lumyn — accounts, portfolios, Market, Hire, Studio, and more.",
  path: "/faq",
  keywords: ["FAQ", "help", "questions", "Lumyn support", "how does Lumyn work"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "FAQ", url: "https://www.lumyn.co.ke/faq" },
      ])}
      {children}
    </>
  )
}
