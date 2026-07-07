"use client"

import { useState, useEffect } from "react"
import styles from "../growth.module.css"

type AnalyticsData = {
  totalRevenue: number
  newSignups: number
  activeSubscriptions: number
  conversionRate: { rate: number }
  topTemplates: { id: string; title: string; downloadCount: number }[]
  topJobPosts: { id: string; jobTitle: string; companyName: string; createdAt: string }[]
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount)

export default function AnalyticsManager() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to fetch analytics")
        }
        const data = await res.json()
        setAnalytics(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return <p className={styles.growthEmpty}>Loading analytics...</p>
  }

  if (error) {
    return <p className={styles.growthEmpty}>Error: {error}</p>
  }

  if (!analytics) {
    return <p className={styles.growthEmpty}>No analytics data yet</p>
  }

  return (
    <main className={styles.growthPage}>
      <div className={styles.growthHeader}>
        <h1 className={styles.growthTitle}>Analytics Dashboard</h1>
        <p className={styles.growthSubtitle}>Platform performance and revenue metrics</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className={styles.growthCard}>
          <p className={styles.growthStatLabel}>Total Revenue</p>
          <p className={styles.growthStatValue}>{formatCurrency(analytics.totalRevenue)}</p>
        </div>
        <div className={styles.growthCard}>
          <p className={styles.growthStatLabel}>New Signups</p>
          <p className={styles.growthStatValue}>{analytics.newSignups}</p>
        </div>
        <div className={styles.growthCard}>
          <p className={styles.growthStatLabel}>Active Subscriptions</p>
          <p className={styles.growthStatValue}>{analytics.activeSubscriptions}</p>
        </div>
        <div className={styles.growthCard}>
          <p className={styles.growthStatLabel}>Conversion Rate</p>
          <p className={styles.growthStatValue}>{analytics.conversionRate?.rate}%</p>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className={styles.growthCard}>
          <h2 className={styles.growthCardTitle}>Top Templates</h2>
          {analytics.topTemplates.length === 0 ? (
            <p className={styles.growthEmpty}>No template data yet</p>
          ) : (
            <table className={styles.growthTable}>
              <thead>
                <tr>
                  <th>Template</th>
                  <th>Downloads</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topTemplates.map((tpl) => (
                  <tr key={tpl.id}>
                    <td>{tpl.title}</td>
                    <td>{tpl.downloadCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.growthCard}>
          <h2 className={styles.growthCardTitle}>Recent Job Posts</h2>
          {analytics.topJobPosts.length === 0 ? (
            <p className={styles.growthEmpty}>No job posts yet</p>
          ) : (
            <table className={styles.growthTable}>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topJobPosts.map((job) => (
                  <tr key={job.id}>
                    <td>{job.jobTitle}</td>
                    <td>{job.companyName}</td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  )
}
