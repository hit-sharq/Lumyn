"use client"

import Link from "next/link"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import styles from "./launch.module.css"

const TEMPLATES = [
  { id: "minimal-dev", name: "Minimal Dev", category: "Developer", color: "#1a3a5c", emoji: "💻" },
  { id: "creative-designer", name: "Creative Designer", category: "Designer", color: "#6b2f7a", emoji: "🎨" },
  { id: "freelancer-pro", name: "Freelancer Pro", category: "Freelancer", color: "#2d6a2d", emoji: "🚀" },
  { id: "photo-portfolio", name: "Photo Portfolio", category: "Photographer", color: "#7a4f2d", emoji: "📷" },
  { id: "student-starter", name: "Student Starter", category: "Student", color: "#2d5a7a", emoji: "🎓" },
  { id: "agency-bold", name: "Agency Bold", category: "Agency", color: "#7a2d2d", emoji: "🏢" },
]

const STEPS = [
  { n: 1, title: "Choose a Template", desc: "Pick from professionally designed portfolio layouts." },
  { n: 2, title: "Customize Your Content", desc: "Add your bio, skills, projects and contact links." },
  { n: 3, title: "Preview & Publish", desc: "Review how it looks then make it live instantly." },
  { n: 4, title: "Share Your Portfolio", desc: "Get a shareable link at lumyn.dev/portfolio/yourname." },
]

export default function LaunchPage() {
  const { isSignedIn } = useUser()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Lumyn Launch</p>
        <h1 className={styles.heroTitle}>
          Build Your Portfolio <span>Website</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Create a stunning personal portfolio in minutes. Choose a template, add your work, and publish your portfolio instantly.
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
      </section>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>From zero to published in 4 simple steps</p>
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

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Choose Your Template</h2>
          <p className={styles.sectionSubtitle}>Professional designs for every career</p>
          <div className={styles.templateGrid}>
            {TEMPLATES.map((t) => (
              <div key={t.id} className={styles.templateCard}>
                <div className={styles.templateImageWrapper} style={{ background: t.color }}>
                  <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "4rem", opacity: 0.6
                  }}>
                    {t.emoji}
                  </div>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                    padding: "20px 16px 12px",
                    color: "#fff"
                  }}>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.8 }}>
                      {t.category}
                    </div>
                    <div style={{ fontWeight: 700 }}>{t.name}</div>
                  </div>
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
                      Use This Template
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <button className={styles.templateSelectBtn}>Use This Template</button>
                    </SignInButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
