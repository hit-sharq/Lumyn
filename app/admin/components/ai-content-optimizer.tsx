"use client"

import { useState } from "react"
import styles from "../growth.module.css"

type ActionType = "optimize" | "platform" | "variations" | "analyze"

const actionToApi: Record<ActionType, string> = {
  optimize: "optimize",
  platform: "optimize_platform",
  variations: "generate_variations",
  analyze: "analyze_performance",
}

const platformOptions = [
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
]

export function AIContentOptimizer() {
  const [action, setAction] = useState<ActionType>("optimize")
  const [content, setContent] = useState("")
  const [contentType, setContentType] = useState("social")
  const [platform, setPlatform] = useState("twitter")
  const [variationsCount, setVariationsCount] = useState(3)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleOptimize = async () => {
    if (!content.trim()) {
      setError("Please enter content to optimize")
      return
    }

    try {
      setLoading(true)
      setError("")
      setResult(null)

      const body: Record<string, any> = { action: actionToApi[action], content }

      if (action === "optimize") body.contentType = contentType
      if (action === "platform") body.platform = platform
      if (action === "variations") body.numberOfVariations = variationsCount

      const res = await fetch("/api/ai-marketing/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Optimization failed")
      }

      const data = await res.json()
      setResult(data.result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null

    if (action === "optimize" || action === "platform") {
      return (
        <div style={{ marginTop: "1.5rem" }}>
          <p className={styles.growthLabel}>Optimized Content</p>
          <div
            style={{
              background: "rgba(255, 255, 227, 0.03)",
              border: "1px solid rgba(255, 255, 227, 0.15)",
              borderRadius: "8px",
              padding: "16px",
              color: "rgba(255, 255, 227, 0.8)",
              fontSize: "0.95rem",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {result.optimized}
          </div>

          {result.nativeChanges && (
            <div style={{ marginTop: "16px" }}>
              <p className={styles.growthLabel}>Changes Made</p>
              <ul style={{ color: "rgba(255, 255, 227, 0.8)", paddingLeft: "20px", lineHeight: "1.8" }}>
                {result.nativeChanges.map((change: string, idx: number) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>
          )}

          {result.improvements && (
            <div style={{ marginTop: "16px" }}>
              <p className={styles.growthLabel}>Improvements</p>
              <ul style={{ color: "rgba(255, 255, 227, 0.8)", paddingLeft: "20px", lineHeight: "1.8" }}>
                {result.improvements.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.score && (
            <div
              style={{
                marginTop: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 227, 0.03)",
                  border: "1px solid rgba(255, 255, 227, 0.15)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 6px 0", color: "rgba(255, 255, 227, 0.5)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Readability
                </p>
                <p style={{ margin: 0, color: "#ffffe3", fontSize: "1.1rem", fontWeight: 700 }}>{result.score.readability}</p>
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 227, 0.03)",
                  border: "1px solid rgba(255, 255, 227, 0.15)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 6px 0", color: "rgba(255, 255, 227, 0.5)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Engagement
                </p>
                <p style={{ margin: 0, color: "#ffffe3", fontSize: "1.1rem", fontWeight: 700 }}>{result.score.engagement}</p>
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 227, 0.03)",
                  border: "1px solid rgba(255, 255, 227, 0.15)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 6px 0", color: "rgba(255, 255, 227, 0.5)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Clarity
                </p>
                <p style={{ margin: 0, color: "#ffffe3", fontSize: "1.1rem", fontWeight: 700 }}>{result.score.clarity}</p>
              </div>
            </div>
          )}
        </div>
      )
    }

    if (action === "variations") {
      return (
        <div style={{ marginTop: "1.5rem" }}>
          <p className={styles.growthLabel}>Variations</p>
          <div style={{ display: "grid", gap: "12px" }}>
            {result.map((variation: string, idx: number) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255, 255, 227, 0.03)",
                  border: "1px solid rgba(255, 255, 227, 0.15)",
                  borderRadius: "8px",
                  padding: "14px",
                  color: "rgba(255, 255, 227, 0.8)",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }}
              >
                {variation}
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (action === "analyze") {
      return (
        <div style={{ marginTop: "1.5rem" }}>
          <p className={styles.growthLabel}>Analysis</p>

          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <p style={{ color: "rgba(255, 255, 227, 0.5)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Strengths</p>
              <ul style={{ color: "rgba(255, 255, 227, 0.8)", paddingLeft: "20px", lineHeight: "1.8" }}>
                {result.strengths?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
            <div>
              <p style={{ color: "rgba(255, 255, 227, 0.5)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Weaknesses</p>
              <ul style={{ color: "rgba(255, 255, 227, 0.8)", paddingLeft: "20px", lineHeight: "1.8" }}>
                {result.weaknesses?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
            <div>
              <p style={{ color: "rgba(255, 255, 227, 0.5)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Suggestions</p>
              <ul style={{ color: "rgba(255, 255, 227, 0.8)", paddingLeft: "20px", lineHeight: "1.8" }}>
                {result.improvementSuggestions?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div style={{ marginTop: "1.5rem" }}>
        <pre style={{ color: "rgba(255, 255, 227, 0.8)", background: "rgba(255, 255, 227, 0.03)", border: "1px solid rgba(255, 255, 227, 0.15)", borderRadius: "8px", padding: "16px", whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className={styles.growthLabel}>Optimization Type</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as ActionType)}
            className={styles.growthInput}
          >
            <option value="optimize">General Optimization</option>
            <option value="platform">Platform Optimization</option>
            <option value="variations">Generate Variations</option>
            <option value="analyze">Performance Analysis</option>
          </select>
        </div>

        {(action === "optimize") && (
          <div>
            <label className={styles.growthLabel}>Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className={styles.growthInput}
            >
              <option value="email">Email</option>
              <option value="social">Social</option>
              <option value="ad">Ad</option>
              <option value="headline">Headline</option>
            </select>
          </div>
        )}

        {action === "platform" && (
          <div>
            <label className={styles.growthLabel}>Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className={styles.growthInput}
            >
              {platformOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {action === "variations" && (
          <div>
            <label className={styles.growthLabel}>Variations</label>
            <input
              type="number"
              min={2}
              max={10}
              value={variationsCount}
              onChange={(e) => setVariationsCount(Number(e.target.value))}
              className={styles.growthInput}
            />
          </div>
        )}

        <div>
          <label className={styles.growthLabel}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the content you want to optimize..."
            rows={6}
            className={styles.growthInput}
            style={{ minHeight: "140px" }}
          />
        </div>

        {error && (
          <div
            style={{
              color: "#ff6b6b",
              fontSize: "0.875rem",
              background: "rgba(255, 107, 107, 0.05)",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 107, 107, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleOptimize}
          disabled={loading}
          className={styles.growthButton}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Optimizing..." : "Optimize Content"}
        </button>
      </div>

      {result && renderResult()}
    </div>
  )
}
