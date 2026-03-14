"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "../admin.module.css"

const CATEGORIES = ["Developer", "Designer", "Freelancer", "Photographer", "Student", "Agency"]

const emptyForm = {
  title: "", description: "", category: "Developer",
  previewImage: "", tags: "", isFree: true, price: "0", downloadUrl: "", featured: false
}

export default function StudioManager() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => { fetchTemplates() }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/studio/templates?isPublished=all")
      const data = await res.json()
      const res2 = await fetch("/api/studio/templates")
      const all = await res2.json()
      setTemplates(Array.isArray(all) ? all : [])
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setEditItem(null)
    setForm(emptyForm)
    setShowForm(true)
    setMessage("")
  }

  const openEdit = (t: any) => {
    setEditItem(t)
    setForm({
      title: t.title, description: t.description, category: t.category,
      previewImage: t.previewImage, tags: t.tags.join(", "),
      isFree: t.isFree, price: t.price.toString(), downloadUrl: t.downloadUrl || "", featured: t.featured
    })
    setShowForm(true)
    setMessage("")
  }

  const submit = async () => {
    if (!form.title || !form.description || !form.previewImage) {
      setMessage("Please fill in title, description, and preview image.")
      return
    }
    setSaving(true)
    setMessage("")
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      }
      let res
      if (editItem) {
        res = await fetch(`/api/studio/templates/${editItem.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        })
      } else {
        res = await fetch("/api/studio/templates", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        })
      }
      if (res.ok) {
        setShowForm(false)
        fetchTemplates()
        setMessage(editItem ? "Template updated!" : "Template created!")
      } else {
        const err = await res.json()
        setMessage(err.error || "Failed to save.")
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return
    await fetch(`/api/studio/templates/${id}`, { method: "DELETE" })
    fetchTemplates()
  }

  if (loading) return <p style={{ color: "#6d8196" }}>Loading templates...</p>

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, color: "#4a4a4a", fontSize: "1.2rem" }}>
          Studio Templates ({templates.length})
        </h2>
        <button className={styles.createBtn} onClick={openNew}>+ Add Template</button>
      </div>

      {message && <p style={{ color: "#2ecc71", marginBottom: 16, fontWeight: 600 }}>{message}</p>}

      {showForm && (
        <div style={{ background: "#ffffe3", border: "1px solid rgba(74,74,74,0.1)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, color: "#4a4a4a" }}>
            {editItem ? "Edit Template" : "New Template"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label className={styles.inputLabel}>Title *</label>
              <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className={styles.inputLabel}>Category *</label>
              <select className={styles.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label className={styles.inputLabel}>Description *</label>
              <textarea className={styles.textarea} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label className={styles.inputLabel}>Preview Image URL *</label>
              <input className={styles.input} value={form.previewImage} onChange={e => setForm(f => ({ ...f, previewImage: e.target.value }))} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label className={styles.inputLabel}>Download URL (ZIP file or link)</label>
              <input className={styles.input} value={form.downloadUrl} onChange={e => setForm(f => ({ ...f, downloadUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label className={styles.inputLabel}>Tags (comma separated)</label>
              <input className={styles.input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="react, tailwind, dark mode" />
            </div>
            <div>
              <label className={styles.inputLabel}>Price (USD)</label>
              <input className={styles.input} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} disabled={form.isFree} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked, price: e.target.checked ? "0" : f.price }))} />
                <span style={{ fontSize: "0.9rem", color: "#4a4a4a" }}>Free Template</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginLeft: 16 }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span style={{ fontSize: "0.9rem", color: "#4a4a4a" }}>Featured</span>
              </label>
            </div>
          </div>
          {message && <p style={{ color: "#e74c3c", marginTop: 12, fontSize: "0.9rem" }}>{message}</p>}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button className={styles.saveBtn} onClick={submit} disabled={saving}>
              {saving ? "Saving..." : editItem ? "Update" : "Create Template"}
            </button>
            <button className={styles.cancelBtn} onClick={() => { setShowForm(false); setMessage("") }}>Cancel</button>
          </div>
        </div>
      )}

      {templates.length === 0 ? (
        <p style={{ color: "#6d8196", textAlign: "center", padding: "40px 0" }}>No templates yet. Add your first one!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {templates.map(t => (
            <div key={t.id} style={{
              background: "#fff", borderRadius: 10, padding: "16px 20px",
              border: "1px solid rgba(74,74,74,0.08)", display: "flex", alignItems: "center", gap: 16
            }}>
              <div style={{ width: 80, height: 56, borderRadius: 6, overflow: "hidden", position: "relative", flexShrink: 0, background: "#f0f0e8" }}>
                {t.previewImage && <Image src={t.previewImage} alt={t.title} fill style={{ objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#4a4a4a", marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: "0.85rem", color: "#6d8196" }}>
                  {t.category} · {t.isFree ? "Free" : `$${t.price}`} · {t.downloadCount} downloads
                  {t.featured && " · ⭐ Featured"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className={styles.editBtn} onClick={() => openEdit(t)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => deleteTemplate(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
