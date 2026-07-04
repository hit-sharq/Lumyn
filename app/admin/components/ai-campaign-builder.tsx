"use client"

import { useState } from "react"
import styles from "../growth.module.css"

export function AICampaignBuilder() {
  const [campaignName, setCampaignName] = useState<string>("")
  const [objective, setObjective] = useState<string>("awareness")
  const [targetAudience, setTargetAudience] = useState<string>("")
  const [channels, setChannels] = useState<string[]>(["twitter", "linkedin"])
  const [loading, setLoading] = useState(false)
  const [campaignData, setCampaignData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const handleChannelToggle = (channel: string) => {
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  const handleBuildCampaign = async () => {
    if (!campaignName.trim() || !targetAudience.trim()) {
      setError("Please enter campaign name and target audience")
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/ai-marketing/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: campaignName,
          objective,
          targetAudience,
          channels,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to build campaign")
      }

      const data = await response.json()
      setCampaignData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const channelOptions = [
    { id: "twitter", label: "Twitter/X" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "email", label: "Email" },
    { id: "sms", label: "SMS" },
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className={styles.growthLabel}>Campaign Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g. Q4 Product Launch"
            className={styles.growthInput}
          />
        </div>

        <div>
          <label className={styles.growthLabel}>Objective</label>
          <select
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className={styles.growthInput}
          >
            <option value="awareness">Brand Awareness</option>
            <option value="engagement">Engagement</option>
            <option value="conversion">Conversion</option>
            <option value="retention">Customer Retention</option>
            <option value="education">Education</option>
          </select>
        </div>

        <div>
          <label className={styles.growthLabel}>Target Audience</label>
          <textarea
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Describe your target audience (e.g. SaaS founders, age 25-45, interested in productivity)"
            rows={3}
            className={styles.growthInput}
          />
        </div>

        <div>
          <label className={styles.growthLabel}>Channels</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "8px",
            }}
          >
            {channelOptions.map((channel) => (
              <label
                key={channel.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: `1px solid ${
                    channels.includes(channel.id)
                      ? "rgba(255, 255, 227, 0.3)"
                      : "rgba(255, 255, 227, 0.08)"
                  }`,
                  background: channels.includes(channel.id)
                    ? "rgba(109, 129, 150, 0.1)"
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type="checkbox"
                  checked={channels.includes(channel.id)}
                  onChange={() => handleChannelToggle(channel.id)}
                  style={{ cursor: "pointer", accentColor: "#6d8196" }}
                />
                <span
                  style={{
                    color: "rgba(255, 255, 227, 0.8)",
                    fontSize: "0.95rem",
                  }}
                >
                  {channel.label}
                </span>
              </label>
            ))}
          </div>
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
          onClick={handleBuildCampaign}
          disabled={loading}
          className={styles.growthButton}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Building Campaign..." : "Build Campaign"}
        </button>
      </div>

      {campaignData && (
        <div>
          <hr className={styles.growthDivider} />
          <div style={{ marginTop: "1.5rem" }}>
            <p className={styles.growthLabel}>Campaign Blueprint</p>

            <div style={{ marginTop: "1rem" }}>
              {(campaignData.result || campaignData.contentData) &&
                Object.entries(
                  campaignData.result ||
                    campaignData.contentData ||
                    {}
                ).map(([key, value]: [string, any]) => (
                  <div key={key} style={{ marginBottom: "1.5rem" }}>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "rgba(255, 255, 227, 0.7)",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {key.replace(/_/g, " ")}
                    </p>
                    <div
                      style={{
                        background: "rgba(255, 255, 227, 0.03)",
                        border: "1px solid rgba(255, 255, 227, 0.15)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "rgba(255, 255, 227, 0.8)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {typeof value === "string"
                        ? value
                        : JSON.stringify(value, null, 2)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
