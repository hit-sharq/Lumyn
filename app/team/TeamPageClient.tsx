"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import styles from "../about/about.module.css"
import TeamCard from "./TeamCard"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

interface Leader {
  id: string
  name: string
  position: string
  role: string
  imageUrl?: string | null
}

export default function TeamPageClient() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/leadership")
        const data = await res.json()
        if (mounted) setLeaders(Array.isArray(data) ? data : [])
      } catch (_) {
        if (mounted) setLeaders([])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className={styles.aboutPage}>
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
        </div>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            Meet the Team
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            The people shaping Lumyn Technologies
          </motion.p>
          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            Discover the creative leaders, engineers, and strategists behind Lumyn Technologies’s digital products and services.
          </motion.p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Leadership</h2>
              <div className={styles.sectionLine}></div>
            </div>
            <div className={styles.sectionContent}>
              <p className={styles.text}>
                Lumyn Technologies is powered by a diverse team of makers, designers, and product thinkers. Here you can explore their roles, backgrounds, and what they bring to our mission.
              </p>
            </div>
          </motion.div>

          {loading ? (
            <div className={styles.loadingCard}>
              <p>Loading team members…</p>
            </div>
          ) : leaders.length > 0 ? (
            <div className={styles.teamGrid}>
              {leaders.map((leader, index) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TeamCard leader={leader} showFullPageButton={false} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={styles.loadingCard}>
              <p>No team members are available yet. Add your leadership team through the admin panel to make them discoverable.</p>
            </div>
          )}

          <motion.div
            style={{ marginTop: "50px", textAlign: "center" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/about" className={styles.ctaButton}>
              Back to About
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}