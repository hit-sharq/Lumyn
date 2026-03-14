"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser, SignInButton } from "@clerk/nextjs"
import styles from "../market.module.css"

const CATEGORIES = ["Templates", "UI Kits", "Icons", "Fonts", "eBooks", "Courses", "Tools", "Other"]

interface Creator {
  id: string
  displayName: string
  bio: string | null
  website: string | null
  twitter: string | null
  products: {
    id: string
    title: string
    category: string
    price: number
    previewImage: string | null
    isPublished: boolean
    salesCount: number
    _count: { purchases: number }
  }[]
}

interface Purchase {
  id: string
  createdAt: string
  amount: number
  product: {
    id: string
    title: string
    category: string
    previewImage: string | null
    fileUrl: string | null
    creator: { displayName: string }
  }
}

type Tab = "products" | "purchases" | "profile"

const emptyProduct = { title: "", description: "", category: "Templates", price: "", fileUrl: "", previewImage: "", tags: "" }

export default function MarketDashboardPage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [tab, setTab] = useState<Tab>("products")
  const [creator, setCreator] = useState<Creator | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [profileForm, setProfileForm] = useState({ displayName: "", bio: "", website: "", twitter: "" })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (isSignedIn) {
      fetchCreator()
      fetchPurchases()
    } else {
      setLoading(false)
    }
  }, [isSignedIn])

  useEffect(() => {
    if (creator) {
      setProfileForm({
        displayName: creator.displayName,
        bio: creator.bio || "",
        website: creator.website || "",
        twitter: creator.twitter || "",
      })
    }
  }, [creator])

  const fetchCreator = async () => {
    try {
      const res = await fetch("/api/market/creator")
      const data = await res.json()
      setCreator(data)
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchases = async () => {
    try {
      const res = await fetch("/api/market/purchases")
      const data = await res.json()
      setPurchases(Array.isArray(data) ? data : [])
    } catch {}
  }

  const openNew = () => {
    setEditProduct(null)
    setForm(emptyProduct)
    setShowModal(true)
    setMessage("")
  }

  const openEdit = (p: any) => {
    setEditProduct(p)
    setForm({ title: p.title, description: p.description, category: p.category, price: p.price.toString(), fileUrl: p.fileUrl || "", previewImage: p.previewImage || "", tags: p.tags.join(", ") })
    setShowModal(true)
    setMessage("")
  }

  const submitProduct = async () => {
    if (!form.title || !form.description || !form.price) return
    setSaving(true)
    setMessage("")
    try {
      const payload = { ...form, price: parseFloat(form.price), tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) }
      let res
      if (editProduct) {
        res = await fetch(`/api/market/products/${editProduct.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      } else {
        res = await fetch("/api/market/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      }
      if (res.ok) {
        setShowModal(false)
        fetchCreator()
        setMessage(editProduct ? "Product updated!" : "Product listed!")
      } else {
        const err = await res.json()
        setMessage(err.error || "Failed to save product.")
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/market/products/${id}`, { method: "DELETE" })
    fetchCreator()
  }

  const saveProfile = async () => {
    setSavingProfile(true)
    try {
      const res = await fetch("/api/market/creator", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileForm) })
      if (res.ok) {
        setMessage("Profile updated!")
        fetchCreator()
      }
    } finally {
      setSavingProfile(false)
    }
  }

  const totalRevenue = creator?.products.reduce((sum, p) => sum + p.price * p._count.purchases, 0) || 0
  const totalSales = creator?.products.reduce((sum, p) => sum + p._count.purchases, 0) || 0

  if (!isLoaded || loading) {
    return (
      <div className={styles.loading} style={{ paddingTop: 120 }}>
        <div className={styles.spinner} />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className={styles.noAccess}>
        <h2 className={styles.noAccessTitle}>Sign in to access the creator dashboard</h2>
        <p className={styles.noAccessText}>List and sell your digital products on Lumyn Market.</p>
        <SignInButton mode="modal">
          <button style={{ padding: "12px 32px", background: "#7b3f00", color: "#ffffe3", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}>
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
          <h1 className={styles.dashTitle}>Creator Dashboard</h1>
          <p className={styles.dashSubtitle}>Manage your products and track your earnings</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.dashContent}>
          <div className={styles.dashStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{creator?.products.length || 0}</div>
              <div className={styles.statLabel}>Products</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalSales}</div>
              <div className={styles.statLabel}>Total Sales</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>${totalRevenue.toFixed(0)}</div>
              <div className={styles.statLabel}>Revenue</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{purchases.length}</div>
              <div className={styles.statLabel}>Purchases</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            {(["products", "purchases", "profile"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 20px", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer",
                  background: tab === t ? "#7b3f00" : "rgba(74,74,74,0.08)",
                  color: tab === t ? "#ffffe3" : "#4a4a4a"
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {message && <p style={{ color: "#2ecc71", fontWeight: 600, marginBottom: 16 }}>{message}</p>}

          {tab === "products" && (
            <>
              <div className={styles.dashActions}>
                <button className={styles.dashActionBtn} onClick={openNew}>+ List New Product</button>
              </div>
              {(!creator?.products || creator.products.length === 0) ? (
                <div className={styles.emptyState}>
                  <h3>No products yet</h3>
                  <p>List your first digital product and start earning.</p>
                </div>
              ) : (
                <div className={styles.productsList}>
                  {creator.products.map(p => (
                    <div key={p.id} className={styles.productRow}>
                      <div className={styles.productRowImage}>
                        {p.previewImage && <Image src={p.previewImage} alt={p.title} fill style={{ objectFit: "cover" }} />}
                      </div>
                      <div className={styles.productRowInfo}>
                        <div className={styles.productRowTitle}>{p.title}</div>
                        <div className={styles.productRowMeta}>
                          {p.category} · ${p.price.toFixed(2)} · {p._count.purchases} sales · {p.isPublished ? "Live" : "Draft"}
                        </div>
                      </div>
                      <div className={styles.productRowActions}>
                        <button className={`${styles.rowBtn} ${styles.rowBtnEdit}`} onClick={() => openEdit(p)}>Edit</button>
                        <button className={`${styles.rowBtn} ${styles.rowBtnDelete}`} onClick={() => deleteProduct(p.id)}>Delete</button>
                        <Link href={`/market/${p.id}`} className={`${styles.rowBtn} ${styles.rowBtnEdit}`} style={{ textDecoration: "none", display: "inline-block" }}>View</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "purchases" && (
            <div>
              {purchases.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>No purchases yet</h3>
                  <p>Products you buy will appear here.</p>
                </div>
              ) : (
                <div className={styles.productsList}>
                  {purchases.map(p => (
                    <div key={p.id} className={styles.productRow}>
                      <div className={styles.productRowImage}>
                        {p.product.previewImage && <Image src={p.product.previewImage} alt={p.product.title} fill style={{ objectFit: "cover" }} />}
                      </div>
                      <div className={styles.productRowInfo}>
                        <div className={styles.productRowTitle}>{p.product.title}</div>
                        <div className={styles.productRowMeta}>
                          by {p.product.creator.displayName} · ${p.amount.toFixed(2)} · {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={styles.productRowActions}>
                        {p.product.fileUrl ? (
                          <a href={p.product.fileUrl} target="_blank" rel="noreferrer" className={`${styles.rowBtn} ${styles.rowBtnEdit}`} style={{ textDecoration: "none" }}>↓ Download</a>
                        ) : (
                          <span className={`${styles.rowBtn} ${styles.rowBtnEdit}`} style={{ opacity: 0.5 }}>Coming Soon</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div style={{ maxWidth: 560 }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Display Name</label>
                <input className={styles.formInput} value={profileForm.displayName} onChange={e => setProfileForm(f => ({ ...f, displayName: e.target.value }))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bio</label>
                <textarea className={styles.formTextarea} value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell buyers about yourself..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website URL</label>
                <input className={styles.formInput} value={profileForm.website} onChange={e => setProfileForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Twitter URL</label>
                <input className={styles.formInput} value={profileForm.twitter} onChange={e => setProfileForm(f => ({ ...f, twitter: e.target.value }))} placeholder="https://twitter.com/..." />
              </div>
              <button className={styles.dashActionBtn} onClick={saveProfile} disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editProduct ? "Edit Product" : "List New Product"}</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Title *</label>
              <input className={styles.formInput} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description *</label>
              <textarea className={styles.formTextarea} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category *</label>
              <select className={styles.formInput} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Price (USD) *</label>
              <input className={styles.formInput} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="9.99" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Preview Image URL</label>
              <input className={styles.formInput} value={form.previewImage} onChange={e => setForm(f => ({ ...f, previewImage: e.target.value }))} placeholder="https://..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>File / Download URL</label>
              <input className={styles.formInput} value={form.fileUrl} onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tags (comma separated)</label>
              <input className={styles.formInput} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="design, template, ui" />
            </div>
            {message && <p style={{ color: "#e74c3c", fontSize: "0.85rem", marginBottom: 12 }}>{message}</p>}
            <div className={styles.modalActions}>
              <button className={`${styles.modalBtn} ${styles.modalBtnPrimary}`} onClick={submitProduct} disabled={saving}>
                {saving ? "Saving..." : editProduct ? "Update" : "List Product"}
              </button>
              <button className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
