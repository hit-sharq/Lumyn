"use client"

import { motion } from "framer-motion"
import styles from "./LoadingState.module.css"

type LoadingVariant = "page" | "editorial" | "portfolio" | "compact"
type LoadingTone = "light" | "dark"

interface LoadingStateProps {
  variant?: LoadingVariant
  tone?: LoadingTone
  label?: string
  count?: number
}

const variantClass: Record<LoadingVariant, string> = {
  page: styles.page,
  editorial: styles.editorial,
  portfolio: styles.portfolio,
  compact: styles.compact,
}

export default function LoadingState({ variant = "page", tone = "light", label = "Loading", count = 3 }: LoadingStateProps) {
  const isPage = variant === "page"
  const cards = Array.from({ length: count }, (_, index) => index)

  return (
    <div className={`${styles.root} ${variantClass[variant]} ${tone === "dark" ? styles.dark : ""}`} aria-busy="true" role="status">
      <div className={styles.progressTrack} aria-hidden="true">
        <motion.span
          className={styles.progressSignal}
          animate={{ x: ["-110%", "310%"] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {isPage ? (
        <div className={styles.pageStage}>
          <div className={styles.signalMark} aria-hidden="true">
            <span className={styles.signalCore} />
            <span className={styles.signalRing} />
            <span className={styles.signalRingDelay} />
          </div>
          <div className={styles.pageCopy}>
            <p className={styles.label}>{label}</p>
            <p className={styles.detail}>Tuning the signal · bringing the next view into focus</p>
          </div>
        </div>
      ) : (
        <div className={styles.skeletonGrid}>
          {cards.map((card) => (
            <div className={styles.skeletonCard} key={card}>
              <div className={styles.skeletonMedia}>
                <span className={styles.skeletonShimmer} />
                <span className={styles.skeletonBadge} />
              </div>
              <div className={styles.skeletonBody}>
                <span className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
                <span className={styles.skeletonLine} />
                <span className={styles.skeletonLine} />
                <span className={`${styles.skeletonLine} ${styles.skeletonLineMeta}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
