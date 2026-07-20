import { prisma } from "@/lib/prisma"
import Link from "next/link"
import type { Metadata } from "next"
import styles from "../about/about.module.css"
import TeamCard from "./TeamCard"
import { breadcrumbJsonLd } from "@/lib/seo"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

export const metadata: Metadata = {
  title: "Team | Lumyn - Meet Our Leadership and Creators",
  description:
    "Meet the Lumyn team — creative strategists, engineers, and digital leaders powering African creators with modern web solutions.",
  openGraph: {
    title: "Team | Lumyn - Meet Our Leadership and Creators",
    description:
      "Meet the Lumyn team — creative strategists, engineers, and digital leaders powering African creators with modern web solutions.",
    url: `${BASE_URL}/team`,
    type: "website",
  },
  twitter: {
    title: "Team | Lumyn - Meet Our Leadership and Creators",
    description:
      "Meet the Lumyn team — creative strategists, engineers, and digital leaders powering African creators with modern web solutions.",
  },
  alternates: {
    canonical: `${BASE_URL}/team`,
  },
}

async function getLeadershipTeam() {
  return prisma.leadershipTeam.findMany({
    orderBy: { order: "asc" },
  })
}

export default async function TeamPage() {
  const leaders = await getLeadershipTeam()

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Lumyn",
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
        name: "Lumyn",
        url: BASE_URL,
      },
    })),
  ]

  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "Team", url: `${BASE_URL}/team` },
      ])}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.aboutPage}>
        <section className={styles.hero}>
          <div className={styles.heroBg}> 
            <div className={styles.gradientOrb1}></div>
            <div className={styles.gradientOrb2}></div>
            <div className={styles.gradientOrb3}></div>
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Meet the Team</h1>
            <p className={styles.heroSubtitle}>The people shaping Lumyn</p>
            <p className={styles.heroDescription}>
              Discover the creative leaders, engineers, and strategists behind Lumyn’s digital products and services.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.container}>
            <div className={styles.sectionWrapper} style={{ opacity: 1, transform: 'translateY(0)' }}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Our Leadership</h2>
                <div className={styles.sectionLine}></div>
              </div>
              <div className={styles.sectionContent}>
                <p className={styles.text}>
                  Lumyn is powered by a diverse team of makers, designers, and product thinkers. Here you can explore their roles, backgrounds, and what they bring to our mission.
                </p>
              </div>
            </div>

            {leaders.length > 0 ? (
              <div className={styles.teamGrid}>
                {leaders.map((leader) => (
                  <TeamCard key={leader.id} leader={leader} showFullPageButton={false} />
                ))}
              </div>
            ) : (
              <div className={styles.loadingCard}>
                <p>No team members are available yet. Add your leadership team through the admin panel to make them discoverable.</p>
              </div>
            )}

            <div style={{ marginTop: '50px', textAlign: 'center' }}>
              <Link href="/about" className={styles.ctaButton}>
                Back to About
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
