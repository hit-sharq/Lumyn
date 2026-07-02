"use client"

import { useState, useEffect } from "react"
import { getPartnerStats, generatePartnerCode } from "@/lib/marketing/partners"
import { Plus, ExternalLink, Copy, TrendingUp, Users, DollarSign, MousePointer } from "lucide-react"
import { motion } from "framer-motion"
import styles from "../growth.module.css"

interface Partner {
  id: string
  name: string
  website?: string
  dealType?: string
  commissionType?: string
  commissionValue?: number
  status: string
  clicks: number
  conversions: number
  revenue: number
  contactName?: string
  contactEmail?: string
  startDate?: string
  endDate?: string
  createdAt: string
}

export default function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    website: "",
    category: "general",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    dealType: "template_co_brand",
    commissionType: "revenue_share",
    commissionValue: "",
    status: "active",
    startDate: "",
    endDate: "",
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setPartners(data)
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Partner created successfully!" })
        setShowForm(false)
        setFormData({
          name: "",
          description: "",
          logoUrl: "",
          website: "",
          category: "general",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          dealType: "template_co_brand",
          commissionType: "revenue_share",
          commissionValue: "",
          status: "active",
          startDate: "",
          endDate: "",
          notes: "",
        })
        fetchPartners()
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "Failed to create partner" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  const generateCode = () => {
    if (formData.name) {
      const code = generatePartnerCode(formData.name)
      alert(`Partner Code: ${code}\n\nShare this code with your partner to track their referrals.`)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)

  if (loading) {
    return (
      <div className={styles.growthPage}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </div>
    )
  }

  return (
    <main className={styles.growthPage}>
      <div>
        <a href="/admin" className={styles.growthBack}>
          ← Back to Admin
        </a>
      </div>
      <div className={styles.growthHeader}>
        <h1 className={styles.growthTitle}>Partner Management</h1>
        <p className={styles.growthSubtitle}>Track partnerships, conversions, and commissions</p>
      </div>

      {message && (
        <div
          className={`${styles.growthCard} ${
            message.type === "success"
              ? "border-green-500/30 bg-green-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>{message.text}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className={styles.growthCard}>
            <p className={styles.growthStatLabel}>Total Partners</p>
            <p className={styles.growthStatValue}>{partners.length}</p>
          </div>
          <div className={styles.growthCard}>
            <p className={styles.growthStatLabel}>Total Clicks</p>
            <p className={styles.growthStatValue}>
              {partners.reduce((sum, p) => sum + p.clicks, 0)}
            </p>
          </div>
          <div className={styles.growthCard}>
            <p className={styles.growthStatLabel}>Total Conversions</p>
            <p className={styles.growthStatValue}>
              {partners.reduce((sum, p) => sum + p.conversions, 0)}
            </p>
          </div>
          <div className={styles.growthCard}>
            <p className={styles.growthStatLabel}>Revenue Generated</p>
            <p className={styles.growthStatValue}>
              {formatCurrency(partners.reduce((sum, p) => sum + p.revenue, 0))}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.growthButton}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Add Partner
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.growthCard}
        >
          <h2 className={styles.growthCardTitle}>Add New Partner</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.growthLabel}>Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className={styles.growthInput}
                />
              </div>
              <div>
                <label className={styles.growthLabel}>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={styles.growthInput}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.growthLabel}>Contact Name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className={styles.growthInput}
                />
              </div>
              <div>
                <label className={styles.growthLabel}>Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className={styles.growthInput}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={styles.growthLabel}>Deal Type</label>
                <select
                  value={formData.dealType}
                  onChange={(e) => setFormData({ ...formData, dealType: e.target.value })}
                  className={styles.growthInput}
                >
                  <option value="template_co_brand">Template Co-Brand</option>
                  <option value="job_board">Job Board</option>
                  <option value="university">University</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="media">Media</option>
                </select>
              </div>
              <div>
                <label className={styles.growthLabel}>Commission Type</label>
                <select
                  value={formData.commissionType}
                  onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })}
                  className={styles.growthInput}
                >
                  <option value="flat_fee">Flat Fee</option>
                  <option value="per_click">Per Click</option>
                  <option value="per_conversion">Per Conversion</option>
                  <option value="revenue_share">Revenue Share</option>
                </select>
              </div>
              <div>
                <label className={styles.growthLabel}>Commission Value (KES)</label>
                <input
                  type="number"
                  value={formData.commissionValue}
                  onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                  className={styles.growthInput}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.growthLabel}>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={styles.growthInput}
                />
              </div>
              <div>
                <label className={styles.growthLabel}>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={styles.growthInput}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className={styles.growthButton}>
                {submitting ? "Saving..." : "Save Partner"}
              </button>
              <button
                type="button"
                onClick={generateCode}
                className={styles.growthButtonSecondary}
              >
                Generate Tracking Code
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={styles.growthButtonSecondary}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="mt-8">
        {partners.length === 0 ? (
          <p className={styles.growthEmpty}>No partners yet. Add your first partner above.</p>
        ) : (
          <div className={styles.growthCard}>
            <table className={styles.growthTable}>
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Deal Type</th>
                  <th>Commission</th>
                  <th>Clicks</th>
                  <th>Conversions</th>
                  <th>Revenue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id}>
                    <td>
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-xs text-slate-500">{partner.contactEmail}</p>
                      </div>
                    </td>
                    <td>{partner.dealType?.replace(/_/g, " ")}</td>
                    <td>
                      {partner.commissionType} {partner.commissionValue ? `(${partner.commissionValue})` : ""}
                    </td>
                    <td>
                      <span className="flex items-center gap-1">
                        <MousePointer className="h-3 w-3" /> {partner.clicks}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {partner.conversions}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> {formatCurrency(partner.revenue)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.growthBadge} ${partner.status === "active" ? styles.growthBadgeSuccess : styles.growthBadgeWarning}`}>
                        {partner.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
