"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import styles from "../studio.module.css"

type Template = {
  id: string
  title: string
  category: string
  previewImage: string
  isFree: boolean
  price: number
  downloadCount: number
  _count: { purchases: number }
  createdAt: string
}

type Earning = {
  id: string
  amount: number
  platformFee: number
  authorShare: number
  status: string
  paidAt: string | null
  createdAt: string
  template: { title: string }
}

type Stats = {
  totalEarnings: number
  pendingEarnings: number
  totalSales: number
  totalTemplates: number
}

export default function CreatorDashboardPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [templates, setTemplates] = useState<Template[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn) fetchStats()
    else setLoading(false)
  }, [isSignedIn])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/studio/creator/stats")
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
        setEarnings(data.earnings || [])
        setStats(data.stats || null)
      }
    } catch (e) {
      console.error("Failed to fetch creator stats", e)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className={styles.loading} style={{ paddingTop: 120 }}>
        <div className={styles.spinner} />
        <p>Loading creator dashboard...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className={styles.noAccess}>
        <h2 className={styles.noAccessTitle}>Sign in to view your creator dashboard</h2>
        <p className={styles.noAccessText}>Track your template sales, earnings, and performance.</p>
        <SignInButton mode="modal">
          <button className={styles.signInLink}>Sign In</button>
        </SignInButton>
      </div>
    )
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.dashboardPage}>
          <div className={styles.dashboardHeader}>
            <h1 className={styles.dashboardTitle}>Creator Dashboard</h1>
            <p className={styles.dashboardSubtitle}>Manage your templates and track earnings</p>
          </div>

          {stats && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <div className={styles.growthCard}>
                <p className={styles.growthStatLabel}>Total Earnings</p>
                <p className={styles.growthStatValue}>{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className={styles.growthCard}>
                <p className={styles.growthStatLabel}>Pending Payouts</p>
                <p className={styles.growthStatValue}>{formatCurrency(stats.pendingEarnings)}</p>
              </div>
              <div className={styles.growthCard}>
                <p className={styles.growthStatLabel}>Total Sales</p>
                <p className={styles.growthStatValue}>{stats.totalSales}</p>
              </div>
              <div className={styles.growthCard}>
                <p className={styles.growthStatLabel}>Templates</p>
                <p className={styles.growthStatValue}>{stats.totalTemplates}</p>
              </div>
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">Your Templates</h2>
            {templates.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No templates yet</h3>
                <p>Contact the Lumyn team to publish your first template on Studio.</p>
              </div>
            ) : (
              <div className={styles.dashboardGrid}>
                {templates.map((t) => (
                  <div key={t.id} className={styles.dashCard}>
                    <div className={styles.dashCardImage}>
                      <Image
                        src={t.previewImage || "/placeholder.svg?height=160&width=280"}
                        alt={t.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.dashCardBody}>
                      <h3 className={styles.dashCardTitle}>{t.title}</h3>
                      <p className={styles.dashCardMeta}>
                        {t.category} · {t.isFree ? "Free" : `KES ${t.price.toLocaleString()}`} · {t._count?.purchases || 0} sales
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {t.downloadCount} downloads · Added {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-6">Recent Earnings</h2>
            {earnings.length === 0 ? (
              <p className="text-gray-500">No earnings yet. Sales will appear here once customers purchase your templates.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 font-medium text-gray-500">Template</th>
                      <th className="py-3 font-medium text-gray-500">Sale</th>
                      <th className="py-3 font-medium text-gray-500">Platform Fee</th>
                      <th className="py-3 font-medium text-gray-500">Your Share</th>
                      <th className="py-3 font-medium text-gray-500">Status</th>
                      <th className="py-3 font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((e) => (
                      <tr key={e.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{e.template.title}</td>
                        <td className="py-3">{formatCurrency(e.amount)}</td>
                        <td className="py-3 text-gray-500">{formatCurrency(e.platformFee)}</td>
                        <td className="py-3 font-medium">{formatCurrency(e.authorShare)}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${e.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {e.status === "paid" ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
