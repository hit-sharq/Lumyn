"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import styles from "../launch.module.css"

interface Project {
  id?: string
  title: string
  description: string
  imageUrl: string
  liveUrl: string
  githubUrl: string
  tags: string
}

interface PortfolioData {
  id?: string
  username: string
  displayName: string
  title: string
  about: string
  skills: string[]
  socialLinks: { github?: string; linkedin?: string; twitter?: string; website?: string }
  avatarUrl: string
  templateId: string
  isPublished: boolean
  projects: Project[]
}

const SOCIAL_FIELDS = [
  { key: "github", label: "GitHub URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "twitter", label: "Twitter URL" },
  { key: "website", label: "Personal Website" },
]

function BuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()
  const templateId = searchParams.get("template") || "minimal-dev"
  const editId = searchParams.get("edit")

  const [activeTab, setActiveTab] = useState<"about" | "skills" | "projects" | "social" | "publish">("about")
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [newProject, setNewProject] = useState<Project>({ title: "", description: "", imageUrl: "", liveUrl: "", githubUrl: "", tags: "" })
  const [addingProject, setAddingProject] = useState(false)

  const [data, setData] = useState<PortfolioData>({
    username: "",
    displayName: user?.fullName || "",
    title: "",
    about: "",
    skills: [],
    socialLinks: {},
    avatarUrl: "",
    templateId,
    isPublished: false,
    projects: [],
  })

  useEffect(() => {
    if (user && !data.displayName) {
      setData(d => ({ ...d, displayName: user.fullName || "" }))
    }
  }, [user])

  useEffect(() => {
    if (editId) loadPortfolio(editId)
  }, [editId])

  const loadPortfolio = async (id: string) => {
    try {
      const res = await fetch(`/api/launch/portfolios/${id}`)
      const p = await res.json()
      setData({
        id: p.id,
        username: p.username,
        displayName: p.displayName,
        title: p.title || "",
        about: p.about || "",
        skills: p.skills || [],
        socialLinks: (p.socialLinks as any) || {},
        avatarUrl: p.avatarUrl || "",
        templateId: p.templateId,
        isPublished: p.isPublished,
        projects: (p.projects || []).map((pr: any) => ({ ...pr, tags: pr.tags.join(", ") })),
      })
    } catch {}
  }

  if (!isLoaded) return null
  if (!isSignedIn) {
    return (
      <div className={styles.noAccess}>
        <h2 className={styles.noAccessTitle}>Sign in to build your portfolio</h2>
        <p className={styles.noAccessText}>Create a free account to get started.</p>
        <Link href="/launch" style={{ color: "#2d6a9f", textDecoration: "none", fontWeight: 600 }}>
          ← Back to Launch
        </Link>
      </div>
    )
  }

  const update = (field: keyof PortfolioData, value: any) => setData(d => ({ ...d, [field]: value }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !data.skills.includes(s)) {
      update("skills", [...data.skills, s])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => update("skills", data.skills.filter(s => s !== skill))

  const addProject = () => {
    if (!newProject.title) return
    update("projects", [...data.projects, newProject])
    setNewProject({ title: "", description: "", imageUrl: "", liveUrl: "", githubUrl: "", tags: "" })
    setAddingProject(false)
  }

  const removeProject = (i: number) => update("projects", data.projects.filter((_, idx) => idx !== i))

  const save = async () => {
    if (!data.username || !data.displayName) {
      setMessage("Please fill in your username and display name.")
      return
    }
    setSaving(true)
    setMessage("")
    try {
      let res, portfolio
      if (data.id) {
        res = await fetch(`/api/launch/portfolios/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      } else {
        res = await fetch("/api/launch/portfolios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }
      portfolio = await res.json()
      if (!res.ok) {
        setMessage(portfolio.error || "Failed to save portfolio.")
        return
      }
      update("id", portfolio.id)
      setMessage("Portfolio saved!")
    } catch {
      setMessage("Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    if (!data.id) {
      await save()
      if (!data.id) return
    }
    setPublishing(true)
    try {
      const res = await fetch(`/api/launch/portfolios/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isPublished: !data.isPublished }),
      })
      const updated = await res.json()
      update("isPublished", updated.isPublished)
      setMessage(updated.isPublished ? "🎉 Portfolio is now live!" : "Portfolio unpublished.")
    } finally {
      setPublishing(false)
    }
  }

  const PreviewContent = () => (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 40, background: "#fff", minHeight: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt="" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#1a3a5c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#ffffe3", margin: "0 auto" }}>
            {data.displayName.charAt(0) || "?"}
          </div>
        )}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "16px 0 8px" }}>{data.displayName || "Your Name"}</h1>
        {data.title && <p style={{ color: "#666", fontSize: 16 }}>{data.title}</p>}
        {data.username && <p style={{ color: "#999", fontSize: 13 }}>@{data.username}</p>}
      </div>
      {data.about && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>About</h2>
          <p style={{ color: "#555", lineHeight: 1.7 }}>{data.about}</p>
        </div>
      )}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map(s => (
              <span key={s} style={{ background: "#f0f4ff", color: "#1a3a5c", padding: "4px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {data.projects.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Projects</h2>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
            {data.projects.map((p, i) => (
              <div key={i} style={{ background: "#f8f8f8", borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{p.title}</h3>
                <p style={{ color: "#666", fontSize: 13, lineHeight: 1.5 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.builderLayout}>
      <div className={styles.builderPanel}>
        <h2 className={styles.builderPanelTitle}>Portfolio Builder</h2>
        <div className={styles.builderTabs}>
          {(["about", "skills", "projects", "social", "publish"] as const).map(tab => (
            <button
              key={tab}
              className={`${styles.builderTab} ${activeTab === tab ? styles.builderTabActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "about" && (
          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Username *</label>
              <input className={styles.formInput} value={data.username} onChange={e => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="john-doe" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Display Name *</label>
              <input className={styles.formInput} value={data.displayName} onChange={e => update("displayName", e.target.value)} placeholder="John Doe" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Professional Title</label>
              <input className={styles.formInput} value={data.title} onChange={e => update("title", e.target.value)} placeholder="Full-Stack Developer" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Avatar URL</label>
              <input className={styles.formInput} value={data.avatarUrl} onChange={e => update("avatarUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>About Me</label>
              <textarea className={styles.formTextarea} value={data.about} onChange={e => update("about", e.target.value)} placeholder="Tell your story..." />
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div>
            <div className={styles.skillChips}>
              {data.skills.map(s => (
                <div key={s} className={styles.skillChip}>
                  {s}
                  <button className={styles.skillChipRemove} onClick={() => removeSkill(s)}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className={styles.formInput}
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSkill()}
                placeholder="Add a skill..."
                style={{ flex: 1 }}
              />
              <button className={styles.addBtn} onClick={addSkill}>Add</button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#6d8196", marginTop: 12 }}>Press Enter or click Add to add a skill</p>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            {data.projects.map((p, i) => (
              <div key={i} className={styles.projectItem}>
                <div className={styles.projectItemHeader}>
                  <span className={styles.projectItemTitle}>{p.title}</span>
                  <button className={styles.removeBtn} onClick={() => removeProject(i)}>Remove</button>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#6d8196" }}>{p.description}</p>
              </div>
            ))}

            {addingProject ? (
              <div style={{ background: "rgba(74,74,74,0.04)", borderRadius: 10, padding: 16, border: "1px solid rgba(74,74,74,0.1)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Title</label>
                  <input className={styles.formInput} value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea className={styles.formTextarea} style={{ minHeight: 70 }} value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Live URL</label>
                  <input className={styles.formInput} value={newProject.liveUrl} onChange={e => setNewProject(p => ({ ...p, liveUrl: e.target.value }))} placeholder="https://..." />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>GitHub URL</label>
                  <input className={styles.formInput} value={newProject.githubUrl} onChange={e => setNewProject(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className={styles.saveBtn} style={{ marginTop: 0 }} onClick={addProject}>Add Project</button>
                  <button className={styles.saveBtn} style={{ marginTop: 0, background: "rgba(74,74,74,0.08)", color: "#4a4a4a" }} onClick={() => setAddingProject(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className={styles.addBtn} onClick={() => setAddingProject(true)}>+ Add Project</button>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div>
            {SOCIAL_FIELDS.map(f => (
              <div key={f.key} className={styles.formGroup}>
                <label className={styles.formLabel}>{f.label}</label>
                <input
                  className={styles.formInput}
                  value={(data.socialLinks as any)[f.key] || ""}
                  onChange={e => update("socialLinks", { ...data.socialLinks, [f.key]: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "publish" && (
          <div>
            {data.username && (
              <div style={{ background: "rgba(45,106,159,0.08)", borderRadius: 10, padding: 16, marginBottom: 24 }}>
                <p style={{ fontSize: "0.85rem", color: "#2d6a9f", fontWeight: 600, marginBottom: 4 }}>Your portfolio URL</p>
                <p style={{ fontSize: "0.9rem", color: "#4a4a4a" }}>/portfolio/{data.username}</p>
              </div>
            )}
            <p style={{ color: "#6d8196", fontSize: "0.9rem", marginBottom: 20, lineHeight: 1.6 }}>
              {data.isPublished
                ? "Your portfolio is currently live. Anyone with the link can view it."
                : "Your portfolio is in draft mode. Publish it to make it visible to others."}
            </p>
            {data.isPublished && data.username && (
              <a
                href={`/portfolio/${data.username}`}
                target="_blank"
                rel="noreferrer"
                className={styles.saveBtn}
                style={{ display: "block", textAlign: "center", textDecoration: "none", marginBottom: 8 }}
              >
                View Live Portfolio ↗
              </a>
            )}
          </div>
        )}

        {message && (
          <p style={{ color: message.includes("wrong") || message.includes("Failed") ? "#e74c3c" : "#2ecc71", fontSize: "0.85rem", fontWeight: 600, margin: "12px 0 0" }}>
            {message}
          </p>
        )}

        <button className={styles.saveBtn} onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Portfolio"}
        </button>

        <button
          className={data.isPublished ? styles.unpublishBtn : styles.publishBtn}
          onClick={publish}
          disabled={publishing}
        >
          {publishing ? "..." : data.isPublished ? "Unpublish" : "Publish Portfolio"}
        </button>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/launch/dashboard" style={{ color: "#6d8196", fontSize: "0.85rem", textDecoration: "none" }}>
            ← My Portfolios
          </Link>
        </div>
      </div>

      <div className={styles.builderPreview}>
        <div className={styles.previewBar}>
          <div className={styles.previewBarDot} style={{ background: "#ff5f57" }} />
          <div className={styles.previewBarDot} style={{ background: "#febc2e" }} />
          <div className={styles.previewBarDot} style={{ background: "#28c840" }} />
          <div className={styles.previewBarUrl}>
            {data.username ? `/portfolio/${data.username}` : "your-portfolio-url"}
          </div>
        </div>
        <div className={styles.previewContent}>
          <PreviewContent />
        </div>
      </div>
    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense>
      <BuilderContent />
    </Suspense>
  )
}
