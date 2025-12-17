"use client"

import { useEffect } from "react"
import styles from "./toast-notification.module.css"

interface ToastProps {
  message: string
  type: "success" | "error" | "info" | "warning"
  onClose: () => void
  duration?: number
}

export default function ToastNotification({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  }

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastIcon}>{icons[type]}</div>
      <div className={styles.toastMessage}>{message}</div>
      <button onClick={onClose} className={styles.toastClose} aria-label="Close">
        ✕
      </button>
    </div>
  )
}
