"use client"

import { useState } from "react"
import styles from "../growth.module.css"

interface ContentGeneratorProps {
  onGenerate?: (content: string) => void
}

export function AIContentGenerator({ onGenerate }: ContentGeneratorProps) {
  const [contentType, setContentType] = useState<string>("social_post")
  const [platform, setPlatform] = useState<string>("twitter")
  const [topic, setTopic] = useState<string>("")
  const [product, setProduct] = useState<string>("")
  const [audience, setAudience] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [tone, setTone] = useState<string>("professional")
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [error, setError] = useState<string>("")

  const [posting, setPosting] = useState(false)
  const [postMessage, setPostMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handlePost = async (platform: "twitter" | "linkedin") => {
    setPosting(true)
    setPostMessage(null)
    try {
      const res = await fetch("/api/ai-marketing/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: generatedContent, platform }),
      })
      const data = await res.json()
      if (data.success) {
        setPostMessage({ type: "success", text: data.skipped ? `Posted to ${platform} (skipped - no API keys)` : `Posted to ${platform} successfully` })
      } else {
        setPostMessage({ type: "error", text: data.error || `Failed to post to ${platform}` })
      }
    } catch (e) {
      setPostMessage({ type: "error", text: `Failed to post to ${platform}` })
    } finally {
      setPosting(false)
    }
  }
  const handleGenerate = async () => {
    const baseFields: Record<string, any> = { contentType, platform, tone }

    if (["email_short", "email_long"].includes(contentType)) {
      if (!subject.trim() || !product.trim()) {
        setError("Please enter subject and product")
        return
      }
    } else if (["ad_copy", "landing_page"].includes(contentType)) {
      if (!product.trim() || !audience.trim()) {
        setError("Please enter product and target audience")
        return
      }
    } else if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    try {
      setLoading(true)
      setError("")

      const payload = {
        ...baseFields,
        topic: topic || product,
        subject,
        product,
        audience,
      }

      const response = await fetch("/api/ai-marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      onGenerate?.(data.content)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const needsSubject = ["email_short", "email_long"].includes(contentType)
  const needsAudience = ["ad_copy", "landing_page"].includes(contentType)

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className={styles.growthLabel}>Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className={styles.growthInput}
          >
            <option value="social_post">Social Post</option>
            <option value="email_short">Email (Short)</option>
            <option value="email_long">Email (Long)</option>
            <option value="ad_copy">Ad Copy</option>
            <option value="landing_page">Landing Page Copy</option>
            <option value="blog_post">Blog Post</option>
            <option value="campaign_outline">Campaign Outline</option>
            <option value="ab_test">A/B Test Variations</option>
            <option value="hashtags">Hashtags</option>
          </select>
        </div>

        <div>
          <label className={styles.growthLabel}>Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={styles.growthInput}
          >
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="email">Email</option>
            <option value="general">General</option>
          </select>
        </div>

        <div>
          <label className={styles.growthLabel}>Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className={styles.growthInput}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
            <option value="urgent">Urgent</option>
            <option value="friendly">Friendly</option>
            <option value="educational">Educational</option>
          </select>
        </div>

        {needsSubject && (
          <div>
            <label className={styles.growthLabel}>Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Unlock your productivity"
              className={styles.growthInput}
            />
          </div>
        )}

        <div>
          <label className={styles.growthLabel}>
            {needsSubject ? "Product / Offer" : needsAudience ? "Product / Offer" : "Topic / Product"}
          </label>
          <textarea
            value={needsAudience ? product : topic}
            onChange={(e) => (needsAudience ? setProduct(e.target.value) : setTopic(e.target.value))}
            placeholder={
              needsSubject
                ? "Describe your product or offer"
                : needsAudience
                  ? "Describe your product or service"
                  : "Enter your topic, product, or content idea"
            }
            rows={3}
            className={styles.growthInput}
          />
        </div>

        {needsAudience && (
          <div>
            <label className={styles.growthLabel}>Target Audience</label>
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Describe your target audience (e.g. SaaS founders, 25-45, interested in productivity)"
              rows={3}
              className={styles.growthInput}
            />
          </div>
        )}

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
          onClick={handleGenerate}
          disabled={loading}
          className={styles.growthButton}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </div>

      {generatedContent && (
        <div>
          <hr className={styles.growthDivider} />
          <div style={{ marginTop: "1.5rem" }}>
            <p className={styles.growthLabel}>Generated Content</p>
            <div
              style={{
                background: "rgba(255, 255, 227, 0.03)",
                border: "1px solid rgba(255, 255, 227, 0.15)",
                borderRadius: "8px",
                padding: "16px",
                color: "rgba(255, 255, 227, 0.8)",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                marginTop: "8px",
                whiteSpace: "pre-wrap",
              }}
            >
              {generatedContent}
            </div>
             <button
               onClick={() => {
                 navigator.clipboard.writeText(generatedContent)
               }}
               className={styles.growthButtonSecondary}
               style={{ marginTop: "12px" }}
             >
               Copy to Clipboard
             </button>
             {(platform === "twitter" || platform === "linkedin") && (
               <button
                 onClick={() => handlePost(platform as "twitter" | "linkedin")}
                 disabled={posting}
                 className={styles.growthButton}
                 style={{ marginTop: "12px", width: "auto" }}
               >
                 {posting ? "Posting..." : `Post to ${platform === "twitter" ? "Twitter/X" : "LinkedIn"}`}
               </button>
             )}
             {postMessage && (
               <p style={{ marginTop: "8px", fontSize: "0.875rem", color: postMessage.type === "success" ? "#4ade80" : "#ff6b6b" }}>
                 {postMessage.text}
               </p>
             )}
          </div>
        </div>
      )}
    </div>
  )
}
