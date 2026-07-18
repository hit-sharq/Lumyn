"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getPartnerStats, generatePartnerCode } from "@/lib/marketing/partners"
import { Plus, ExternalLink, Copy, TrendingUp, Users, DollarSign, MousePointer, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  phone?: string
  startDate?: string
  endDate?: string
  createdAt: string
}

export default function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    contactName: "",
    contactEmail: "",
    phone: "",
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
      const res = await fetch("/api/partners?admin=true", { cache: "no-store" })
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
      const url = editingPartner ? `/api/partners/${editingPartner.id}` : "/api/partners"
      const method = editingPartner ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage({ type: "success", text: editingPartner ? "Partner updated successfully!" : "Partner created successfully!" })
        setShowForm(false)
        setEditingPartner(null)
        resetForm()
        fetchPartners()
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "Failed to save partner" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      website: partner.website || "",
      contactName: partner.contactName || "",
      contactEmail: partner.contactEmail || "",
      phone: partner.phone || "",
      dealType: partner.dealType || "template_co_brand",
      commissionType: partner.commissionType || "revenue_share",
      commissionValue: partner.commissionValue?.toString() || "",
      status: partner.status,
      startDate: partner.startDate || "",
      endDate: partner.endDate || "",
      notes: "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this partner?")) return

    try {
      const res = await fetch(`/api/partners/${id}`, { method: "DELETE" })
      if (res.ok) {
        setMessage({ type: "success", text: "Partner removed" })
        fetchPartners()
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "Failed to remove partner" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      website: "",
      contactName: "",
      contactEmail: "",
      phone: "",
      dealType: "template_co_brand",
      commissionType: "revenue_share",
      commissionValue: "",
      status: "active",
      startDate: "",
      endDate: "",
      notes: "",
    })
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

  const totalClicks = partners.reduce((sum, p) => sum + p.clicks, 0)
  const totalConversions = partners.reduce((sum, p) => sum + p.conversions, 0)
  const totalRevenue = partners.reduce((sum, p) => sum + p.revenue, 0)

  if (loading) {
    return (
      <div className={styles.growthPage}>
        <div className="flex items-center justify-center h-64">
          <p className={styles.growthEmpty}>Loading partners...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.growthPage}>
      <div>
        <Link href="/admin" className={styles.growthBack}>
          ← Back to Admin
        </Link>
      </div>

      <div className={styles.growthHeader}>
        <h1 className={styles.growthTitle}>Partner Management</h1>
        <p className={styles.growthSubtitle}>Track partnerships, conversions, and commissions</p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${styles.growthCard} ${
              message.type === "success"
                ? "border-green-500/30"
                : "border-red-500/30"
            }`}
            style={{ marginBottom: 24 }}
          >
            <p className={message.type === "success" ? styles.growthBadgeSuccess : styles.growthBadgeWarning} style={{ display: "inline-flex" }}>
              {message.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ marginBottom: 24 }}>
        <div className={styles.growthCard}>
          <div className="flex items-center gap-3">
            <div style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
              <Users className="h-5 w-5" style={{ color: "rgba(255,255,227,0.6)" }} />
            </div>
            <div>
              <p className={styles.growthStatLabel}>Total Partners</p>
              <p className={styles.growthStatValue}>{partners.length}</p>
            </div>
          </div>
        </div>
        <div className={styles.growthCard}>
          <div className="flex items-center gap-3">
            <div style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
              <MousePointer className="h-5 w-5" style={{ color: "rgba(255,255,227,0.6)" }} />
            </div>
            <div>
              <p className={styles.growthStatLabel}>Total Clicks</p>
              <p className={styles.growthStatValue}>{totalClicks}</p>
            </div>
          </div>
        </div>
        <div className={styles.growthCard}>
          <div className="flex items-center gap-3">
            <div style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
              <TrendingUp className="h-5 w-5" style={{ color: "rgba(255,255,227,0.6)" }} />
            </div>
            <div>
              <p className={styles.growthStatLabel}>Total Conversions</p>
              <p className={styles.growthStatValue}>{totalConversions}</p>
            </div>
          </div>
        </div>
        <div className={styles.growthCard}>
          <div className="flex items-center gap-3">
            <div style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
              <DollarSign className="h-5 w-5" style={{ color: "rgba(255,255,227,0.6)" }} />
            </div>
            <div>
              <p className={styles.growthStatLabel}>Revenue Generated</p>
              <p className={styles.growthStatValue}>{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.growthCard} style={{ marginBottom: 24 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <div>
            <h2 className={styles.growthCardTitle}>Partners</h2>
            <p className={styles.growthCardSubtitle} style={{ marginBottom: 0 }}>
              Manage and monitor your partner network
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPartner(null)
              resetForm()
              setShowForm(!showForm)
            }}
            className={styles.growthButton}
            style={{ width: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Plus className="h-4 w-4" />
            Add Partner
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ borderTop: "1px solid rgba(255,255,227,0.08)", paddingTop: 24, marginTop: 24 }}>
                <h3 className={styles.growthCardTitle} style={{ marginBottom: 16 }}>
                  {editingPartner ? "Edit Partner" : "Add New Partner"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2" style={{ marginBottom: 16 }}>
                    <div>
                      <label className={styles.growthLabel}>Company Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className={styles.growthInput}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label className={styles.growthLabel}>Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className={styles.growthInput}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2" style={{ marginBottom: 16 }}>
                    <div>
                      <label className={styles.growthLabel}>Contact Name</label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={styles.growthInput}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className={styles.growthLabel}>Contact Email</label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className={styles.growthInput}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2" style={{ marginBottom: 16 }}>
                    <div>
                      <label className={styles.growthLabel}>Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={styles.growthInput}
                        placeholder="+254 700 000000"
                      />
                    </div>
                    <div>
                      <label className={styles.growthLabel}>Commission Value (KES)</label>
                      <input
                        type="number"
                        value={formData.commissionValue}
                        onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                        className={styles.growthInput}
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3" style={{ marginBottom: 16 }}>
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
                      <label className={styles.growthLabel}>Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={styles.growthInput}
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2" style={{ marginBottom: 16 }}>
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

                  <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={submitting} className={styles.growthButton} style={{ width: "auto" }}>
                      {submitting ? "Saving..." : editingPartner ? "Update Partner" : "Save Partner"}
                    </button>
                    <button
                      type="button"
                      onClick={generateCode}
                      className={styles.growthButtonSecondary}
                      style={{ width: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}
                    >
                      <Copy className="h-4 w-4" />
                      Generate Tracking Code
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingPartner(null)
                        resetForm()
                      }}
                      className={styles.growthButtonSecondary}
                      style={{ width: "auto" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.growthCard}>
        {partners.length === 0 ? (
          <div className={styles.growthEmpty}>
            <Users className="h-12 w-12" style={{ margin: "0 auto 16px", opacity: 0.4 }} />
            <p style={{ margin: 0 }}>No partners yet. Add your first partner to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                        <p style={{ fontWeight: 600, color: "rgba(255,255,227,0.9)" }}>{partner.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,227,0.4)" }}>{partner.contactEmail}</p>
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize" }}>
                        {partner.dealType?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 500, color: "rgba(255,255,227,0.8)" }}>
                          {partner.commissionType?.replace(/_/g, " ")}
                        </p>
                        {partner.commissionValue && (
                          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,227,0.4)" }}>
                            {formatCurrency(Number(partner.commissionValue))}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <MousePointer className="h-3 w-3" style={{ color: "rgba(255,255,227,0.5)" }} />
                        {partner.clicks}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Users className="h-3 w-3" style={{ color: "rgba(255,255,227,0.5)" }} />
                        {partner.conversions}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <DollarSign className="h-3 w-3" style={{ color: "rgba(255,255,227,0.5)" }} />
                        <span style={{ fontWeight: 500 }}>{formatCurrency(partner.revenue)}</span>
                      </span>
                    </td>
                    <td>
                      <span
                        className={partner.status === "active" ? styles.growthBadgeSuccess : styles.growthBadgeWarning}
                        style={{ textTransform: "capitalize" }}
                      >
                        {partner.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "rgba(255,255,227,0.5)", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,227,0.9)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,227,0.5)")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(partner)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,227,0.5)", transition: "color 0.2s", padding: 0 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,227,0.9)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,227,0.5)")}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,227,0.5)", transition: "color 0.2s", padding: 0 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,227,0.5)")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
