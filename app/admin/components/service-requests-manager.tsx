"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import styles from "./service-requests.module.css"

interface ServiceRequest {
  id: string
  userEmail: string
  userName?: string
  serviceType: string
  budget?: string
  timeline?: string
  message: string
  status: string
  reply?: string
  repliedAt?: string
  createdAt: string
}

export default function ServiceRequestsManager() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [replyText, setReplyText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/service-requests")
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch service requests:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest || !replyText.trim()) return

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/service-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Reply sent successfully!" })
        setReplyText("")
        setSelectedRequest(null)
        fetchRequests()
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "Failed to send reply" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return styles.serviceRequestStatusPending
      case "replied":
        return styles.serviceRequestStatusReplied
      case "closed":
        return styles.serviceRequestStatusClosed
      default:
        return styles.serviceRequestStatusClosed
    }
  }

  if (loading) {
    return (
      <div className={styles.serviceRequestsPage}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </div>
    )
  }

  return (
    <main className={styles.serviceRequestsPage}>
      <div className={styles.serviceRequestsHeader}>
        <h1 className={styles.serviceRequestsTitle}>Service Requests</h1>
        <p className={styles.serviceRequestsSubtitle}>Manage client service inquiries and replies</p>
      </div>

      {message && (
        <div
          className={`${styles.serviceRequestsMessage} ${
            message.type === "success"
              ? styles.serviceRequestsMessageSuccess
              : styles.serviceRequestsMessageError
          }`}
        >
          {message.text}
        </div>
      )}

      {selectedRequest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.serviceRequestDetail}
        >
          <div className={styles.serviceRequestDetailHeader}>
            <div>
              <h2 className={styles.serviceRequestDetailTitle}>{selectedRequest.serviceType}</h2>
              <p className={styles.serviceRequestDetailEmail}>
                {selectedRequest.userName || selectedRequest.userEmail} • {selectedRequest.userEmail}
              </p>
            </div>
            <span className={`${styles.serviceRequestStatusBadge} ${getStatusClass(selectedRequest.status)}`}>
              {selectedRequest.status}
            </span>
          </div>

          <div className={styles.serviceRequestDetailGrid}>
            {selectedRequest.budget && (
              <div className={styles.serviceRequestDetailItem}>
                <p className={styles.serviceRequestDetailLabel}>Budget</p>
                <p className={styles.serviceRequestDetailValue}>{selectedRequest.budget}</p>
              </div>
            )}
            {selectedRequest.timeline && (
              <div className={styles.serviceRequestDetailItem}>
                <p className={styles.serviceRequestDetailLabel}>Timeline</p>
                <p className={styles.serviceRequestDetailValue}>{selectedRequest.timeline}</p>
              </div>
            )}
            <div className={styles.serviceRequestDetailItem}>
              <p className={styles.serviceRequestDetailLabel}>Message</p>
              <p className={styles.serviceRequestDetailValue}>{selectedRequest.message}</p>
            </div>
            {selectedRequest.reply && (
              <div className={styles.serviceRequestDetailReply}>
                <p className={styles.serviceRequestDetailLabel}>Your Reply</p>
                <p className={styles.serviceRequestDetailValue}>{selectedRequest.reply}</p>
                {selectedRequest.repliedAt && (
                  <p className={styles.serviceRequestDetailLabel} style={{ marginTop: 12 }}>
                    Replied on {new Date(selectedRequest.repliedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {selectedRequest.status !== "closed" && (
            <form onSubmit={handleReply} className={styles.serviceRequestReplyForm}>
              <label className={styles.serviceRequestDetailLabel} htmlFor="reply">
                Send Reply to {selectedRequest.userEmail}
              </label>
              <textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className={styles.serviceRequestReplyTextarea}
                placeholder="Type your reply here..."
                required
              />
              <div className={styles.serviceRequestActions}>
                <button type="submit" disabled={submitting} className={styles.serviceRequestSubmitButton}>
                  {submitting ? "Sending..." : "Send Reply"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className={styles.serviceRequestCancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}

      <div className={styles.serviceRequestList}>
        <div className={styles.serviceRequestListHeader}>
          <h3 className={styles.serviceRequestListTitle}>All Requests ({requests.length})</h3>
        </div>

        {requests.length === 0 ? (
          <p className={styles.serviceRequestListEmpty}>
            No service requests yet. They will appear here when users submit the form on /services
          </p>
        ) : (
          <div>
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={styles.serviceRequestListItem}
              >
                <div className={styles.serviceRequestListItemHeader}>
                  <h4 className={styles.serviceRequestListItemTitle}>{request.serviceType}</h4>
                  <span className={`${styles.serviceRequestStatusBadge} ${getStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <div className={styles.serviceRequestListItemMeta}>
                  <span className={styles.serviceRequestListItemAuthor}>
                    {request.userName || request.userEmail}
                  </span>
                  <span className={styles.serviceRequestListItemDate}>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.serviceRequestListItemExcerpt}>{request.message}</p>
                <div className={styles.serviceRequestListItemMetaDetails}>
                  {request.budget && <span className={styles.serviceRequestListItemMetaDetail}>Budget: {request.budget}</span>}
                  {request.timeline && (
                    <span className={styles.serviceRequestListItemMetaDetail}>Timeline: {request.timeline}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
