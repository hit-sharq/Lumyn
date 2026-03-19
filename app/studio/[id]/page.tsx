"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import styles from "../studio.module.css"

interface Template {
  id: string
  title: string
  description: string
  category: string
  previewImage: string
  previewImages: string[]
  tags: string[]
  isFree: boolean
  price: number
  downloadUrl: string | null
  featured: boolean
  downloadCount: number
  reviews: { id: string; userName: string; rating: number; comment: string | null; createdAt: string }[]
  _count: { purchases: number; reviews: number }
}

export default function TemplateDetailPage() {
  const { id } = useParams()
  const { user, isSignedIn } = useUser()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (id) {
      fetchTemplate()
      if (isSignedIn) checkPurchase()
    }
  }, [id, isSignedIn])

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`/api/studio/templates/${id}`)
      const data = await res.json()
      setTemplate(data)
    } finally {
      setLoading(false)
    }
  }

  const checkPurchase = async () => {
    try {
      const res = await fetch("/api/studio/purchases")
      const data = await res.json()
      if (Array.isArray(data)) {
        setHasPurchased(data.some((p: any) => p.templateId === id))
      }
    } catch {}
  }

  const handleDownload = async () => {
    if (!isSignedIn) return
    setPurchasing(true)
    setMessage("")
    try {
      if (!template) return

      if (template.isFree) {
        const res = await fetch("/api/studio/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: id }),
        })
        if (res.ok) {
          setHasPurchased(true)
          setMessage("Template unlocked! Download link is now available.")
          if (template.downloadUrl) window.open(template.downloadUrl, "_blank")
        }
      } else {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "studio_template",
            itemId: id,
            amount: template.price,
            currency: "KES",
            description: `Lumyn Studio — ${template.title}`,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        window.location.href = data.redirect_url
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong. Please try again.")
    } finally {
      setPurchasing(false)
    }
  }

  const avgRating = template?.reviews.length
    ? (template.reviews.reduce((a, b) => a + b.rating, 0) / template.reviews.length).toFixed(1)
    : null

  if (loading) {
    return (
      <div className={styles.loading} style={{ paddingTop: 120 }}>
        <div className={styles.spinner} />
        <p>Loading template...</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className={styles.emptyState} style={{ paddingTop: 120 }}>
        <h3>Template not found</h3>
        <Link href="/studio" style={{ color: "#4a4a4a" }}>← Back to Studio</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/studio" className={styles.backLink}>
          ← Back to Studio
        </Link>

        <div className={styles.detailLayout}>
          <div>
            <div className={styles.detailPreview}>
              <Image
                src={template.previewImage || "/placeholder.svg?height=500&width=800"}
                alt={template.title}
                fill
                className={styles.detailPreviewImg}
              />
            </div>

            {template.reviews.length > 0 && (
              <div className={styles.reviewSection}>
                <h3 className={styles.reviewTitle}>
                  Reviews ({template._count.reviews})
                  {avgRating && <span className={styles.stars}> · ⭐ {avgRating}</span>}
                </h3>
                {template.reviews.map((r) => (
                  <div key={r.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAuthor}>{r.userName}</span>
                      <span className={styles.reviewRating}>{"⭐".repeat(r.rating)}</span>
                    </div>
                    {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.detailSidebar}>
            <div className={styles.detailCard}>
              <p className={styles.detailCategory}>{template.category}</p>
              <h1 className={styles.detailTitle}>{template.title}</h1>
              <p className={`${styles.detailPrice} ${template.isFree ? styles.detailPriceFree : ""}`}>
                Paid Download
              </p>
              <p className={styles.detailDesc}>{template.description}</p>

              {message && (
                <p style={{ color: "#2ecc71", fontWeight: 600, marginBottom: 16, fontSize: "0.9rem" }}>{message}</p>
              )}

              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className={styles.detailBtn}>Sign in to Download</button>
                </SignInButton>
              ) : hasPurchased ? (
                template.downloadUrl ? (
                  <a href={template.downloadUrl} target="_blank" rel="noreferrer" className={styles.detailBtn}>
                    ↓ Download Template
                  </a>
                ) : (
                  <div className={styles.detailBtn} style={{ opacity: 0.6, cursor: "default" }}>
                    ✓ Unlocked · Download link coming soon
                  </div>
                )
              ) : (
                <button className={styles.detailBtn} onClick={handleDownload} disabled={purchasing}>
                  {purchasing ? "Processing..." : "Buy Now"}
                </button>
              )}

              <Link href="/launch" className={styles.detailBtnSecondary}>
                Build a Portfolio with Lumyn Launch →
              </Link>

              <div className={styles.detailMeta}>
                <div className={styles.detailMetaItem}>
                  <span className={styles.detailMetaLabel}>Category</span>
                  <span className={styles.detailMetaValue}>{template.category}</span>
                </div>
                <div className={styles.detailMetaItem}>
                  <span className={styles.detailMetaLabel}>Downloads</span>
                  <span className={styles.detailMetaValue}>{template.downloadCount}</span>
                </div>
                {avgRating && (
                  <div className={styles.detailMetaItem}>
                    <span className={styles.detailMetaLabel}>Rating</span>
                    <span className={styles.detailMetaValue}>⭐ {avgRating} / 5</span>
                  </div>
                )}
                {template.tags.length > 0 && (
                  <div className={styles.detailMetaItem}>
                    <span className={styles.detailMetaLabel}>Tags</span>
                    <div className={styles.cardTags}>
                      {template.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
