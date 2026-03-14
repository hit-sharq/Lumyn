"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useUser, SignInButton } from "@clerk/nextjs"
import styles from "../market.module.css"

interface Product {
  id: string
  title: string
  description: string
  category: string
  price: number
  previewImage: string | null
  fileUrl: string | null
  tags: string[]
  isFeatured: boolean
  salesCount: number
  creator: {
    id: string
    userId: string
    displayName: string
    bio: string | null
    website: string | null
    avatarUrl: string | null
  }
}

export default function MarketProductPage() {
  const { id } = useParams()
  const { isSignedIn } = useUser()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (id) {
      fetchProduct()
      if (isSignedIn) checkPurchase()
    }
  }, [id, isSignedIn])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/market/products/${id}`)
      const data = await res.json()
      setProduct(data)
    } finally {
      setLoading(false)
    }
  }

  const checkPurchase = async () => {
    try {
      const res = await fetch("/api/market/purchases")
      const data = await res.json()
      if (Array.isArray(data)) {
        setHasPurchased(data.some((p: any) => p.productId === id))
      }
    } catch {}
  }

  const handlePurchase = async () => {
    if (!isSignedIn) return
    setPurchasing(true)
    setMessage("")
    try {
      const res = await fetch("/api/market/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      })
      if (res.ok) {
        setHasPurchased(true)
        setMessage("Purchase successful! You can now download this product.")
        if (product?.fileUrl) window.open(product.fileUrl, "_blank")
      } else {
        const err = await res.json()
        setMessage(err.error || "Purchase failed. Please try again.")
      }
    } catch {
      setMessage("Something went wrong.")
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading} style={{ paddingTop: 120 }}>
        <div className={styles.spinner} />
        <p>Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.emptyState} style={{ paddingTop: 120 }}>
        <h3>Product not found</h3>
        <Link href="/market" style={{ color: "#7b3f00" }}>← Back to Market</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/market" className={styles.backLink}>← Back to Market</Link>

        <div className={styles.detailLayout}>
          <div className={styles.detailMain}>
            <div className={styles.detailPreview}>
              <Image
                src={product.previewImage || "/placeholder.svg?height=400&width=700"}
                alt={product.title}
                fill
                className={styles.detailPreviewImg}
              />
            </div>
            <p className={styles.detailCategory}>{product.category}</p>
            <h1 className={styles.detailTitle}>{product.title}</h1>
            <p className={styles.detailDesc}>{product.description}</p>
            {product.tags.length > 0 && (
              <div className={styles.cardTags}>
                {product.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            )}
          </div>

          <div className={styles.detailSidebar}>
            <div className={styles.detailCard}>
              <p className={styles.detailPrice}>${product.price.toFixed(2)}</p>

              {message && (
                <p style={{ color: message.includes("success") ? "#2ecc71" : "#e74c3c", fontWeight: 600, fontSize: "0.9rem", marginBottom: 16 }}>
                  {message}
                </p>
              )}

              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className={styles.detailBtn}>Sign in to Purchase</button>
                </SignInButton>
              ) : hasPurchased ? (
                product.fileUrl ? (
                  <a href={product.fileUrl} target="_blank" rel="noreferrer" className={styles.detailBtnDownload}>
                    ↓ Download Product
                  </a>
                ) : (
                  <div className={styles.detailBtn} style={{ opacity: 0.7, cursor: "default" }}>
                    ✓ Purchased · Download available soon
                  </div>
                )
              ) : (
                <button className={styles.detailBtn} onClick={handlePurchase} disabled={purchasing}>
                  {purchasing ? "Processing..." : `Buy for $${product.price.toFixed(2)}`}
                </button>
              )}

              <div className={styles.detailMeta}>
                <div className={styles.detailMetaItem}>
                  <span className={styles.detailMetaLabel}>Category</span>
                  <span className={styles.detailMetaValue}>{product.category}</span>
                </div>
                <div className={styles.detailMetaItem}>
                  <span className={styles.detailMetaLabel}>Sales</span>
                  <span className={styles.detailMetaValue}>{product.salesCount}</span>
                </div>
              </div>
            </div>

            <div className={styles.creatorCard}>
              <div className={styles.creatorCardAvatar}>
                {product.creator.displayName.charAt(0)}
              </div>
              <h3 className={styles.creatorCardName}>{product.creator.displayName}</h3>
              {product.creator.bio && (
                <p className={styles.creatorCardBio}>{product.creator.bio}</p>
              )}
              {product.creator.website && (
                <a href={product.creator.website} target="_blank" rel="noreferrer" className={styles.creatorCardLink}>
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
