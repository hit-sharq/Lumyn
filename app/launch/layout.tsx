import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Launch | Build Your Portfolio with Lumyn",
  description:
    "Build and launch a beautiful professional portfolio in minutes with Lumyn Launch. Choose from designer-made templates and showcase your work to the world.",
  path: "/launch",
  keywords: ["portfolio builder", "personal website", "creative portfolio", "Lumyn Launch", "templates"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
