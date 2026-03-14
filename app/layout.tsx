import React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { ClerkProvider } from "@clerk/nextjs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CookieConsentBanner from "@/components/cookie-consent"
import "./globals.css"
import { GeistSans } from 'geist/font/sans';
import { cn } from "@/lib/utils";

// GeistSans is already an object, no need to call it as a function
const geist = GeistSans;

export const metadata: Metadata = {
  title: 'Lumyn Technologies',
  description: 'Innovative tech solutions for a brighter future.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <head>
          <Script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6640250879995161"
            crossOrigin="anonymous"
          />
        </head>
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
