"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./callback.module.css"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading")
  const [message, setMessage] = useState("")

  const type = searchParams.get("type")
  const itemId = searchParams.get("itemId")
  const ref = searchParams.get("ref")
  const orderTrackingId = searchParams.get("OrderTrackingId")

  useEffect(() => {
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

        const res = await fetch(`/api/payments/status?${params}`)
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

    checkStatus()
  }, [ref, orderTrackingId])

  const getRedirectPath = () => {
    if (type === "studio_template") return "/studio"
    if (type === "market_product") return "/market"
    if (type === "job_post") return "/hire"
    return "/"
  }

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
              <Link href={getRedirectPath()} className={styles.primaryBtn}>
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
              <Link href={getRedirectPath()} className={styles.primaryBtn}>
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
              <Link href={getRedirectPath()} className={styles.primaryBtn}>
                Go Back
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
