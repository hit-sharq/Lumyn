"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Users, Gift, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface ReferralData {
  code: string
  stats: {
    referralsSent: number
    referralsReceived: number
    rewardsEarned: number
  }
  referrals: Array<{
    id: string
    referrer?: { firstName: string; lastName: string; email: string }
    referred?: { firstName: string; lastName: string; email: string }
    status: string
    rewardType?: string
    rewardGiven: boolean
    createdAt: string
  }>
}

export default function ReferralDashboard() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch("/api/referrals")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (error) {
      console.error("Failed to fetch referrals:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const copyToClipboard = async () => {
    if (!data?.code) return
    const link = `${window.location.origin}/sign-up?ref=${data.code}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referredEmail: email }),
      })

      const result = await res.json()

      if (result.success) {
        setMessage({ type: "success", text: "Referral sent successfully!" })
        setEmail("")
        fetchData()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to send referral" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Failed to load referral data</p>
      </div>
    )
  }

  const referralLink = `${window.location.origin}/sign-up?ref=${data.code}`

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Referral Program
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Share Lumyn with friends and earn rewards
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-3 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Referrals Sent</p>
                <p className="text-2xl font-bold text-slate-900">{data.stats.referralsSent}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Referrals Received</p>
                <p className="text-2xl font-bold text-slate-900">{data.stats.referralsReceived}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-50 p-2">
                <Gift className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Rewards Earned</p>
                <p className="text-2xl font-bold text-slate-900">{data.stats.rewardsEarned}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Referral Link</h2>
          <div className="flex gap-3">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm bg-slate-50"
            />
            <button
              onClick={copyToClipboard}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 flex items-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Share this link. When someone signs up and makes their first purchase, you'll earn a reward.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Invite by Email</h2>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              required
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Invite"}
            </button>
          </form>
          {message && (
            <p className={`mt-3 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Referral History</h2>
          </div>
          {data.referrals.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-500">No referrals yet. Start sharing to earn rewards!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {data.referrals.map((referral) => (
                <div key={referral.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {referral.referred ? (
                        `${referral.referred.firstName} ${referral.referred.lastName}`
                      ) : (
                        referral.referrer ? `${referral.referrer.firstName} ${referral.referrer.lastName}` : "Unknown User"
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(referral.createdAt).toLocaleDateString()} • {referral.status}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      referral.rewardGiven
                        ? "bg-green-50 text-green-700"
                        : referral.status === "completed"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {referral.rewardGiven
                      ? `Rewarded: ${referral.rewardType || "N/A"}`
                      : referral.status === "completed"
                      ? "Completed"
                      : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
