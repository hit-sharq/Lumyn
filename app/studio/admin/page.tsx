"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"

interface Template {
  id: string
  title: string
  category: string
  previewImage: string
  isFree: boolean
  price: number
  featured: boolean
  isPublished: boolean
  downloadCount: number
  createdAt: string
  _count?: { purchases: number; reviews: number }
}

const CATEGORIES = ["Portfolio", "Business", "Landing Page", "Blog", "E-Commerce", "SaaS"]

const emptyForm = {
  title: "",
  description: "",
  category: "Portfolio",
  previewImage: "",
  previewImages: "",
  tags: "",
  isFree: true,
  price: 0,
  downloadUrl: "",
  featured: false,
}

export default function StudioAdminPage() {
  const { user, isLoaded } = useUser()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const adminIds = (process.env.NEXT_PUBLIC_ADMIN_IDS || "").split(",").filter(Boolean)
  const isAdmin = isLoaded && user && adminIds.includes(user.id)

  useEffect(() => {
    if (isAdmin) fetchTemplates()
    else if (isLoaded) setLoading(false)
  }, [isAdmin, isLoaded])

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/studio/templates?all=true")
      const data = await res.json()
      setTemplates(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    try {
      const payload = {
        ...form,
        previewImages: form.previewImages.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        price: form.isFree ? 0 : Number(form.price),
      }
      const res = await fetch("/api/studio/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage({ type: "success", text: `Template "${data.title}" created successfully!` })
      setForm(emptyForm)
      setShowForm(false)
      fetchTemplates()
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create template" })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/studio/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current }),
      })
      setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, featured: !current } : t))
    } catch {}
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template? This cannot be undone.")) return
    try {
      await fetch(`/api/studio/templates/${id}`, { method: "DELETE" })
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch {}
  }

  if (!isLoaded || loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#6b7280" }}>Loading…</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: 24 }}>
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Admin Access Only</h2>
        <p style={{ color: "#6b7280", margin: 0 }}>You don't have permission to access this page.</p>
        <Link href="/studio" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>← Back to Studio</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <Link href="/studio" style={{ color: "#6b7280", fontSize: "0.9rem", textDecoration: "none" }}>← Studio</Link>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "8px 0 4px", color: "#111" }}>Template Admin</h1>
            <p style={{ color: "#6b7280", margin: 0 }}>{templates.length} templates total</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setMessage(null) }}
            style={{ background: "#111", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
          >
            {showForm ? "✕ Cancel" : "+ New Template"}
          </button>
        </div>

        {/* Feedback */}
        {message && (
          <div style={{
            background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            color: message.type === "success" ? "#15803d" : "#dc2626",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 28,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}>
            {message.text}
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 32, marginBottom: 40 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 28px", color: "#111" }}>Create New Template</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <FormField label="Title *">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Modern Portfolio Template" style={inputStyle} />
              </FormField>
              <FormField label="Category *">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="Description *" style={{ marginBottom: 20 }}>
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A clean, modern portfolio template perfect for creatives and developers." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <FormField label="Preview Image URL *">
                <input required value={form.previewImage} onChange={(e) => setForm({ ...form, previewImage: e.target.value })} placeholder="https://res.cloudinary.com/..." style={inputStyle} />
              </FormField>
              <FormField label="Additional Preview URLs (comma-separated)">
                <input value={form.previewImages} onChange={(e) => setForm({ ...form, previewImages: e.target.value })} placeholder="https://..., https://..." style={inputStyle} />
              </FormField>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
              <FormField label="Tags (comma-separated)">
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, Tailwind, Dark mode" style={inputStyle} />
              </FormField>
              <FormField label="Pricing">
                <div style={{ display: "flex", gap: 12, alignItems: "center", height: 44 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.9rem" }}>
                    <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />
                    Free
                  </label>
                  {!form.isFree && (
                    <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price (KES)" style={{ ...inputStyle, flex: 1 }} />
                  )}
                </div>
              </FormField>
              <FormField label="Download URL">
                <input value={form.downloadUrl} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })} placeholder="https://drive.google.com/..." style={inputStyle} />
              </FormField>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Mark as Featured
              </label>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={submitting} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Creating…" : "Create Template"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Template List */}
        {templates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "#6b7280" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎨</div>
            <p>No templates yet. Create your first one above.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {templates.map((t) => (
              <div key={t.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: 80, height: 54, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", flexShrink: 0 }}>
                  <Image src={t.previewImage || "/placeholder.svg"} alt={t.title} fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}>{t.title}</span>
                    {t.featured && <span style={{ background: "#fbbf24", color: "#000", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>FEATURED</span>}
                    {!t.isPublished && <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>DRAFT</span>}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                    {t.category} · {t.isFree ? "Free" : `KES ${t.price.toLocaleString()}`} · {t.downloadCount} downloads · {t._count?.purchases || 0} purchases
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Link href={`/studio/${t.id}`} target="_blank" style={{ ...actionBtnStyle, background: "#f3f4f6", color: "#374151" }}>View</Link>
                  <button onClick={() => toggleFeatured(t.id, t.featured)} style={{ ...actionBtnStyle, background: t.featured ? "#fef9c3" : "#f3f4f6", color: "#374151" }}>
                    {t.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} style={{ ...actionBtnStyle, background: "#fef2f2", color: "#dc2626" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function FormField({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e5e7eb",
  borderRadius: 8,
  fontSize: "0.9rem",
  color: "#111",
  background: "#fafafa",
  outline: "none",
  boxSizing: "border-box",
}

const actionBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  fontSize: "0.8rem",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
}
