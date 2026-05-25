"use client"

import { useEffect, useState } from "react"
import styles from "./manager.module.css"

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

  if (loading) return <div className={styles.loading}>Loading products...</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Market Products ({products.length})</h1>
        <a href="/market" target="_blank" rel="noreferrer" className={styles.addBtn} style={{ textDecoration: "none" }}>
          View Market →
        </a>
      </div>

      {message && <p style={{ color: "#2ecc71", marginBottom: 16, fontWeight: 600 }}>{message}</p>}

      {products.length === 0 ? (
        <p className={styles.empty}>No products yet. Creators can list products via the Market dashboard.</p>
      ) : (
        <div className={styles.list}>
          {products.map((p: any) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardExcerpt}>
                  by {p.creator?.displayName} · {p.category} · ${p.price.toFixed(2)} · {p.salesCount} sales
                  · {p.isPublished ? "✓ Published" : "○ Draft"}
                </p>
              </div>
              <div className={styles.cardActions}>
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
