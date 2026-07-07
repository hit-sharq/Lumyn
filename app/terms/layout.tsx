import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service | Lumyn",
  description:
    "The terms and conditions governing your use of the Lumyn platform. Read our terms of service to understand your obligations.",
  path: "/terms",
  keywords: ["terms of service", "terms and conditions", "Lumyn terms"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
