"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./callback.module.css"
// PaymentStatusData type moved to page.tsx, no longer needed here

interface ClientComponentProps {
  initialStatus: "loading" | "success" | "failed" | "pending"
  initialMessage: string
  type?: string
  redirectPath: string
}

export default function PaymentCallbackClient({
  initialStatus,
  initialMessage,
  type,
  redirectPath
}: ClientComponentProps) {
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">(initialStatus)
  const [message, setMessage] = useState(initialMessage)
  const router = useRouter()
  const ref = new URLSearchParams(window.location.search).get("ref")
  const orderTrackingId = new URLSearchParams(window.location.search).get("OrderTrackingId")

  useEffect(() => {
    if (status !== "loading") return

    if (!ref) {
      setStatus("failed")
      setMessage("Invalid payment reference.")
      return
    }

    const checkStatus = async () => {
      try {
        const params = new URLSearchParams()
        if (ref) params.set("ref", ref)
        if (orderTrackingId) params.set("orderTrackingId", orderTrackingId)

        const res = await fetch(`/api/payments/status?${params.toString()}`)
        const data = await res.json()

        if (data.status === "COMPLETED") {
          setStatus("success")
          setMessage("Your payment was successful! Your purchase has been activated.")
        } else if (data.status === "FAILED" || data.status === "Invalid") {
          setStatus("failed")
          setMessage("Payment was not completed. Please try again.")
        } else {
          setStatus("pending")
          setMessage("Payment is being processed. We'll notify you once confirmed.")
        }
      } catch {
        setStatus("pending")
        setMessage("We're verifying your payment. Please check back shortly.")
      }
    }

    const timeout = setTimeout(checkStatus, 1000)
    return () => clearTimeout(timeout)
  }, [ref, orderTrackingId, status])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {status === "loading" && (
          <>
            <div className={styles.spinner} />
            <h1 className={styles.title}>Verifying Payment...</h1>
            <p className={styles.text}>Please wait while we confirm your payment with Pesapal.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.iconSuccess}>✓</div>
            <h1 className={styles.title}>Payment Successful!</h1>
            <p className={styles.text}>{message}</p>
            <div className={styles.actions}>
              <Link href={redirectPath} className={styles.primaryBtn}>
                Continue
              </Link>
              <Link href="/dashboard" className={styles.secondaryBtn}>
                My Dashboard
              </Link>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className={styles.iconFailed}>✗</div>
            <h1 className={styles.title}>Payment Failed</h1>
            <p className={styles.text}>{message}</p>
            <div className={styles.actions}>
              <Link href={redirectPath} className={styles.primaryBtn}>
                Try Again
              </Link>
              <Link href="/contact" className={styles.secondaryBtn}>
                Contact Support
              </Link>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <div className={styles.iconPending}>⏳</div>
            <h1 className={styles.title}>Payment Pending</h1>
            <p className={styles.text}>{message}</p>
            <div className={styles.actions}>
              <Link href={redirectPath} className={styles.primaryBtn}>
                Go Back
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
