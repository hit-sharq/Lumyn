import React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lumyn.co.ke'

export default function JsonLd() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Lumyn Technologies',
      alternateName: [
        'Lumyn',
        'Lumyn Tec',
        'Lumyn Technologies Kenya',
        'Luymn',
        'Luym',
        'Lumin',
        'Lumen',
        'Lumn',
        'Lumyn Tech',
        'Lumyn Technologies Limited',
      ],
      description:
        'Digital innovation studio engineering bespoke platforms, products, and experiences for ambitious businesses.',
      url: BASE_URL,
      logo: `${BASE_URL}/placeholder-logo.png`,
      sameAs: [
        'https://x.com/LumynTec',
        'https://www.linkedin.com/company/lumyn-technologies',
        'https://www.instagram.com/lumyn_technologies',
        'https://github.com/lumyntechnologies-oss',
        'https://blogs.lumyn.co.ke/',
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
      name: 'Lumyn Technologies',
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
      name: 'Lumyn Technologies Studio',
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
  ]

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          // Next/React requires deterministic keys for list rendering
          key={index}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

