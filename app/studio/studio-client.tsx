"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
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

const CATEGORIES = ["All", "Portfolio", "Business", "Landing Page", "Blog", "E-Commerce", "SaaS", "Restaurant", "Event", "Church", "School", "Real Estate", "Medical", "Nonprofit", "Musician"]

export default function StudioClient({ initialTemplates = [] }: { initialTemplates?: TemplateItem[] }) {
  const { user, isSignedIn } = useUser()
  const [items, setItems] = useState<TemplateItem[]>(initialTemplates)
  const [filtered, setFiltered] = useState<TemplateItem[]>(initialTemplates)
  const [activeCategory, setActiveCategory] = useState("All")
  const [showFreeOnly, setShowFreeOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    let result = [...items]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    if (activeCategory !== "All") result = result.filter((t) => t.category === activeCategory)
    if (showFreeOnly) result = result.filter((t) => t.isFree)

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => (b._count?.purchases || 0) - (a._count?.purchases || 0))
        break
      case "newest":
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => {
          const avgA = a.reviews?.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0
          const avgB = b.reviews?.length ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0
          return avgB - avgA
        })
        break
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFiltered(result)
  }, [items, activeCategory, showFreeOnly, searchQuery, sortBy])

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
          {isSignedIn && (
            <div style={{ marginTop: 32 }}>
              <Link href="/studio/creator" className={styles.ctaBtn} style={{ display: "inline-block", background: "#fff", color: "#111", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem" }}>
                Creator Dashboard →
              </Link>
            </div>
          )}
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
          <div className={styles.filterControls}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button
              className={`${styles.freeToggle} ${showFreeOnly ? styles.freeToggleActive : ""}`}
              onClick={() => setShowFreeOnly((v) => !v)}
            >
              {showFreeOnly ? "✓ Free only" : "Free only"}
            </button>
          </div>
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
          <span className={styles.downloads}>↓ {t.downloadCount || 0} downloads · {t._count?.purchases || 0} sales</span>
          <span className={styles.getBtn}>{t.isFree ? "Download free" : "Get template"}</span>
        </div>
      </div>
    </Link>
  )
}
