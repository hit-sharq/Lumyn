import React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { ClerkProvider } from "@clerk/nextjs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CookieConsentBanner from "@/components/cookie-consent"
import JsonLd from "@/components/json-ld"
import "./globals.css"
import { GeistSans } from 'geist/font/sans';
import { cn } from "@/lib/utils";

// GeistSans is already an object, no need to call it as a function
const geist = GeistSans;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lumyn.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'Lumyn - The Complete Creative Platform',
    template: '%s | Lumyn',
  },
  description: 'Lumyn is a complete platform for African creators. Build portfolios with Launch, sell products on Market, find jobs on Hire, and access premium templates on Studio.',
  keywords: ['creative platform', 'African creators', 'Lumyn Studio', 'Lumyn Launch', 'Lumyn Market', 'Lumyn Hire', 'digital products', 'job board', 'portfolio builder', 'templates', 'creators Africa'],
  authors: [{ name: 'Lumyn Technologies' }],
  creator: 'Lumyn Technologies',
  publisher: 'Lumyn Technologies',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Lumyn',
    title: 'Lumyn - The Complete Creative Platform',
    description: 'Build portfolios, sell products, find jobs, access templates. The all-in-one platform for African creators.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lumyn - Creative Platform for African Creators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumyn - The Complete Creative Platform',
    description: 'Build portfolios, sell products, find jobs, access templates. The all-in-one platform for African creators.',
    images: ['/og-image.png'],
    creator: '@lumyn',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en': BASE_URL,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'google-site-verification-code',
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
          <JsonLd />
          <Header />
          <main style={{ marginTop: "80px" }}>{children}</main>
          <Footer />
          <CookieConsentBanner />
        </body>
      </html>
    </ClerkProvider>
  )
}
