"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./manager.module.css"
import RichTextEditor from "./RichTextEditor"

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

  if (loading) return <div className={styles.loading}>Loading templates...</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Studio Templates ({templates.length})</h1>
        {!showForm && <button className={styles.addBtn} onClick={openNew}>+ Add Template</button>}
      </div>

      {message && <p style={{ color: "#2ecc71", marginBottom: 16, fontWeight: 600 }}>{message}</p>}

      {showForm && (
        <div className={styles.form} style={{ maxWidth: "800px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, color: "#ffffe3" }}>
            {editItem ? "Edit Template" : "New Template"}
          </h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title *</label>
              <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select className={styles.select} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <RichTextEditor
              value={form.description}
              onChange={(value) => setForm(f => ({ ...f, description: value }))}
              placeholder="Describe your template..."
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Preview Image URL *</label>
            <input className={styles.input} value={form.previewImage} onChange={e => setForm(f => ({ ...f, previewImage: e.target.value }))} placeholder="https://..." />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Download URL (ZIP file or link)</label>
            <input className={styles.input} value={form.downloadUrl} onChange={e => setForm(f => ({ ...f, downloadUrl: e.target.value }))} placeholder="https://..." />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tags (comma separated)</label>
              <input className={styles.input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="react, tailwind, dark mode" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Price (USD)</label>
              <input className={styles.input} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} disabled={form.isFree} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 8 }}>
            <label className={styles.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 0 }}>
              <input type="checkbox" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked, price: e.target.checked ? "0" : f.price }))} />
              Free Template
            </label>
            <label className={styles.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 0 }}>
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              Featured
            </label>
          </div>
          {message && <p style={{ color: "#e74c3c", marginTop: 12, fontSize: "0.9rem" }}>{message}</p>}
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={submit} disabled={saving}>
              {saving ? "Saving..." : editItem ? "Update" : "Create Template"}
            </button>
            <button className={styles.cancelBtn} onClick={() => { setShowForm(false); setMessage("") }}>Cancel</button>
          </div>
        </div>
      )}

      {templates.length === 0 ? (
        <p className={styles.empty}>No templates yet. Add your first one!</p>
      ) : (
        <div className={styles.list}>
          {templates.map(t => (
            <div key={t.id} className={styles.card}>
              <div style={{ width: 80, height: 56, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,227,0.05)" }}>
                {t.previewImage && <Image src={t.previewImage} alt={t.title} fill style={{ objectFit: "cover" }} />}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{t.title}</h3>
                <p className={styles.cardExcerpt}>
                  {t.category} · {t.isFree ? "Free" : `$${t.price}`} · {t.downloadCount} downloads
                  {t.featured && " · ⭐ Featured"}
                </p>
              </div>
              <div className={styles.cardActions}>
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
