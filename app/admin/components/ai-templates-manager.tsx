"use client"

import { useState, useEffect } from "react"
import styles from "../growth.module.css"

interface AITemplate {
  id: string
  title: string
  type: string
  platform: string | null
  tone: string | null
  isPublic: boolean
  createdAt: string
  content: string
}

export function AITemplatesManager() {
  const [templates, setTemplates] = useState<AITemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/ai-marketing/templates")
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Failed to fetch templates", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return
    try {
      await fetch(`/api/ai-marketing/templates?id=${id}`, { method: "DELETE" })
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Delete failed", error)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const filtered =
    filterType === "all"
      ? templates
      : templates.filter((t) => t.type === filterType)

  const searched = searchQuery
    ? filtered.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : filtered

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.growthInput}
          style={{ width: "auto", minWidth: "180px" }}
        >
          <option value="all">All Types</option>
          <option value="social_post">Social Post</option>
          <option value="email_short">Email (Short)</option>
          <option value="email_long">Email (Long)</option>
          <option value="ad_copy">Ad Copy</option>
          <option value="landing_page">Landing Page</option>
          <option value="blog_post">Blog Post</option>
          <option value="campaign_outline">Campaign Outline</option>
        </select>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.growthInput}
          style={{ flex: 1, minWidth: "200px" }}
        />
      </div>

      {loading ? (
        <p className={styles.growthEmpty}>Loading templates...</p>
      ) : searched.length === 0 ? (
        <p className={styles.growthEmpty}>No templates found. Generate content and save it as a template.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {searched.map((template) => (
            <div
              key={template.id}
              style={{
                background: "rgba(255, 255, 227, 0.03)",
                border: "1px solid rgba(255, 255, 227, 0.15)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 6px 0", color: "#ffffe3", fontSize: "1rem", fontWeight: 600 }}>
                    {template.title}
                  </h3>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span className={styles.growthBadge} style={{ background: "rgba(109, 129, 150, 0.2)", color: "rgba(255, 255, 227, 0.9)" }}>
                      {template.type.replace(/_/g, " ")}
                    </span>
                    {template.platform && (
                      <span className={styles.growthBadge} style={{ background: "rgba(255, 255, 227, 0.05)", color: "rgba(255, 255, 227, 0.7)" }}>
                        {template.platform}
                      </span>
                    )}
                    {template.isPublic && (
                      <span className={styles.growthBadge} style={{ background: "rgba(74, 222, 128, 0.1)", color: "#4ade80" }}>
                        Public
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleCopy(template.content)}
                    className={styles.growthButtonSecondary}
                    style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    style={{
                      background: "rgba(255, 107, 107, 0.1)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(255, 107, 107, 0.2)",
                      padding: "6px 12px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 227, 0.03)",
                  border: "1px solid rgba(255, 255, 227, 0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "rgba(255, 255, 227, 0.8)",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {template.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
