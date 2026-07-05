"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { markdownToHtml } from "@/lib/markdown"
import styles from "../about/about.module.css"

interface Leader {
  id: string
  name: string
  position: string
  role: string
  imageUrl?: string | null
}

export default function TeamCard({
  leader,
  showFullPageButton = true,
}: {
  leader: Leader
  showFullPageButton?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const shortText = leader.role?.slice(0, 150) || ""
  const hasOverflow = leader.role?.length > 150
  const displayText = expanded || !hasOverflow ? leader.role : `${shortText.trimEnd()}...`

  return (
    <div className={styles.teamCard}>
      <div className={styles.teamImageWrapper}>
        {leader.imageUrl ? (
          <Image
            src={leader.imageUrl}
            alt={leader.name}
            fill
            className={styles.teamImage}
          />
        ) : (
          <div className={styles.teamImagePlaceholder}>
            <span>👤</span>
          </div>
        )}
        <div className={styles.teamOverlay}></div>
      </div>

      <div className={styles.teamContent}>
        <h3 className={styles.teamName}>{leader.name}</h3>
        <p className={styles.teamPosition}>{leader.position}</p>
        <div
          className={styles.teamBio}
          dangerouslySetInnerHTML={{ __html: markdownToHtml(displayText) }}
        />
        {hasOverflow && (
          <button
            type="button"
            className={styles.readMoreButton}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
        {showFullPageButton && (
          <div style={{ marginTop: 18 }}>
            <Link href="/team" className={styles.ctaButton}>
              View full team page
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
