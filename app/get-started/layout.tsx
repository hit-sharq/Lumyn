import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Get Started | Lumyn Technologies",
  description:
    "Create your Lumyn Technologies account and unlock the complete creative platform. Build a portfolio, sell on Market, find jobs on Hire, and access Studio templates.",
  path: "/get-started",
  keywords: ["get started", "sign up", "create account", "Lumyn Technologies", "creative platform"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Get Started", url: `${BASE_URL}/get-started` },
      ])}
      {children}
    </>
  )
}
