"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      if (Array.isArray(data)) {
        const unread = data.filter((n: any) => !n.isRead).length
        setUnreadCount(unread)
        setNotifications(data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/clear", { method: "DELETE" })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors"
        aria-label="Notifications"
        style={{
          color: "rgba(255, 255, 227, 0.7)",
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white rounded-full"
            style={{
              transform: "translate(25%, -25%)",
              background: "#ef4444",
              minWidth: "18px",
              height: "18px",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 rounded-xl z-50 overflow-hidden"
            style={{
              background: "rgba(20, 20, 20, 0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 227, 0.08)",
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              className="flex items-center justify-between p-4"
              style={{
                borderBottom: "1px solid rgba(255, 255, 227, 0.08)",
              }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: "#ffffe3" }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs transition-colors"
                  style={{ color: "rgba(109, 129, 150, 0.9)" }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div
              className="max-h-96 overflow-y-auto"
              style={{ background: "rgba(10, 10, 10, 0.6)" }}
            >
              {notifications.length === 0 ? (
                <p
                  className="p-4 text-sm text-center"
                  style={{ color: "rgba(255, 255, 227, 0.4)" }}
                >
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 cursor-pointer transition-colors"
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 227, 0.04)",
                      background: !notification.isRead
                        ? "rgba(109, 129, 150, 0.1)"
                        : "transparent",
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255, 255, 227, 0.8)" }}
                    >
                      {notification.message}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "rgba(255, 255, 227, 0.4)" }}
                    >
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div
              className="p-2 text-center"
              style={{
                borderTop: "1px solid rgba(255, 255, 227, 0.08)",
                background: "rgba(20, 20, 20, 0.8)",
              }}
            >
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-xs py-2 transition-colors"
                style={{ color: "rgba(255, 255, 227, 0.6)" }}
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
