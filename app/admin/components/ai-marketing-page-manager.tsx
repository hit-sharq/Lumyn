"use client"

import { AIContentGenerator } from "@/app/admin/components/ai-content-generator"
import { AICampaignBuilder } from "@/app/admin/components/ai-campaign-builder"
import { AIMarketingTabs } from "@/app/admin/components/ai-marketing-tabs"
import styles from "../growth.module.css"

export default function AIMarketingPageManager() {
  return (
    <main className={styles.growthPage}>
      <div className={styles.growthHeader}>
        <h1 className={styles.growthTitle}>AI Marketing Suite</h1>
        <p className={styles.growthSubtitle}>
          Generate, optimize, and manage marketing campaigns with AI.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className={styles.growthCard}>
            <h2 className={styles.growthCardTitle}>Content Generator</h2>
            <p className={styles.growthCardSubtitle}>
              Generate marketing copy for any platform and content type.
            </p>
            <div className="mt-6">
              <AIContentGenerator />
            </div>
          </div>
        </div>

        <div>
          <div className={styles.growthCard}>
            <h2 className={styles.growthCardTitle}>Campaign Builder</h2>
            <p className={styles.growthCardSubtitle}>
              Create multi-channel campaigns across all platforms.
            </p>
            <div className="mt-6">
              <AICampaignBuilder />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <AIMarketingTabs />
      </section>
    </main>
  )
}
