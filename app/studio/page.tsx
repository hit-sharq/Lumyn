"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./studio.module.css"

const CATEGORIES = ["All", "Developer", "Designer", "Freelancer", "Photographer", "Student", "Agency"]

interface Template {
  id: string
  title: string
  description: string
  category: string
  previewImage: string
  tags: string[]
  isFree: boolean
  price: number
  featured: boolean
  downloadCount: number
  reviews: { rating: number }[]
  _count: { purchases: number; reviews: number }
}

function avgRating(reviews: { rating: number }[]) {
  if (!reviews.length) return null
  return (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
}

export default function StudioPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("All")
  const [freeOnly, setFreeOnly] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [category, freeOnly])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== "All") params.set("category", category)
      if (freeOnly) params.set("isFree", "true")
      const res = await fetch(`/api/studio/templates?${params}`)
      const data = await res.json()
      setTemplates(Array.isArray(data) ? data : [])
    } catch (e) {
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Lumyn Studio</p>
        <h1 className={styles.heroTitle}>
          Premium Portfolio <span>Templates</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Professional templates crafted for developers, designers, freelancers and more.
          Download free or unlock premium designs.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{templates.length}+</div>
            <div className={styles.statLabel}>Templates</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{CATEGORIES.length - 1}</div>
            <div className={styles.statLabel}>Categories</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>Free</div>
            <div className={styles.statLabel}>To Start</div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.filterBar}>
          <div className={styles.filterInner}>
            <div className={styles.filterTabs}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.filterTab} ${category === cat ? styles.filterTabActive : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.filterRight}>
              <button
                className={`${styles.filterToggle} ${freeOnly ? styles.filterToggleActive : ""}`}
                onClick={() => setFreeOnly(!freeOnly)}
              >
                Free Only
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {category === "All" ? "All Templates" : `${category} Templates`}
              {freeOnly && " · Free"}
            </h2>
            <Link href="/studio/dashboard" style={{ color: "#6d8196", fontSize: "0.9rem", textDecoration: "none" }}>
              My Downloads →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No templates found</h3>
              <p>Try changing your filters or check back soon for new templates.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {templates.map((t) => {
                const rating = avgRating(t.reviews)
                return (
                  <Link key={t.id} href={`/studio/${t.id}`} className={styles.card}>
                    <div className={styles.cardImageWrapper}>
                      <Image
                        src={t.previewImage || "/placeholder.svg?height=220&width=400"}
                        alt={t.title}
                        fill
                        className={styles.cardImage}
                      />
                      <div className={styles.cardBadges}>
                        {t.isFree ? (
                          <span className={styles.badgeFree}>Free</span>
                        ) : (
                          <span className={styles.badgePremium}>Premium</span>
                        )}
                        {t.featured && <span className={styles.badgeFeatured}>Featured</span>}
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.cardCategory}>{t.category}</p>
                      <h3 className={styles.cardTitle}>{t.title}</h3>
                      <p className={styles.cardDesc}>{t.description}</p>
                      <div className={styles.cardFooter}>
                        <span className={`${styles.cardPrice} ${t.isFree ? styles.cardPriceFree : ""}`}>
                          {t.isFree ? "Free" : `$${t.price.toFixed(2)}`}
                        </span>
                        <div className={styles.cardMeta}>
                          {rating && <span>⭐ {rating}</span>}
                          <span>↓ {t.downloadCount}</span>
                        </div>
                      </div>
                      {t.tags.length > 0 && (
                        <div className={styles.cardTags}>
                          {t.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
