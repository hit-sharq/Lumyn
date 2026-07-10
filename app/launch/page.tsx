"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser, SignInButton } from "@clerk/nextjs"
import styles from "./launch.module.css"

const TEMPLATES = [
  { id: "minimal-dev", name: "Minimal Dev", category: "Developer", emoji: "💻" },
  { id: "creative-designer", name: "Creative Designer", category: "Designer", emoji: "🎨" },
  { id: "freelancer-pro", name: "Freelancer Pro", category: "Freelancer", emoji: "🚀" },
  { id: "photo-portfolio", name: "Photo Portfolio", category: "Photographer", emoji: "📷" },
  { id: "student-starter", name: "Student Starter", category: "Student", emoji: "🎓" },
  { id: "agency-bold", name: "Agency Bold", category: "Agency", emoji: "🏢" },
]

const SAMPLE_PORTFOLIO = {
  displayName: "Alex Morgan",
  title: "Full Stack Developer",
  about: "Passionate about building beautiful web experiences with modern technologies.",
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  projects: [
    { title: "E-Commerce Platform", description: "A full-stack marketplace built with Next.js", tags: ["React", "Node.js"] },
    { title: "Portfolio CMS", description: "Content management system for creatives", tags: ["Next.js", "Prisma"] }
  ],
  socialLinks: { github: "https://github.com", linkedin: "https://linkedin.com" },
  avatarUrl: "",
}

const STEPS = [
  { n: 1, title: "Choose a Template", desc: "Pick from professionally designed portfolio layouts for every career path." },
  { n: 2, title: "Customize Your Content", desc: "Add your bio, skills, projects, and social links in our simple editor." },
  { n: 3, title: "Preview & Publish", desc: "See exactly how your portfolio looks before making it live instantly." },
  { n: 4, title: "Share Your Portfolio", desc: "Get a shareable link at lumyn.dev/creators/yourname." },
]

const FEATURES = [
  { icon: "⚡", title: "Live in Minutes", desc: "No coding needed. Go from zero to published in under 10 minutes." },
  { icon: "🎨", title: "Beautiful Templates", desc: "Professionally designed layouts built for modern creatives." },
  { icon: "📱", title: "Mobile Optimized", desc: "Every portfolio looks perfect on phones, tablets, and desktops." },
  { icon: "🔗", title: "Custom URL", desc: "Share your work with a clean, memorable link you can put anywhere." },
]

export default function LaunchPage() {
  const { isSignedIn } = useUser()
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [loadingPreviews, setLoadingPreviews] = useState(true)

  useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const results: Record<string, string> = {}
        await Promise.all(
          TEMPLATES.map(async (t) => {
            try {
              const res = await fetch("/api/launch/templates/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateId: t.id, portfolio: SAMPLE_PORTFOLIO }),
              })
              if (res.ok) {
                const html = await res.text()
                results[t.id] = html
              }
            } catch {
              // leave empty — fallback UI will show
            }
          })
        )
        setPreviews(results)
      } finally {
        setLoadingPreviews(false)
      }
    }
    fetchPreviews()
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Lumyn Launch</span>
          <h1 className={styles.heroTitle}>
            Build Your <span>Portfolio</span> Website
          </h1>
          <p className={styles.heroSubtitle}>
            Create a stunning personal portfolio in minutes. Choose a template, add your work, and publish instantly — no code required.
          </p>
          <div className={styles.heroActions}>
            {isSignedIn ? (
              <Link href="/launch/builder" className={styles.heroBtnPrimary}>
                Start Building →
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className={styles.heroBtnPrimary}>Get Started Free →</button>
              </SignInButton>
            )}
            <Link href="/launch/dashboard" className={styles.heroBtnSecondary}>
              My Portfolios
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>6+</span>
              <span className={styles.heroStatLabel}>Templates</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>Free</span>
              <span className={styles.heroStatLabel}>To Start</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>10 min</span>
              <span className={styles.heroStatLabel}>To Launch</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.featuresStrip}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureTitle}>{f.title}</span>
                <span className={styles.featureDesc}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>How It Works</p>
            <h2 className={styles.sectionTitle}>From Zero to Published in 4 Steps</h2>
            <p className={styles.sectionSubtitle}>No design skills needed. Just your story.</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((s) => (
              <div key={s.n} className={styles.stepCard}>
                <div className={styles.stepNumber}>{s.n}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Templates</p>
            <h2 className={styles.sectionTitle}>Choose Your Template</h2>
            <p className={styles.sectionSubtitle}>Professional designs for every career path</p>
          </div>
          <div className={styles.templateGrid}>
            {TEMPLATES.map((t) => (
              <div key={t.id} className={styles.templateCard}>
                <div className={styles.templateImageWrapper}>
                  {loadingPreviews ? (
                    <div className={styles.templatePreviewSkeleton}>
                      <div className={styles.templatePreviewSkeletonBar}>
                        <div className={styles.templatePreviewSkeletonDot} />
                        <div className={styles.templatePreviewSkeletonDot} />
                        <div className={styles.templatePreviewSkeletonDot} />
                      </div>
                      <div className={styles.templatePreviewSkeletonContent}>
                        <div className={styles.templatePreviewSkeletonCircle} />
                        <div className={styles.templatePreviewSkeletonLine} />
                        <div className={styles.templatePreviewSkeletonLineShort} />
                      </div>
                    </div>
                  ) : previews[t.id] ? (
                    <iframe
                      srcDoc={previews[t.id]}
                      title={`${t.name} preview`}
                      sandbox="allow-scripts allow-same-origin"
                      className={styles.templatePreviewIframe}
                    />
                  ) : (
                    <div className={styles.templatePreviewFallback}>
                      <div className={styles.templatePreviewBar}>
                        <div className={styles.templatePreviewDot} />
                        <div className={styles.templatePreviewDot} />
                        <div className={styles.templatePreviewDot} />
                      </div>
                      <span className={styles.templateEmoji}>{t.emoji}</span>
                    </div>
                  )}
                </div>
                <div className={styles.templateCardBody}>
                  <p className={styles.templateCategory}>{t.category}</p>
                  <h3 className={styles.templateName}>{t.name}</h3>
                  {isSignedIn ? (
                    <Link
                      href={`/launch/builder?template=${t.id}`}
                      className={styles.templateSelectBtn}
                      style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                    >
                      Use This Template →
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <button className={styles.templateSelectBtn}>Use This Template →</button>
                    </SignInButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Your portfolio is waiting.</h2>
        <p className={styles.ctaSubtitle}>Join creators building their online presence with Lumyn Launch.</p>
        {isSignedIn ? (
          <Link href="/launch/builder" className={styles.ctaBtn}>
            Start Building Free →
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button className={styles.ctaBtn}>Start Building Free →</button>
          </SignInButton>
        )}
      </section>
    </div>
  )
}
