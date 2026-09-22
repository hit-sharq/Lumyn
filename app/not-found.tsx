import type { Metadata } from "next"
import Link from "next/link"
import { BASE_URL, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Page Not Found | Lumyn Technologies",
  description: "The page you're looking for doesn't exist. Return to Lumyn Technologies to explore our services, portfolios, and creative platform.",
  path: "/404",
  keywords: ["404", "page not found", "Lumyn Technologies"],
})

export default function NotFound() {
  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "120px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "6rem", fontWeight: 800, color: "#f97316", marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 16 }}>Page Not Found</h2>
      <p style={{ color: "#6b7280", marginBottom: 32, lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{
            padding: "12px 24px",
            backgroundColor: "#ea580c",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Go Home
        </Link>
        <Link
          href="/contact"
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "#ea580c",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            border: "1px solid #ea580c",
          }}
        >
          Contact Us
        </Link>
      </div>
    </main>
  )
}
