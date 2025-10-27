import React from "react"
import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CookieConsentBanner from "@/components/cookie-consent"
import "./globals.css"

export const metadata: Metadata = {
  title: "KESA - Kenyan Student Association | University of Minnesota",
  description:
    "Kenyan Student Association at the University of Minnesota. Celebrating Kenyan culture, building community, and creating lasting connections.",
  keywords: [
    "Kenyan Student Association",
    "University of Minnesota",
    "KESA UMN",
    "Kenyan culture",
    "student organization",
    "cultural events",
    "Kenyan community",
    "college students",
    "Minnesota",
    "East African students"
  ],
  authors: [{ name: "Kenyan Student Association" }],
  creator: "Kenyan Student Association",
  publisher: "Kenyan Student Association",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kesa-umn.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KESA - Kenyan Student Association | University of Minnesota",
    description: "Celebrating Kenyan culture, building community, and creating lasting connections at the University of Minnesota.",
    url: "https://kesa-umn.vercel.app",
    siteName: "KESA UMN",
    images: [
      {
        url: "/images/hero-team.jpg",
        width: 1200,
        height: 630,
        alt: "KESA Team and Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KESA - Kenyan Student Association | University of Minnesota",
    description: "Celebrating Kenyan culture, building community, and creating lasting connections at the University of Minnesota.",
    images: ["/images/hero-team.jpg"],
    creator: "@kesaumn",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  // Add Google Search Console verification meta tag here
  // Replace 'YOUR_VERIFICATION_CODE' with the code from Google Search Console
  verification: {
    google: "YOUR_VERIFICATION_CODE",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <main style={{ marginTop: "80px" }}>{children}</main>
          <Footer />
          <CookieConsentBanner />
        </body>
      </html>
    </ClerkProvider>
  )
}
