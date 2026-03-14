"use client"

import { useEffect, useState } from "react"
import styles from "../admin.module.css"

export default function MarketManager() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/market/products")
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (p: any) => {
    await fetch(`/api/market/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, price: p.price.toString(), isPublished: !p.isPublished }),
    })
    fetchProducts()
    setMessage(`Product ${!p.isPublished ? "published" : "unpublished"}.`)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/market/products/${id}`, { method: "DELETE" })
    fetchProducts()
    setMessage("Product deleted.")
  }

  if (loading) return <p style={{ color: "#6d8196" }}>Loading products...</p>

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, color: "#4a4a4a", fontSize: "1.2rem" }}>
          Market Products ({products.length})
        </h2>
        <a href="/market" target="_blank" rel="noreferrer" className={styles.createBtn} style={{ textDecoration: "none" }}>
          View Market →
        </a>
      </div>

      {message && <p style={{ color: "#2ecc71", marginBottom: 16, fontWeight: 600 }}>{message}</p>}

      {products.length === 0 ? (
        <p style={{ color: "#6d8196", textAlign: "center", padding: "40px 0" }}>
          No products yet. Creators can list products via the Market dashboard.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {products.map((p: any) => (
            <div key={p.id} style={{
              background: "#fff", borderRadius: 10, padding: "16px 20px",
              border: "1px solid rgba(74,74,74,0.08)", display: "flex", alignItems: "center", gap: 16
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#4a4a4a", marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: "0.85rem", color: "#6d8196" }}>
                  by {p.creator?.displayName} · {p.category} · ${p.price.toFixed(2)} · {p.salesCount} sales
                  · {p.isPublished ? "✓ Published" : "○ Draft"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className={styles.editBtn} onClick={() => togglePublish(p)}>
                  {p.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button className={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
