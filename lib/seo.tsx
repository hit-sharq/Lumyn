import type { Metadata } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

interface BreadcrumbItem {
  name: string
  url: string
}

interface PageMetadataInput {
  title: string
  description: string
  path?: string
  keywords?: string[]
  breadcrumbs?: BreadcrumbItem[]
}

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords,
  breadcrumbs,
}: PageMetadataInput): Metadata {
  const url = `${BASE_URL}${path}`
  const breadcrumbList = breadcrumbs || [
    { name: "Home", url: BASE_URL },
    { name: title, url },
  ]

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Lumyn Technologies" }],
    creator: "Lumyn Technologies",
    publisher: "Lumyn Technologies",
    applicationName: "Lumyn",
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Lumyn",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Lumyn - Creative Platform for African Creators",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
      creator: "@LumynTec",
    },
  }
}

export function breadcrumbJsonLd(breadcrumbs: BreadcrumbItem[]) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export { BASE_URL }
