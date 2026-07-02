"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface Notification {
  id: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      if (Array.isArray(data)) {
        setNotifications(data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/clear", { method: "DELETE" })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#ffffe3]"
            style={{ color: "rgba(255, 255, 227, 0.7)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#ffffe3" }}>
            Notifications
          </h1>
          <p className="mt-2 text-lg" style={{ color: "rgba(255, 255, 227, 0.5)" }}>
            {notifications.filter((n) => !n.isRead).length} unread
          </p>
        </motion.div>

        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "rgba(255, 255, 227, 0.2)" }}></div>
            </div>
          ) : notifications.length === 0 ? (
            <div
              className="rounded-2xl border p-12 text-center"
              style={{
                background: "rgba(20, 20, 20, 0.85)",
                borderColor: "rgba(255, 255, 227, 0.08)",
              }}
            >
              <p style={{ color: "rgba(255, 255, 227, 0.4)" }}>
                No notifications yet. We'll notify you when something important happens.
              </p>
            </div>
          ) : (
            <div>
              {notifications.length > 0 && (
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-medium transition-colors hover:text-[#ffffe3]"
                    style={{ color: "rgba(109, 129, 150, 0.9)" }}
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: "rgba(20, 20, 20, 0.85)",
                  borderColor: "rgba(255, 255, 227, 0.08)",
                }}
              >
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer transition-colors"
                    style={{
                      padding: "20px 24px",
                      borderBottom:
                        index < notifications.length - 1
                          ? "1px solid rgba(255, 255, 227, 0.04)"
                          : "none",
                      background: notification.isRead
                        ? "transparent"
                        : "rgba(109, 129, 150, 0.1)",
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: notification.isRead
                              ? "rgba(255, 255, 227, 0.6)"
                              : "rgba(255, 255, 227, 0.9)",
                          }}
                        >
                          {notification.message}
                        </p>
                        <p
                          className="mt-2 text-xs"
                          style={{ color: "rgba(255, 255, 227, 0.4)" }}
                        >
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div
                          className="mt-1 h-2 w-2 rounded-full shrink-0"
                          style={{ background: "#6d8196" }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
