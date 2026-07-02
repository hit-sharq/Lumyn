"use client"

import { useState } from "react"
import { getProposals, approveProposal, generateBusinessCase } from "@/app/actions/proposal"
import styles from "../growth.module.css"

export default function ProposalsManager() {
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [bottleneck, setBottleneck] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  const fetchProposals = async () => {
    try {
      const res = await fetch("/api/actions/proposal?action=list", { cache: "no-store" })
      const data = await res.json()
      setProposals(data)
    } catch (e) {
      console.error("Failed to load proposals", e)
    } finally {
      setInitialLoading(false)
    }
  }

  useState(() => {
    fetchProposals()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const formData = new FormData()
      formData.append("clientCompanyName", companyName)
      formData.append("targetIndustry", industry)
      formData.append("operationalBottleneck", bottleneck)

      const result = await generateBusinessCase(formData)

      if (result.success) {
        setMsg({ type: "success", text: "Business case generated successfully!" })
        setCompanyName("")
        setIndustry("")
        setBottleneck("")
        fetchProposals()
      } else {
        setMsg({ type: "error", text: result.error || "Generation failed" })
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/actions/proposal?action=approve&id=${id}`, { method: "POST" })
      if (res.ok) {
        setMsg({ type: "success", text: "Proposal approved" })
        fetchProposals()
      } else {
        setMsg({ type: "error", text: "Approval failed" })
      }
    } catch (err) {
      setMsg({ type: "error", text: "Approval failed" })
    }
  }

  return (
    <main className={styles.growthPage}>
      <div>
        <a href="/admin" className={styles.growthBack}>
          ← Back to Admin
        </a>
      </div>
      <div className={styles.growthHeader}>
        <h1 className={styles.growthTitle}>Enterprise Procurement Engine</h1>
        <p className={styles.growthSubtitle}>Internal Sales Proposal Generator</p>
      </div>

      {msg && (
        <div
          className={`${styles.growthCard} ${
            msg.type === "success"
              ? "border-green-500/30 bg-green-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <p className={msg.type === "success" ? "text-green-400" : "text-red-400"}>{msg.text}</p>
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className={styles.growthCard}>
            <h2 className={styles.growthCardTitle}>Generate New Proposal</h2>
            <p className={styles.growthCardSubtitle}>
              Enter client details to auto-generate an enterprise business case.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="clientCompanyName" className={styles.growthLabel}>
                  Client Company Name
                </label>
                <input
                  type="text"
                  id="clientCompanyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="e.g., Acme Corporation"
                  className={styles.growthInput}
                />
              </div>

              <div>
                <label htmlFor="targetIndustry" className={styles.growthLabel}>
                  Target Industry
                </label>
                <select
                  id="targetIndustry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  className={styles.growthInput}
                >
                  <option value="">Select industry...</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Retail">Retail</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Technology">Technology</option>
                  <option value="Energy">Energy</option>
                  <option value="Telecommunications">Telecommunications</option>
                </select>
              </div>

              <div>
                <label htmlFor="operationalBottleneck" className={styles.growthLabel}>
                  Operational Bottleneck
                </label>
                <textarea
                  id="operationalBottleneck"
                  value={bottleneck}
                  onChange={(e) => setBottleneck(e.target.value)}
                  required
                  rows={4}
                  placeholder="e.g., Legacy system fragmentation causing 20+ hours/week in manual data reconciliation across 3 regions..."
                  className={styles.growthInput}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${styles.growthButton} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "Generating..." : "Generate Business Case"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className={styles.growthCard}>
            <div className={styles.growthHeader}>
              <h2 className={styles.growthCardTitle}>Generated Proposals</h2>
              <p className={styles.growthCardSubtitle}>
                {proposals.length} total proposal{proposals.length !== 1 ? "s" : ""}
              </p>
            </div>

            {initialLoading ? (
              <p className={styles.growthEmpty}>Loading proposals...</p>
            ) : proposals.length === 0 ? (
              <p className={styles.growthEmpty}>
                No proposals generated yet. Use the form to create your first enterprise business case.
              </p>
            ) : (
              <div>
                {proposals.map((proposal) => {
                  const data = proposal.proposalData as any
                  return (
                    <article key={proposal.id} className={styles.growthCard}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={styles.growthCardTitle}>{proposal.clientCompanyName}</h3>
                          <p className={styles.growthCardSubtitle}>
                            {proposal.targetIndustry} •{" "}
                            {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`${styles.growthBadge} ${proposal.isApprovedBySales ? styles.growthBadgeSuccess : styles.growthBadgeWarning}`}
                        >
                          {proposal.isApprovedBySales ? "Approved" : "Pending Review"}
                        </span>
                      </div>

                      {data && (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                          <div className={styles.growthCard}>
                            <h4 className={styles.growthSectionTitle}>Financial Projections</h4>
                            <dl className="mt-3 space-y-2">
                              <div>
                                <dt className={styles.growthStatLabel}>Annual Savings</dt>
                                <dd className={styles.growthStatValue}>
                                  {data.financialProjections?.annualSavings || "N/A"}
                                </dd>
                              </div>
                              <div>
                                <dt className={styles.growthStatLabel}>Payback Period</dt>
                                <dd className={styles.growthStatValue}>
                                  {data.financialProjections?.paybackPeriodMonths
                                    ? `${data.financialProjections.paybackPeriodMonths} months`
                                    : "N/A"}
                                </dd>
                              </div>
                              <div>
                                <dt className={styles.growthStatLabel}>Efficiency Gain</dt>
                                <dd className={styles.growthStatValue}>
                                  {data.financialProjections?.efficiencyMultiplier || "N/A"}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className={styles.growthCard}>
                            <h4 className={styles.growthSectionTitle}>Risk & Compliance</h4>
                            <dl className="mt-3 space-y-2">
                              <div>
                                <dt className={styles.growthStatLabel}>GDPR Status</dt>
                                <dd className={styles.growthStatValue}>
                                  {data.complianceMapping?.gdprComplianceStatus || "N/A"}
                                </dd>
                              </div>
                              <div>
                                <dt className={styles.growthStatLabel}>Data Isolation</dt>
                                <dd
                                  className={styles.growthStatValue}
                                  title={data.complianceMapping?.dataIsolationProtocol || ""}
                                >
                                  {data.complianceMapping?.dataIsolationProtocol || "N/A"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      )}

                      {data?.implementationTimeline && (
                        <div className="mt-6">
                          <h4 className={styles.growthSectionTitle}>Implementation Timeline</h4>
                          <ol className="mt-3 space-y-3">
                            {data.implementationTimeline.map((step: any, idx: number) => (
                              <li key={idx} className={styles.growthCard}>
                                <div className="flex gap-3">
                                  <span className={`${styles.growthBadge} ${styles.growthBadgeSuccess}`}>
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1">
                                    <p className={styles.growthCardTitle}>{step.phase}</p>
                                    <p className={styles.growthCardSubtitle}>{step.duration}</p>
                                    {step.deliverables && (
                                      <ul className={`mt-2 list-inside list-disc ${styles.growthCardSubtitle}`}>
                                        {step.deliverables.slice(0, 3).map((d: string, i: number) => (
                                          <li key={i}>{d}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {data?.executiveSummary && (
                        <div className={styles.growthCard}>
                          <h4 className={styles.growthSectionTitle}>Executive Summary</h4>
                          <p className={styles.growthCardSubtitle}>{data.executiveSummary}</p>
                          <p className={styles.growthCardSubtitle}>{data.legalDisclaimer}</p>
                        </div>
                      )}

                      <div className="mt-6 flex items-center gap-3">
                        <button
                          onClick={() => handleApprove(proposal.id)}
                          disabled={proposal.isApprovedBySales}
                          className={`${styles.growthButton} ${!proposal.isApprovedBySales ? "" : styles.growthButtonSecondary}`}
                        >
                          {proposal.isApprovedBySales ? "Approved" : "Approve for Delivery"}
                        </button>
                        <span className={styles.growthCardSubtitle}>
                          Generated {new Date(proposal.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
