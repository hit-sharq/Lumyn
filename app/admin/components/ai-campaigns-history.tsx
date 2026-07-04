"use client"

import { useEffect, useState } from "react"
import styles from "../growth.module.css"

interface Campaign {
  id: string
  title: string
  description: string
  objective: string
  channels: string[]
  status: string
  createdAt: string
  contentData: any
}

export function AICampaignsHistory() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/ai-marketing/campaign")
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data.campaigns || [])
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const channelBadge = (channel: string) => (
    <span
      key={channel}
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "50px",
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "capitalize",
        background: "rgba(109, 129, 150, 0.2)",
        color: "rgba(255, 255, 227, 0.9)",
      }}
    >
      {channel}
    </span>
  )

  return (
    <div>
      {loading ? (
        <p className={styles.growthEmpty}>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className={styles.growthEmpty}>No saved campaigns yet. Build a campaign to see it here.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              style={{
                background: "rgba(255, 255, 227, 0.03)",
                border: "1px solid rgba(255, 255, 227, 0.15)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  cursor: "pointer",
                }}
                onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0, color: "#ffffe3", fontSize: "1rem", fontWeight: 600 }}>{campaign.title}</h3>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "50px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        background:
                          campaign.status === "draft"
                            ? "rgba(255, 255, 227, 0.05)"
                            : campaign.status === "active"
                              ? "rgba(74, 222, 128, 0.1)"
                              : "rgba(255, 107, 107, 0.1)",
                        color:
                          campaign.status === "draft"
                            ? "rgba(255, 255, 227, 0.7)"
                            : campaign.status === "active"
                              ? "#4ade80"
                              : "#ff6b6b",
                      }}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 10px 0", color: "rgba(255, 255, 227, 0.6)", fontSize: "0.85rem", lineHeight: "1.5" }}>{campaign.description}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {campaign.channels.map(channelBadge)}
                  </div>
                  <p style={{ margin: 0, color: "rgba(255, 255, 227, 0.4)", fontSize: "0.8rem" }}>{formatDate(campaign.createdAt)}</p>
                </div>
                <span
                  style={{
                    color: "rgba(255, 255, 227, 0.4)",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {expandedId === campaign.id ? "▲" : "▼"}
                </span>
              </div>

              {expandedId === campaign.id && campaign.contentData && (
                <div
                  style={{
                    borderTop: "1px solid rgba(255, 255, 227, 0.08)",
                    padding: "20px",
                    background: "rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <p className={styles.growthLabel}>Campaign Data</p>
                  <pre
                    style={{
                      color: "rgba(255, 255, 227, 0.8)",
                      background: "rgba(255, 255, 227, 0.03)",
                      border: "1px solid rgba(255, 255, 227, 0.15)",
                      borderRadius: "8px",
                      padding: "16px",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.85rem",
                      lineHeight: "1.6",
                      marginTop: "8px",
                    }}
                  >
                    {typeof campaign.contentData === "string"
                      ? campaign.contentData
                      : JSON.stringify(campaign.contentData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
