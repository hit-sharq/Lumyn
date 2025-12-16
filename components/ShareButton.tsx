"use client"

import { useState } from "react"
import styles from "./share-button.module.css"

interface ShareButtonProps {
  title: string
  url?: string
  text?: string
  className?: string
  variant?: "default" | "minimal" | "full"
  showLabels?: boolean
}

interface ShareOption {
  name: string
  icon: string
  action: () => void
  color: string
}

export default function ShareButton({ 
  title, 
  url, 
  text, 
  className = "", 
  variant = "default",
  showLabels = true 
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareText = text || title
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(`${shareText} - ${shareUrl}`)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const shareOptions: ShareOption[] = [
    {
      name: "Copy Link",
      icon: copySuccess ? "✅" : "🔗",
      action: copyToClipboard,
      color: "#6b7280"
    },
    {
      name: "WhatsApp",
      icon: "📱",
      action: () => window.open(`https://wa.me/?text=${encodedText}`, "_blank"),
      color: "#25D366"
    },
    {
      name: "Twitter",
      icon: "🐦",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank"),
      color: "#1DA1F2"
    },
    {
      name: "LinkedIn",
      icon: "💼",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank"),
      color: "#0077B5"
    },
    {
      name: "Facebook",
      icon: "📘",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank"),
      color: "#1877F2"
    },
    {
      name: "Email",
      icon: "📧",
      action: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}`, "_blank"),
      color: "#EA4335"
    }
  ]

  // Native Web Share API
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.log("Error sharing:", err)
        setIsOpen(!isOpen) // Fallback to custom share menu
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "minimal":
        return styles.minimal
      case "full":
        return styles.full
      default:
        return styles.default
    }
  }

  return (
    <div className={`${styles.shareContainer} ${getVariantStyles()} ${className}`}>
      {variant === "full" ? (
        // Full variant - show all options directly
        <div className={styles.fullShareOptions}>
          <h4 className={styles.shareTitle}>Share this {getContentType()}</h4>
          <div className={styles.shareGrid}>
            {shareOptions.map((option) => (
              <button
                key={option.name}
                className={styles.shareOption}
                onClick={option.action}
                style={{ "--option-color": option.color } as React.CSSProperties}
                title={option.name}
              >
                <span className={styles.optionIcon}>{option.icon}</span>
                {showLabels && <span className={styles.optionLabel}>{option.name}</span>}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Default and minimal variants - dropdown menu
        <>
          <button
            className={styles.shareButton}
            onClick={nativeShare}
            title="Share"
          >
            <span className={styles.shareIcon}>🔗</span>
            {variant === "default" && showLabels && <span>Share</span>}
          </button>

          {isOpen && (
            <>
              <div className={styles.overlay} onClick={() => setIsOpen(false)} />
              <div className={styles.dropdown}>
                <h4 className={styles.dropdownTitle}>Share this {getContentType()}</h4>
                <div className={styles.dropdownOptions}>
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      className={styles.dropdownOption}
                      onClick={() => {
                        option.action()
                        setIsOpen(false)
                      }}
                      style={{ "--option-color": option.color } as React.CSSProperties}
                    >
                      <span className={styles.optionIcon}>{option.icon}</span>
                      {showLabels && <span className={styles.optionLabel}>{option.name}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )

  function getContentType(): string {
    if (title.toLowerCase().includes("event")) return "event"
    if (title.toLowerCase().includes("news") || title.toLowerCase().includes("article")) return "article"
    if (title.toLowerCase().includes("blog") || title.toLowerCase().includes("post")) return "post"
    return "content"
  }
}
