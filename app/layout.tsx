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
import { ThemeProvider } from "@/components/theme-provider"
import MotionSystem from "@/components/MotionSystem"

// GeistSans is already an object, no need to call it as a function
const geist = GeistSans;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lumyn.co.ke'

export const metadata: Metadata = {
  title: {
    default: 'Lumyn Technologies - The Complete Creative Platform',
    template: '%s | Lumyn Technologies',
  },
  description: 'Lumyn Technologies is a complete platform for African creators. Build portfolios with Launch, sell products on Market, find jobs on Hire, and access premium templates on Studio.',
  keywords: ['creative platform', 'African creators', 'Lumyn Technologies Studio', 'Lumyn Technologies Launch', 'Lumyn Technologies Market', 'Lumyn Technologies Hire', 'digital products', 'job board', 'portfolio builder', 'templates', 'creators Africa'],
  authors: [{ name: 'Lumyn Technologies' }],
  creator: 'Lumyn Technologies',
  publisher: 'Lumyn Technologies',
  applicationName: 'Lumyn Technologies',
  category: 'technology',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Lumyn Technologies',
    title: 'Lumyn Technologies - The Complete Creative Platform',
    description: 'Build portfolios, sell products, find jobs, access templates. The all-in-one platform for African creators.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lumyn Technologies - Creative Platform for African Creators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumyn Technologies - The Complete Creative Platform',
    description: 'Build portfolios, sell products, find jobs, access templates. The all-in-one platform for African creators.',
    images: ['/og-image.png'],
    creator: '@LumynTec',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      'en': BASE_URL,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          {process.env.NEXT_PUBLIC_GA4_ID && (
            <>
              <Script
                id="ga4"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
                strategy="afterInteractive"
              />
              <Script
                id="ga4-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
                  `,
                }}
              />
            </>
          )}
          {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName('head')[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          )}
          {process.env.NEXT_PUBLIC_HOTJAR_ID && (
            <Script
              id="hotjar"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings=${process.env.NEXT_PUBLIC_HOTJAR_ID};
                    a.appendChild(r);
                  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                `,
              }}
            />
          )}
          {GSC_VERIFICATION && (
            <meta name="google-site-verification" content={GSC_VERIFICATION} />
          )}
        </head>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <JsonLd />
            <Header />
            <MotionSystem />
            <main>{children}</main>
            <Footer />
            <CookieConsentBanner />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}