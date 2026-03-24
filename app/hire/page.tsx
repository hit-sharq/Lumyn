"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import styles from "./hire.module.css"

const CATEGORIES = ["All", "Technology", "Design", "Marketing", "Finance", "Healthcare", "Education", "Operations", "Sales", "Other"]
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"]

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 500,
    duration: "30 days",
    features: ["Listed in job board", "Standard visibility", "Apply via email or link"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 1200,
    duration: "60 days",
    features: ["Everything in Basic", "60-day listing", "Bolded listing title", "Priority placement"],
    popular: true,
  },
  {
    id: "featured",
    name: "Featured",
    price: 2500,
    duration: "90 days",
    features: ["Everything in Standard", "90-day listing", "Featured badge + highlight", "Pinned to top of results", "Social media promotion"],
  },
]

type Job = {
  id: string
  companyName: string
  companyLogo: string | null
  companyWebsite: string | null
  jobTitle: string
  jobDescription: string
  location: string
  jobType: string
  salary: string | null
  applicationUrl: string | null
  applicationEmail: string | null
  category: string
  tags: string[]
  isFeatured: boolean
  createdAt: string
}

export default function HirePage() {
  const { isSignedIn } = useAuth()
  const [view, setView] = useState<"board" | "post">("board")
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    companyName: "", companyLogo: "", companyWebsite: "",
    jobTitle: "", jobDescription: "", location: "", jobType: "Full-time",
    salary: "", applicationUrl: "", applicationEmail: "",
    category: "Technology", tags: "", plan: "standard",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== "All") params.set("category", selectedCategory)
    fetch(`/api/hire?${params}`).then(r => r.json()).then(data => {
      setJobs(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [selectedCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) return alert("Please sign in to post a job.")
    setSubmitting(true)
    try {
      const jobRes = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      })
      const job = await jobRes.json()
      if (!jobRes.ok) throw new Error(job.error)

      const plan = PLANS.find(p => p.id === form.plan)!
      const payRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job_post",
          itemId: job.id,
          amount: plan.price,
          currency: "KES",
          description: `Lumyn Hire — ${plan.name} job posting: ${form.jobTitle} at ${form.companyName}`,
        }),
      })
      const payment = await payRes.json()
      if (!payRes.ok) throw new Error(payment.error)

      window.location.href = payment.redirect_url
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Lumyn Hire</span>
          <h1 className={styles.heroTitle}>
            Find Kenya's Best <span>Tech Talent</span>
          </h1>
          <p className={styles.heroSub}>
            Connect with skilled developers, designers, and digital professionals.
            Post a job in minutes, get applications within 24 hours.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.ctaBtn} onClick={() => setView("post")}>Post a Job →</button>
            <button className={`${styles.ctaOutline} ${view === "board" ? styles.active : ""}`} onClick={() => setView("board")}>Browse Jobs</button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>KES 500</span>
              <span className={styles.heroStatLabel}>Starting From</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>30 days</span>
              <span className={styles.heroStatLabel}>Min Listing</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>24 hrs</span>
              <span className={styles.heroStatLabel}>First Applications</span>
            </div>
          </div>
        </div>
      </div>

      {view === "board" && (
        <div className={styles.boardSection}>
          <div className={styles.container}>
            <div className={styles.filters}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilter : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className={styles.emptyState}>
                <div className={styles.spinner} />
                <p>Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💼</div>
                <h3>No jobs posted yet</h3>
                <p>Be the first company to reach Lumyn's audience.</p>
                <button className={styles.ctaBtn} onClick={() => setView("post")}>Post a Job</button>
              </div>
            ) : (
              <div className={styles.jobGrid}>
                {jobs.map(job => (
                  <div key={job.id} className={`${styles.jobCard} ${job.isFeatured ? styles.featured : ""}`} onClick={() => setSelectedJob(job)}>
                    {job.isFeatured && <span className={styles.featuredBadge}>⭐ Featured</span>}
                    <div className={styles.jobMeta}>
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} className={styles.companyLogo} />
                      ) : (
                        <div className={styles.companyInitial}>{job.companyName[0]}</div>
                      )}
                      <div>
                        <h3 className={styles.jobTitle}>{job.jobTitle}</h3>
                        <p className={styles.companyName}>{job.companyName}</p>
                      </div>
                    </div>
                    <div className={styles.jobTags}>
                      <span className={styles.pill}>{job.jobType}</span>
                      <span className={styles.pill}>{job.location}</span>
                      {job.salary && <span className={styles.pill}>{job.salary}</span>}
                    </div>
                    <p className={styles.jobDesc}>{job.jobDescription.slice(0, 120)}...</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.category}>{job.category}</span>
                      <span className={styles.applyBtn}>View & Apply →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedJob && (
        <div className={styles.modal} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedJob(null)}>✕</button>
            {selectedJob.isFeatured && <span className={styles.featuredBadge}>⭐ Featured</span>}
            <h2 className={styles.modalTitle}>{selectedJob.jobTitle}</h2>
            <p className={styles.modalCompany}>{selectedJob.companyName}</p>
            <div className={styles.jobTags} style={{ marginBottom: 24 }}>
              <span className={styles.pill}>{selectedJob.jobType}</span>
              <span className={styles.pill}>{selectedJob.location}</span>
              {selectedJob.salary && <span className={styles.pill}>{selectedJob.salary}</span>}
              <span className={styles.pill}>{selectedJob.category}</span>
            </div>
            <div className={styles.jobDescription}>
              {selectedJob.jobDescription.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className={styles.applySection}>
              {selectedJob.applicationUrl && (
                <a href={selectedJob.applicationUrl} target="_blank" rel="noopener noreferrer" className={styles.applyBtnLarge}>Apply Now</a>
              )}
              {selectedJob.applicationEmail && !selectedJob.applicationUrl && (
                <a href={`mailto:${selectedJob.applicationEmail}`} className={styles.applyBtnLarge}>Apply via Email</a>
              )}
              {selectedJob.companyWebsite && (
                <a href={selectedJob.companyWebsite} target="_blank" rel="noopener noreferrer" className={styles.websiteBtn}>Company Website</a>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "post" && (
        <div className={styles.postSection}>
          <div className={styles.container}>
            <div className={styles.postHeader}>
              <h2 className={styles.sectionTitle}>Post a Job on Lumyn</h2>
              <p className={styles.sectionSub}>Choose a plan, fill in your listing, and pay via M-Pesa, card, or bank transfer through Pesapal.</p>
            </div>

            <div className={styles.plansGrid}>
              {PLANS.map(plan => (
                <div
                  key={plan.id}
                  className={`${styles.planCard} ${form.plan === plan.id ? styles.selectedPlan : ""} ${plan.popular ? styles.popularPlan : ""}`}
                  onClick={() => setForm(f => ({ ...f, plan: plan.id }))}
                >
                  {plan.popular && <span className={styles.popularBadge}>Most Popular</span>}
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.priceAmount}>KES {plan.price.toLocaleString()}</span>
                    <span className={styles.pricePeriod}>/ {plan.duration}</span>
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f, i) => (
                      <li key={i} className={styles.planFeature}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <form className={styles.jobForm} onSubmit={handleSubmit}>
              <h3 className={styles.formSection}>Company Information</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company Name *</label>
                  <input className={styles.input} required value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} placeholder="Acme Corp" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company Website</label>
                  <input className={styles.input} value={form.companyWebsite} onChange={e => setForm(f => ({ ...f, companyWebsite: e.target.value }))} placeholder="https://acmecorp.com" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Company Logo URL</label>
                <input className={styles.input} value={form.companyLogo} onChange={e => setForm(f => ({ ...f, companyLogo: e.target.value }))} placeholder="https://..." />
              </div>

              <h3 className={styles.formSection}>Job Details</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Title *</label>
                  <input className={styles.input} required value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} placeholder="Senior Frontend Developer" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category *</label>
                  <select className={styles.select} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  <input className={styles.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Nairobi / Remote" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Type</label>
                  <select className={styles.select} value={form.jobType} onChange={e => setForm(f => ({ ...f, jobType: e.target.value }))}>
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Salary Range</label>
                <input className={styles.input} value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="KES 80,000 – 150,000 / month" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Job Description *</label>
                <textarea className={styles.textarea} required rows={8} value={form.jobDescription} onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))} placeholder="Describe the role, responsibilities, qualifications, and what makes this position great..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tags (comma-separated)</label>
                <input className={styles.input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="React, Node.js, TypeScript, Remote" />
              </div>

              <h3 className={styles.formSection}>How to Apply</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Application URL</label>
                  <input className={styles.input} value={form.applicationUrl} onChange={e => setForm(f => ({ ...f, applicationUrl: e.target.value }))} placeholder="https://yourcompany.com/apply" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Or Application Email</label>
                  <input className={styles.input} type="email" value={form.applicationEmail} onChange={e => setForm(f => ({ ...f, applicationEmail: e.target.value }))} placeholder="jobs@company.com" />
                </div>
              </div>

              <div className={styles.formSummary}>
                <div className={styles.summaryLeft}>
                  <strong>Selected Plan:</strong> {PLANS.find(p => p.id === form.plan)?.name} —{" "}
                  <strong>KES {PLANS.find(p => p.id === form.plan)?.price.toLocaleString()}</strong>
                </div>
                <div className={styles.paymentNote}>💳 Pay securely via M-Pesa, card, or bank through Pesapal</div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Processing..." : `Post Job & Pay KES ${PLANS.find(p => p.id === form.plan)?.price.toLocaleString()}`}
              </button>

              {!isSignedIn && (
                <p className={styles.signInNote}>You need to <Link href="/sign-in">sign in</Link> before posting a job.</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
