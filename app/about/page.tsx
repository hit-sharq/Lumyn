import type { Metadata } from "next"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import styles from "./about.module.css"

interface Leader {
  id: string
  name: string
  position: string
  role: string
  imageUrl: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export const metadata: Metadata = {
  title: "About KESA - Kenyan Student Association | University of Minnesota",
  description: "Learn about the Kenyan Student Association at the University of Minnesota. Discover our mission, vision, values, and leadership team dedicated to celebrating Kenyan culture and building community.",
  keywords: [
    "about KESA",
    "Kenyan Student Association",
    "University of Minnesota",
    "leadership team",
    "cultural organization",
    "student community",
    "Kenyan diaspora"
  ],
  openGraph: {
    title: "About KESA - Kenyan Student Association | University of Minnesota",
    description: "Learn about the Kenyan Student Association at the University of Minnesota. Discover our mission, vision, values, and leadership team.",
    url: "https://kesa-umn.vercel.app/about",
    siteName: "KESA UMN",
    images: [
      {
        url: "/images/hero-team.jpg",
        width: 1200,
        height: 630,
        alt: "KESA Leadership Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About KESA - Kenyan Student Association | University of Minnesota",
    description: "Learn about the Kenyan Student Association at the University of Minnesota.",
    images: ["/images/hero-team.jpg"],
  },
}

async function getLeaders(): Promise<Leader[]> {
  try {
    const leaders = await prisma.leadershipTeam.findMany({
      orderBy: { order: "asc" },
    })
    return leaders
  } catch (error) {
    console.error("Error fetching leaders:", error)
    return []
  }
}

export default async function AboutPage() {
  const leaders = await getLeaders()

  return (
    <div className={styles.aboutPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About KESA</h1>
          <p className={styles.heroSubtitle}>Building bridges, celebrating culture, creating community</p>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionContent}>
              <h2 className={styles.sectionTitle}>About Us</h2>
              <p className={styles.missionText}>
                The Kenyan Student Association at the University of Minnesota is dedicated to creating a vibrant and
                inclusive community for Kenyan students and friends of Kenya. We celebrate our rich cultural heritage,
                foster academic excellence, and build lasting connections that extend beyond our time at the university.
              </p>
              <p className={styles.missionText}>
                Through cultural events, networking opportunities, and community service, we strive to be a home away
                from home for all our members while sharing the beauty of Kenyan culture with the broader university
                community.
              </p>
            </div>
            <div className={styles.missionImage}>
              <Image src="/images/hero-team.jpg" alt="KESA Community" fill className={styles.image} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionImage}>
              <Image src="/images/kesa.png" alt="KESA Community" fill className={styles.image} />
            </div>
            <div className={styles.missionContent}>
              <h2 className={styles.sectionTitle}>Our Vision</h2>
              <p className={styles.missionText}>
                Kenyan Student Association aims to unite and empower our Kenyan youth. We seek to foster a sense of
                community, academic excellence, cultural pride, and professional development among our youth.
              </p>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <p className={styles.missionText}>
                We aim to prepare Kenyan youth for a successful future while preserving and celebrating our rich
                heritage. Together, we can empower our youth and create a brighter future for the Kenyan diaspora.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3 className={styles.valueTitle}>Community</h3>
              <p className={styles.valueText}>
                Building strong connections and supporting each other through our shared experiences and cultural
                heritage.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎓</div>
              <h3 className={styles.valueTitle}>Excellence</h3>
              <p className={styles.valueText}>
                Promoting academic achievement and professional development among our members.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌍</div>
              <h3 className={styles.valueTitle}>Culture</h3>
              <p className={styles.valueText}>
                Celebrating and sharing Kenyan traditions, values, and heritage with pride and authenticity.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💡</div>
              <h3 className={styles.valueTitle}>Innovation</h3>
              <p className={styles.valueText}>
                Embracing new ideas and creating opportunities for growth and positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.leadershipSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Leadership Team</h2>
          <p className={styles.leadershipIntro}>
            Our dedicated leadership team works tirelessly to create meaningful experiences and opportunities for all
            KESA members.
          </p>
          <div className={styles.leadershipGrid}>
            {leaders.length === 0 ? (
              <p>Our leadership team will be announced soon.</p>
            ) : (
              leaders.map((leader) => (
                <div key={leader.id} className={styles.leaderCard}>
                  {leader.imageUrl ? (
                    <div className={styles.leaderImage}>
                      <Image
                        src={leader.imageUrl || "/placeholder.svg"}
                        alt={leader.name}
                        fill
                        className={styles.image}
                      />
                    </div>
                  ) : (
                    <div className={styles.leaderImagePlaceholder}>
                      <span>👤</span>
                    </div>
                  )}
                  <div className={styles.leaderContent}>
                    <h3 className={styles.leaderName}>{leader.name}</h3>
                    <p className={styles.leaderPosition}>{leader.position}</p>
                    <p className={styles.leaderRole}>{leader.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className={styles.joinSection}>
        <div className={styles.container}>
          <h2 className={styles.joinTitle}>Join Our Community</h2>
          <p className={styles.joinText}>
            Become part of a vibrant community that celebrates Kenyan culture and supports your journey at the
            University of Minnesota. Membership is free and open to all students!
          </p>
          <a href="/membership" className={styles.joinButton}>
            Become a Member
          </a>
        </div>
      </section>
    </div>
  )
}
