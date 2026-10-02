import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Get Started | Lumyn Technologies",
  description:
    "Create your Lumyn Technologies account and get started with our studio.",
  path: "/get-started",
  keywords: ["get started", "sign up", "create account", "Lumyn Technologies", "digital innovation studio"],
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
