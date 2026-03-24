"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser, SignInButton } from "@clerk/nextjs"
import styles from "./market.module.css"

const CATEGORIES = ["All", "Templates", "UI Kits", "Icons", "Fonts", "eBooks", "Courses", "Tools", "Other"]

interface Product {
  id: string
  title: string
  description: string
  category: string
  price: number
  previewImage: string | null
  tags: string[]
  isFeatured: boolean
  salesCount: number
  creator: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
}

export default function MarketPage() {
  const { isSignedIn } = useUser()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("All")

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== "All") params.set("category", category)
      const res = await fetch(`/api/market/products?${params}`)
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Lumyn Market</p>
          <h1 className={styles.heroTitle}>
            Digital Products <span>Marketplace</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover and buy premium digital products from talented creators.
            Templates, UI kits, eBooks, courses, and more.
          </p>
          <div className={styles.heroActions}>
            <Link href="#products" className={styles.heroBtnPrimary}>
              Browse Products →
            </Link>
            {isSignedIn ? (
              <Link href="/market/dashboard" className={styles.heroBtnSecondary}>
                Sell Your Products
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className={styles.heroBtnSecondary}>Become a Creator</button>
              </SignInButton>
            )}
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>20%</span>
              <span className={styles.heroStatLabel}>Commission Only</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>KES</span>
              <span className={styles.heroStatLabel}>Local Currency</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>Instant</span>
              <span className={styles.heroStatLabel}>Downloads</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container} id="products">
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
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {category === "All" ? "All Products" : category}
              <span style={{ fontWeight: 400, fontSize: "1rem", color: "#6d8196", marginLeft: 12 }}>
                {products.length} item{products.length !== 1 ? "s" : ""}
              </span>
            </h2>
            <Link href="/market/dashboard" className={styles.sectionLink}>
              My Purchases →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No products yet</h3>
              <p>Be the first to list a product in this category!</p>
              <Link
                href="/market/dashboard"
                className={styles.heroBtnPrimary}
                style={{ marginTop: 24, display: "inline-block", textDecoration: "none" }}
              >
                Start Selling →
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((p) => (
                <Link key={p.id} href={`/market/${p.id}`} className={styles.card}>
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={p.previewImage || "/placeholder.svg?height=200&width=400"}
                      alt={p.title}
                      fill
                      className={styles.cardImage}
                    />
                    {p.isFeatured && (
                      <div className={styles.cardBadges}>
                        <span className={styles.badgeFeatured}>Featured</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardCategory}>{p.category}</p>
                    <h3 className={styles.cardTitle}>{p.title}</h3>
                    <p className={styles.cardDesc}>{p.description}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardPrice}>${p.price.toFixed(2)}</span>
                      <div className={styles.creatorInfo}>
                        <div className={styles.creatorAvatar}>
                          {p.creator.displayName.charAt(0)}
                        </div>
                        <span className={styles.creatorName}>{p.creator.displayName}</span>
                      </div>
                    </div>
                    {p.tags.length > 0 && (
                      <div className={styles.cardTags}>
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t} className={styles.tag}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
