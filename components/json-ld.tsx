'use client'

import Script from 'next/script'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lumyn.vercel.app'

export default function JsonLd() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Lumyn',
      description: 'The complete creative platform for African creators. Build portfolios, sell products, find jobs, and access premium templates.',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      sameAs: [
        'https://twitter.com/lumyn',
        'https://instagram.com/lumyn',
        'https://linkedin.com/company/lumyn',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+254-700-000000',
        contactType: 'customer service',
        availableLanguage: ['English', 'Swahili'],
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Lumyn',
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Lumyn Studio',
      description: 'Premium templates and assets for creative projects',
      url: `${BASE_URL}/studio`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Lumyn Launch',
      description: 'Build and launch your professional portfolio in minutes',
      url: `${BASE_URL}/launch`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Lumyn Market',
      description: 'Buy and sell digital products in Africa\'s largest marketplace',
      url: `${BASE_URL}/market`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Lumyn Hire',
      description: 'Find jobs or hire top creative talent in Africa',
      url: `${BASE_URL}/hire`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
    },
  ]

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}