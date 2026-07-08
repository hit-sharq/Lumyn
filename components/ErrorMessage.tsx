"use client"

interface ErrorMessageProps {
  message: string | null
  onClose?: () => void
}

export default function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  if (!message) return null
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        padding: "14px 16px",
        borderRadius: 12,
        margin: "16px 0",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <span style={{ fontWeight: 700, flexShrink: 0 }} aria-hidden>
        ⚠️
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: "#991b1b",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
