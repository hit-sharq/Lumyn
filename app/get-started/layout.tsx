import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Get Started | Lumyn",
  description:
    "Create your Lumyn account and unlock the complete creative platform. Build a portfolio, sell on Market, find jobs on Hire, and access Studio templates.",
  path: "/get-started",
  keywords: ["get started", "sign up", "create account", "Lumyn", "creative platform"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
