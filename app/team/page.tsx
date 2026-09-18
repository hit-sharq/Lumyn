import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import TeamPageClient from "./TeamPageClient"
import { breadcrumbJsonLd } from "@/lib/seo"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

export const metadata: Metadata = {
  title: "Team | Lumyn Technologies - Meet Our Leadership and Creators",
  description:
    "Meet the Lumyn Technologies team — creative strategists, engineers, and digital leaders powering African creators with modern web solutions.",
  openGraph: {
    title: "Team | Lumyn Technologies - Meet Our Leadership and Creators",
    description:
      "Meet the Lumyn Technologies team — creative strategists, engineers, and digital leaders powering African creators with modern web solutions.",
    url: `${BASE_URL}/team`,
    type: "website",
  },
  twitter: {
    title: "Team | Lumyn Technologies - Meet Our Leadership and Creators",
    description:
      "Meet the Lumyn Technologies team — creative strategists, engineers, and digital leaders powering African creators with modern web solutions.",
  },
  alternates: {
    canonical: `${BASE_URL}/team`,
  },
}

export default async function TeamPage() {
  const leaders = await prisma.leadershipTeam.findMany({ orderBy: { order: "asc" } })

  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Team", url: `${BASE_URL}/team` },
      ])}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lumyn Technologies",
              url: BASE_URL,
              logo: `${BASE_URL}/logo.png`,
              sameAs: [
                "https://x.com/LumynTec",
                "https://www.linkedin.com/company/lumyn-technologies",
                "https://www.instagram.com/lumyn_technologies",
                "https://github.com/lumyntechnologies-oss",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254-700-000000",
                contactType: "customer service",
                availableLanguage: ["English", "Swahili"],
              },
            },
            ...leaders.map((leader) => ({
              "@context": "https://schema.org",
              "@type": "Person",
              name: leader.name,
              jobTitle: leader.position,
              description: leader.role,
              image: leader.imageUrl,
              url: `${BASE_URL}/team`,
              worksFor: {
                "@type": "Organization",
                name: "Lumyn Technologies",
                url: BASE_URL,
              },
            })),
          ]),
        }}
      />

      <TeamPageClient />
    </>
  )
}