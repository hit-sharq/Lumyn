import { auth } from "@clerk/nextjs/server"
import { getAdminAnalytics } from "@/lib/marketing/analytics"
import { redirect } from "next/navigation"
import styles from "../growth.module.css"

export const dynamic = "force-dynamic"

export default async function AdminAnalyticsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  if (!adminIds.includes(userId)) {
    redirect("/")
  }

  const analytics = await getAdminAnalytics()

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <main className={styles.growthPage}>
      <div>
        <a href="/admin" className={styles.growthBack}>
          ← Back to Admin
        </a>
      </div>
      <div className={styles.growthHeader}>
        <h1 className={styles.growthTitle}>Analytics Dashboard</h1>
        <p className={styles.growthSubtitle}>
          Platform performance and revenue metrics
        </p>
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
          <p className={styles.growthStatValue}>{analytics.conversionRate}%</p>
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
                {analytics.topTemplates.map((tpl: any) => (
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
                {analytics.topJobPosts.map((job: any) => (
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
