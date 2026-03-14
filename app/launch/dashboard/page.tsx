"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser, SignInButton } from "@clerk/nextjs"
import styles from "../launch.module.css"

interface Portfolio {
  id: string
  username: string
  displayName: string
  templateId: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  projects: any[]
}

export default function LaunchDashboardPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (isSignedIn) fetchPortfolios()
    else setLoading(false)
  }, [isSignedIn])

  const fetchPortfolios = async () => {
    try {
      const res = await fetch("/api/launch/portfolios")
      const data = await res.json()
      setPortfolios(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const deletePortfolio = async (id: string) => {
    if (!confirm("Delete this portfolio? This cannot be undone.")) return
    setDeleting(id)
    try {
      await fetch(`/api/launch/portfolios/${id}`, { method: "DELETE" })
      setPortfolios(ps => ps.filter(p => p.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className={styles.loading} style={{ paddingTop: 120 }}>
        <div className={styles.spinner} />
        <p>Loading your portfolios...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className={styles.noAccess}>
        <h2 className={styles.noAccessTitle}>Sign in to manage your portfolios</h2>
        <p className={styles.noAccessText}>Your portfolios will appear here once you sign in.</p>
        <SignInButton mode="modal">
          <button style={{ padding: "12px 32px", background: "#1a3a5c", color: "#ffffe3", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}>
            Sign In
          </button>
        </SignInButton>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.dashHeader}>
        <div className={styles.container}>
          <h1 className={styles.dashTitle}>My Portfolios</h1>
          <p className={styles.dashSubtitle}>Manage and publish your portfolio websites</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.dashContent}>
          <div className={styles.dashActions}>
            <Link href="/launch/builder" className={styles.dashActionBtn}>
              + Create New Portfolio
            </Link>
          </div>

          {portfolios.length === 0 ? (
            <div className={styles.emptyDash}>
              <h3 className={styles.emptyDashTitle}>No portfolios yet</h3>
              <p className={styles.emptyDashText}>
                Create your first portfolio website in minutes.
              </p>
              <Link href="/launch/builder" className={styles.dashActionBtn}>
                Start Building
              </Link>
            </div>
          ) : (
            <div className={styles.portfolioGrid}>
              {portfolios.map((p) => (
                <div key={p.id} className={styles.portfolioCard}>
                  <div className={styles.portfolioCardImage}>
                    <span style={{ fontSize: "2rem" }}>🌐</span>
                  </div>
                  <div className={styles.portfolioCardBody}>
                    <h3 className={styles.portfolioCardName}>{p.displayName}</h3>
                    <p className={styles.portfolioCardMeta}>
                      @{p.username} · {p.projects.length} project{p.projects.length !== 1 ? "s" : ""}
                    </p>
                    <span className={`${styles.portfolioCardStatus} ${p.isPublished ? styles.statusPublished : styles.statusDraft}`}>
                      {p.isPublished ? "● Live" : "○ Draft"}
                    </span>
                    <div className={styles.portfolioCardActions}>
                      <Link
                        href={`/launch/builder?edit=${p.id}`}
                        className={`${styles.cardBtnSmall} ${styles.cardBtnPrimary}`}
                      >
                        Edit
                      </Link>
                      {p.isPublished && (
                        <a
                          href={`/portfolio/${p.username}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.cardBtnSmall} ${styles.cardBtnOutline}`}
                        >
                          View ↗
                        </a>
                      )}
                      <button
                        className={`${styles.cardBtnSmall} ${styles.cardBtnOutline}`}
                        style={{ color: "#e74c3c", borderColor: "rgba(231,76,60,0.3)" }}
                        onClick={() => deletePortfolio(p.id)}
                        disabled={deleting === p.id}
                      >
                        {deleting === p.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
