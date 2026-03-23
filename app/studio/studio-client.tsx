"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import styles from "./studio.module.css"

interface TemplateItem {
  id: string
  title: string
  description: string
  previewImage: string
  category: string
  price: number
  isFree: boolean
  featured: boolean
  tags: string[]
  downloadCount: number
  _count?: { purchases: number; reviews: number }
  reviews?: { rating: number }[]
}

const CATEGORIES = ["All", "Portfolio", "Business", "Landing Page", "Blog", "E-Commerce", "SaaS"]

export default function StudioClient({ initialTemplates = [] }: { initialTemplates?: TemplateItem[] }) {
  const [items, setItems] = useState<TemplateItem[]>(initialTemplates)
  const [filtered, setFiltered] = useState<TemplateItem[]>(initialTemplates)
  const [activeCategory, setActiveCategory] = useState("All")
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  useEffect(() => {
    let result = items
    if (activeCategory !== "All") result = result.filter((t) => t.category === activeCategory)
    if (showFreeOnly) result = result.filter((t) => t.isFree)
    setFiltered(result)
  }, [items, activeCategory, showFreeOnly])

  const featured = filtered.filter((t) => t.featured)
  const regular = filtered.filter((t) => !t.featured)

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Lumyn Studio</span>
          <h1 className={styles.heroHeadline}>
            Professional Templates,<br />Built to Launch
          </h1>
          <p className={styles.heroSub}>
            Pixel-perfect designs crafted by the Lumyn team. Download, customise, and ship.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>{items.length}</strong>
              <span>Templates</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>{items.filter((t) => t.isFree).length}</strong>
              <span>Free</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>{items.reduce((a, t) => a + (t.downloadCount || 0), 0)}</strong>
              <span>Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className={styles.filterStrip}>
        <div className={styles.filterInner}>
          <div className={styles.categoryPills}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            className={`${styles.freeToggle} ${showFreeOnly ? styles.freeToggleActive : ""}`}
            onClick={() => setShowFreeOnly((v) => !v)}
          >
            {showFreeOnly ? "✓ Free only" : "Free only"}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className={styles.contentArea}>

        {/* Featured */}
        {featured.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>⭐ Featured</h2>
            </div>
            <div className={styles.featuredGrid}>
              {featured.map((t) => (
                <TemplateCard key={t.id} template={t} featured />
              ))}
            </div>
          </section>
        )}

        {/* All / Filtered */}
        {regular.length > 0 && (
          <section className={styles.section}>
            {featured.length > 0 && (
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>All Templates</h2>
              </div>
            )}
            <div className={styles.templateGrid}>
              {regular.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </section>
        )}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎨</div>
            <h3 className={styles.emptyTitle}>No templates yet</h3>
            <p className={styles.emptyText}>
              {activeCategory !== "All" || showFreeOnly
                ? "Try a different filter or browse all categories."
                : "The team is crafting beautiful templates — check back soon."}
            </p>
            {(activeCategory !== "All" || showFreeOnly) && (
              <Button
                variant="outline"
                onClick={() => { setActiveCategory("All"); setShowFreeOnly(false) }}
                className="mt-4"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerInner}>
          <h2 className={styles.ctaTitle}>Need something custom?</h2>
          <p className={styles.ctaText}>
            Work with the Lumyn team to build a bespoke digital experience tailored to your brand.
          </p>
          <Link href="/contact" className={styles.ctaBtn}>Get in touch →</Link>
        </div>
      </section>
    </div>
  )
}

function TemplateCard({ template: t, featured }: { template: TemplateItem; featured?: boolean }) {
  const avgRating = t.reviews?.length
    ? (t.reviews.reduce((a, r) => a + r.rating, 0) / t.reviews.length).toFixed(1)
    : null

  return (
    <Link href={`/studio/${t.id}`} className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}>
      <div className={styles.cardThumb}>
        <Image
          src={t.previewImage}
          alt={t.title}
          fill
          className={styles.cardImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={styles.cardOverlay}>
          <span className={styles.previewBtn}>Preview →</span>
        </div>
        {t.featured && <span className={styles.featuredBadge}>Featured</span>}
        <span className={`${styles.priceBadge} ${t.isFree ? styles.priceBadgeFree : ""}`}>
          {t.isFree ? "FREE" : `KES ${t.price.toLocaleString()}`}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <Badge variant="secondary" className={styles.categoryBadge}>{t.category}</Badge>
          {avgRating && <span className={styles.rating}>⭐ {avgRating}</span>}
        </div>
        <h3 className={styles.cardTitle}>{t.title}</h3>
        <p className={styles.cardDesc}>{t.description}</p>

        {t.tags.length > 0 && (
          <div className={styles.tagRow}>
            {t.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className={styles.cardFooter}>
          <span className={styles.downloads}>↓ {t.downloadCount || 0} downloads</span>
          <span className={styles.getBtn}>{t.isFree ? "Download free" : "Get template"}</span>
        </div>
      </div>
    </Link>
  )
}
