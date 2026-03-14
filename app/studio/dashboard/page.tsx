"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import styles from "../studio.module.css"

interface Purchase {
  id: string
  createdAt: string
  amount: number
  template: {
    id: string
    title: string
    category: string
    previewImage: string
    downloadUrl: string | null
    isFree: boolean
  }
}

export default function StudioDashboardPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn) fetchPurchases()
    else setLoading(false)
  }, [isSignedIn])

  const fetchPurchases = async () => {
    try {
      const res = await fetch("/api/studio/purchases")
      const data = await res.json()
      setPurchases(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className={styles.loading} style={{ paddingTop: 120 }}>
        <div className={styles.spinner} />
        <p>Loading your library...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className={styles.noAccess}>
        <h2 className={styles.noAccessTitle}>Sign in to view your downloads</h2>
        <p className={styles.noAccessText}>Your purchased and downloaded templates will appear here.</p>
        <SignInButton mode="modal">
          <button className={styles.signInLink}>Sign In</button>
        </SignInButton>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.dashboardPage}>
          <div className={styles.dashboardHeader}>
            <h1 className={styles.dashboardTitle}>My Template Library</h1>
            <p className={styles.dashboardSubtitle}>
              {purchases.length} template{purchases.length !== 1 ? "s" : ""} in your library
            </p>
          </div>

          {purchases.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No templates yet</h3>
              <p>Browse Lumyn Studio and download your first template.</p>
              <Link
                href="/studio"
                style={{
                  marginTop: 24,
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "#4a4a4a",
                  color: "#ffffe3",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Browse Templates
              </Link>
            </div>
          ) : (
            <div className={styles.dashboardGrid}>
              {purchases.map((p) => (
                <div key={p.id} className={styles.dashCard}>
                  <div className={styles.dashCardImage}>
                    <Image
                      src={p.template.previewImage || "/placeholder.svg?height=160&width=280"}
                      alt={p.template.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.dashCardBody}>
                    <h3 className={styles.dashCardTitle}>{p.template.title}</h3>
                    <p className={styles.dashCardMeta}>
                      {p.template.category} · {p.amount === 0 ? "Free" : `$${p.amount.toFixed(2)}`} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                    {p.template.downloadUrl ? (
                      <a
                        href={p.template.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.dashCardBtn}
                      >
                        ↓ Download
                      </a>
                    ) : (
                      <span
                        className={styles.dashCardBtn}
                        style={{ opacity: 0.5, cursor: "default" }}
                      >
                        Download Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link href="/studio" style={{ color: "#6d8196", textDecoration: "none" }}>
              ← Browse More Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
