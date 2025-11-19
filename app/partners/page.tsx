import { Metadata } from "next"
import styles from "./partners.module.css"

export const metadata: Metadata = {
  title: "Our Partners | Lumyn",
  description: "Meet our valued partners who support our mission and vision.",
}

interface Partner {
  id: string
  name: string
  description?: string
  logoUrl?: string
  website?: string
  category: string
  featured: boolean
  order: number
}

async function getPartners(): Promise<Partner[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/partners`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export default async function PartnersPage() {
  const partners = await getPartners()

  const featuredPartners = partners.filter(p => p.featured).sort((a, b) => a.order - b.order)
  const otherPartners = partners.filter(p => !p.featured).sort((a, b) => a.order - b.order)

  return (
    <div className={styles.partnersPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Partners</h1>
          <p className={styles.subtitle}>
            We are proud to collaborate with these amazing organizations and individuals who share our vision.
          </p>
        </div>

        {featuredPartners.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Featured Partners</h2>
            <div className={styles.partnersGrid}>
              {featuredPartners.map((partner) => (
                <div key={partner.id} className={`${styles.partnerCard} ${styles.featured}`}>
                  <div className={styles.partnerLogo}>
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={`${partner.name} logo`} />
                    ) : (
                      <div className={styles.placeholderLogo}>
                        {partner.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.partnerInfo}>
                    <h3 className={styles.partnerName}>{partner.name}</h3>
                    <p className={styles.partnerCategory}>{partner.category}</p>
                    {partner.description && (
                      <p className={styles.partnerDescription}>{partner.description}</p>
                    )}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.partnerLink}
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {otherPartners.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Partners</h2>
            <div className={styles.partnersGrid}>
              {otherPartners.map((partner) => (
                <div key={partner.id} className={styles.partnerCard}>
                  <div className={styles.partnerLogo}>
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={`${partner.name} logo`} />
                    ) : (
                      <div className={styles.placeholderLogo}>
                        {partner.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.partnerInfo}>
                    <h3 className={styles.partnerName}>{partner.name}</h3>
                    <p className={styles.partnerCategory}>{partner.category}</p>
                    {partner.description && (
                      <p className={styles.partnerDescription}>{partner.description}</p>
                    )}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.partnerLink}
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {partners.length === 0 && (
          <div className={styles.emptyState}>
            <h2>No partners yet</h2>
            <p>We're working on building partnerships. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
