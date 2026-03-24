"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useUser, SignInButton } from "@clerk/nextjs"
import Link from "next/link"
import styles from "./builder.module.css"

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

const TABS = [
  { id: "about",    label: "About",    icon: "👤" },
  { id: "skills",   label: "Skills",   icon: "⚡" },
  { id: "projects", label: "Projects", icon: "🗂️" },
  { id: "social",   label: "Social",   icon: "🔗" },
  { id: "publish",  label: "Publish",  icon: "🚀" },
] as const

type TabId = typeof TABS[number]["id"]

const SOCIAL_FIELDS = [
  { key: "github",   label: "GitHub",   placeholder: "https://github.com/yourname" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname" },
  { key: "twitter",  label: "Twitter / X", placeholder: "https://twitter.com/yourhandle" },
  { key: "website",  label: "Personal Website", placeholder: "https://yoursite.com" },
]

function BuilderContent() {
  const searchParams = useSearchParams()
  const { user, isSignedIn, isLoaded } = useUser()
  const templateId = searchParams.get("template") || "minimal-dev"
  const editId     = searchParams.get("edit")

  const [activeTab, setActiveTab] = useState<TabId>("about")
  const [saving, setSaving]       = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage]     = useState<{ text: string; ok: boolean } | null>(null)
  const [skillInput, setSkillInput] = useState("")
  const [addingProject, setAddingProject] = useState(false)
  const [newProject, setNewProject] = useState<Project>({
    title: "", description: "", imageUrl: "", liveUrl: "", githubUrl: "", tags: "",
  })

  const [data, setData] = useState<PortfolioData>({
    username: "", displayName: "", title: "", about: "",
    skills: [], socialLinks: {}, avatarUrl: "", templateId,
    isPublished: false, projects: [],
  })

  useEffect(() => {
    if (user && !data.displayName) {
      setData(d => ({ ...d, displayName: user.fullName || "" }))
    }
  }, [user])

  useEffect(() => { if (editId) loadPortfolio(editId) }, [editId])

  const loadPortfolio = async (id: string) => {
    try {
      const res = await fetch(`/api/launch/portfolios/${id}`)
      const p   = await res.json()
      setData({
        id: p.id, username: p.username, displayName: p.displayName,
        title: p.title || "", about: p.about || "", skills: p.skills || [],
        socialLinks: (p.socialLinks as any) || {}, avatarUrl: p.avatarUrl || "",
        templateId: p.templateId, isPublished: p.isPublished,
        projects: (p.projects || []).map((pr: any) => ({ ...pr, tags: pr.tags.join(", ") })),
      })
    } catch {}
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className={styles.page} style={{ height: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className={styles.noAccess}>
          <div className={styles.noAccessIcon}>{!isLoaded ? "⏳" : "🔒"}</div>
          <h2 className={styles.noAccessTitle}>
            {!isLoaded ? "Loading…" : "Sign in to build your portfolio"}
          </h2>
          {isLoaded && (
            <>
              <p className={styles.noAccessText}>Create a free account to get started in minutes.</p>
              <SignInButton mode="modal">
                <button className={styles.noAccessBtn}>Sign In to Continue →</button>
              </SignInButton>
            </>
          )}
        </div>
      </div>
    )
  }

  const update = (field: keyof PortfolioData, value: any) =>
    setData(d => ({ ...d, [field]: value }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !data.skills.includes(s)) {
      update("skills", [...data.skills, s])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) =>
    update("skills", data.skills.filter(s => s !== skill))

  const addProject = () => {
    if (!newProject.title) return
    update("projects", [...data.projects, newProject])
    setNewProject({ title: "", description: "", imageUrl: "", liveUrl: "", githubUrl: "", tags: "" })
    setAddingProject(false)
  }

  const removeProject = (i: number) =>
    update("projects", data.projects.filter((_, idx) => idx !== i))

  const flash = (text: string, ok = true) => {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 3500)
  }

  const save = async () => {
    if (!data.username || !data.displayName) {
      flash("Please fill in your username and display name.", false)
      return
    }
    setSaving(true)
    try {
      const res = data.id
        ? await fetch(`/api/launch/portfolios/${data.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/launch/portfolios", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
      const portfolio = await res.json()
      if (!res.ok) { flash(portfolio.error || "Failed to save.", false); return }
      update("id", portfolio.id)
      flash("Saved successfully!")
    } catch { flash("Something went wrong.", false) }
    finally { setSaving(false) }
  }

  const togglePublish = async () => {
    if (!data.id) { await save(); if (!data.id) return }
    setPublishing(true)
    try {
      const res = await fetch(`/api/launch/portfolios/${data.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isPublished: !data.isPublished }),
      })
      const updated = await res.json()
      update("isPublished", updated.isPublished)
      flash(updated.isPublished ? "Portfolio is now live! 🎉" : "Portfolio unpublished.")
    } finally { setPublishing(false) }
  }

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/launch" className={styles.backLink}>← Launch</Link>
          <div className={styles.topBarSep} />
          <span className={styles.topBarTitle}>
            {data.displayName || "New Portfolio"}
          </span>
        </div>
        <div className={styles.topBarRight}>
          <div className={`${styles.statusDot} ${data.isPublished ? styles.statusDotPublished : ""}`} />
          <span className={styles.statusLabel}>{data.isPublished ? "Live" : "Draft"}</span>
          <button className={styles.saveBtn} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            className={data.isPublished ? styles.unpublishBtn : styles.publishBtn}
            onClick={togglePublish}
            disabled={publishing}
          >
            {publishing ? "…" : data.isPublished ? "Unpublish" : "Publish →"}
          </button>
        </div>
      </div>

      {/* ── Split ── */}
      <div className={styles.split}>
        {/* ── Editor ── */}
        <div className={styles.editor}>
          <div className={styles.tabs}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className={styles.tabIcon}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.form}>
            {message && (
              <div className={`${styles.toast} ${message.ok ? styles.toastSuccess : styles.toastError}`}>
                {message.ok ? "✓" : "✕"} {message.text}
              </div>
            )}

            {/* ── About tab ── */}
            {activeTab === "about" && (
              <>
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Display Name *</label>
                    <input
                      className={styles.input}
                      value={data.displayName}
                      onChange={e => update("displayName", e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Username * <span className={styles.hint}>letters, numbers, dashes</span>
                    </label>
                    <input
                      className={styles.input}
                      value={data.username}
                      onChange={e => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                      placeholder="jane-doe"
                    />
                  </div>
                </div>

                {data.username && (
                  <div className={styles.urlPreview}>
                    <span className={styles.urlPreviewBase}>/creators/</span>
                    <span className={styles.urlPreviewSlug}>{data.username}</span>
                  </div>
                )}

                <div className={styles.fieldGroup} style={{ marginTop: 20 }}>
                  <label className={styles.label}>Professional Title</label>
                  <input
                    className={styles.input}
                    value={data.title}
                    onChange={e => update("title", e.target.value)}
                    placeholder="Full-Stack Developer · Nairobi"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Profile Photo URL</label>
                  <input
                    className={styles.input}
                    value={data.avatarUrl}
                    onChange={e => update("avatarUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>About Me</label>
                  <textarea
                    className={styles.textarea}
                    value={data.about}
                    onChange={e => update("about", e.target.value)}
                    placeholder="Tell the world who you are, what you do, and what drives you…"
                    rows={5}
                  />
                </div>
              </>
            )}

            {/* ── Skills tab ── */}
            {activeTab === "skills" && (
              <>
                <div className={styles.skillsWrap}>
                  {data.skills.length === 0 && (
                    <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>No skills added yet</span>
                  )}
                  {data.skills.map(s => (
                    <div key={s} className={styles.skillChip}>
                      {s}
                      <button className={styles.skillChipRemove} onClick={() => removeSkill(s)}>×</button>
                    </div>
                  ))}
                </div>
                <div className={styles.skillInputRow}>
                  <input
                    className={styles.input}
                    style={{ flex: 1 }}
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="e.g. React, Figma, Python…"
                  />
                  <button className={styles.addChipBtn} onClick={addSkill}>Add</button>
                </div>
                <p style={{ fontSize: "0.77rem", color: "#9ca3af", marginTop: 10 }}>
                  Press Enter or click Add after each skill
                </p>
              </>
            )}

            {/* ── Projects tab ── */}
            {activeTab === "projects" && (
              <>
                {data.projects.map((p, i) => (
                  <div key={i} className={styles.projectCard}>
                    <div className={styles.projectCardInfo}>
                      <div className={styles.projectCardTitle}>{p.title}</div>
                      {p.description && (
                        <div className={styles.projectCardDesc}>{p.description}</div>
                      )}
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeProject(i)}>Remove</button>
                  </div>
                ))}

                {addingProject ? (
                  <div className={styles.addProjectBox}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Project Title *</label>
                      <input className={styles.input} value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} placeholder="My Awesome App" />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} style={{ minHeight: 72 }} value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="What does this project do?" />
                    </div>
                    <div className={styles.inputRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Live URL</label>
                        <input className={styles.input} value={newProject.liveUrl} onChange={e => setNewProject(p => ({ ...p, liveUrl: e.target.value }))} placeholder="https://..." />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>GitHub URL</label>
                        <input className={styles.input} value={newProject.githubUrl} onChange={e => setNewProject(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
                      </div>
                    </div>
                    <div className={styles.addProjectActions}>
                      <button className={styles.addProjSave} onClick={addProject}>Add Project</button>
                      <button className={styles.addProjCancel} onClick={() => setAddingProject(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className={styles.addBtn} onClick={() => setAddingProject(true)}>
                    + Add Project
                  </button>
                )}
              </>
            )}

            {/* ── Social tab ── */}
            {activeTab === "social" && (
              <>
                {SOCIAL_FIELDS.map(f => (
                  <div key={f.key} className={styles.fieldGroup}>
                    <label className={styles.label}>{f.label}</label>
                    <input
                      className={styles.input}
                      value={(data.socialLinks as any)[f.key] || ""}
                      onChange={e => update("socialLinks", { ...data.socialLinks, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
              </>
            )}

            {/* ── Publish tab ── */}
            {activeTab === "publish" && (
              <>
                {data.username && (
                  <div className={styles.publishBox}>
                    <div className={styles.publishBoxTitle}>Your portfolio URL</div>
                    <div className={styles.publishBoxUrl}>
                      /creators/{data.username}
                    </div>
                  </div>
                )}

                {data.isPublished ? (
                  <>
                    <div className={styles.publishStatusLive}>
                      <div className={styles.liveDot} />
                      Your portfolio is live and public
                    </div>
                    {data.username && (
                      <a
                        href={`/creators/${data.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.viewLiveBtn}
                      >
                        View Live Portfolio ↗
                      </a>
                    )}
                  </>
                ) : (
                  <p className={styles.publishStatus}>
                    Your portfolio is in <strong>draft</strong> mode. Only you can see it. Hit Publish to make it live for anyone with your link.
                  </p>
                )}

                <button
                  className={data.isPublished ? styles.unpublishBtn : styles.publishBtn}
                  onClick={togglePublish}
                  disabled={publishing}
                  style={{ width: "100%", padding: "13px" }}
                >
                  {publishing ? "…" : data.isPublished ? "Unpublish Portfolio" : "Publish Portfolio →"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div className={styles.preview}>
          <div className={styles.previewTopBar}>
            <div className={styles.previewDots}>
              <div className={styles.previewDot} style={{ background: "#ff5f57" }} />
              <div className={styles.previewDot} style={{ background: "#febc2e" }} />
              <div className={styles.previewDot} style={{ background: "#28c840" }} />
            </div>
            <div className={styles.previewAddressBar}>
              {data.username ? `lumyn.dev/creators/${data.username}` : "your-portfolio-url"}
            </div>
          </div>

          <div className={styles.previewFrame}>
            {!data.displayName ? (
              <div className={styles.previewEmpty}>
                <div className={styles.previewEmptyIcon}>✏️</div>
                <div className={styles.previewEmptyText}>
                  Start filling in your info to see a live preview
                </div>
              </div>
            ) : (
              <div className={styles.portfolioPreview}>
                <div className={styles.portfolioHero}>
                  {data.avatarUrl ? (
                    <img src={data.avatarUrl} alt="" className={styles.portfolioAvatar} />
                  ) : (
                    <div className={styles.portfolioAvatarPlaceholder}>
                      {data.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={styles.portfolioName}>{data.displayName}</div>
                  {data.title && <div className={styles.portfolioTitle}>{data.title}</div>}
                  {data.username && (
                    <div className={styles.portfolioUsername}>@{data.username}</div>
                  )}
                </div>

                <div className={styles.portfolioBody}>
                  {data.about && (
                    <div className={styles.portfolioSection}>
                      <div className={styles.portfolioSectionTitle}>About</div>
                      <div className={styles.portfolioBio}>{data.about}</div>
                    </div>
                  )}

                  {data.skills.length > 0 && (
                    <div className={styles.portfolioSection}>
                      <div className={styles.portfolioSectionTitle}>Skills</div>
                      <div className={styles.portfolioSkills}>
                        {data.skills.map(s => (
                          <span key={s} className={styles.portfolioSkill}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.projects.length > 0 && (
                    <div className={styles.portfolioSection}>
                      <div className={styles.portfolioSectionTitle}>Projects</div>
                      <div className={styles.portfolioProjects}>
                        {data.projects.map((p, i) => (
                          <div key={i} className={styles.portfolioProject}>
                            <div className={styles.portfolioProjectTitle}>{p.title}</div>
                            {p.description && (
                              <div className={styles.portfolioProjectDesc}>{p.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.values(data.socialLinks).some(Boolean) && (
                    <div className={styles.portfolioSection}>
                      <div className={styles.portfolioSectionTitle}>Links</div>
                      <div className={styles.portfolioSocials}>
                        {SOCIAL_FIELDS.map(f => {
                          const val = (data.socialLinks as any)[f.key]
                          return val ? (
                            <a key={f.key} href={val} className={styles.portfolioSocialLink} target="_blank" rel="noreferrer">
                              {f.label}
                            </a>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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
