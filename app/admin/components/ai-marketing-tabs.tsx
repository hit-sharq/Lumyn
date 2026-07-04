"use client"

import { useState } from "react"
import styles from "../growth.module.css"
import { AITemplatesManager } from "./ai-templates-manager"
import { AIContentOptimizer } from "./ai-content-optimizer"
import { AICampaignsHistory } from "./ai-campaigns-history"

type Tab = "templates" | "optimizer" | "campaigns"

export function AIMarketingTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("templates")

  return (
    <>
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255, 255, 227, 0.08)", marginBottom: "0" }}>
        {[
          { id: "templates", label: "Templates" },
          { id: "optimizer", label: "Content Optimizer" },
          { id: "campaigns", label: "Saved Campaigns" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #6d8196" : "2px solid transparent",
              color: activeTab === tab.id ? "#ffffe3" : "rgba(255, 255, 227, 0.5)",
              padding: "12px 18px",
              fontSize: "0.95rem",
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.growthCard} style={{ marginTop: "0", borderRadius: "0 16px 16px 16px" }}>
        {activeTab === "templates" && <AITemplatesManager />}
        {activeTab === "optimizer" && <AIContentOptimizer />}
        {activeTab === "campaigns" && <AICampaignsHistory />}
      </div>
    </>
  )
}
