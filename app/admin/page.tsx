"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import styles from "./admin.module.css"
import NewsManager from "./components/news-manager"
import BlogManager from "./components/blog-manager"
import EventsManager from "./components/events-manager"
import GalleryManager from "./components/gallery-manager"
import MembersManager from "./components/members-manager"
import ContactsManager from "./components/contacts-manager"
import LeadershipManager from "./components/leadership-manager"
import ProjectsManager from "./components/projects-manager"
import CareersManager from "./components/careers-manager"
import PartnersManager from "./components/partners-manager"
import StudioManager from "./components/studio-manager"
import MarketManager from "./components/market-manager"

type Tab = "news" | "blog" | "events" | "gallery" | "members" | "contacts" | "leadership" | "projects" | "careers" | "partners" | "studio" | "market"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("news")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isSignedIn, isLoaded } = useUser()

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  const isAdmin = isSignedIn && user && adminIds.includes(user.id)

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  if (!isLoaded) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>Access Denied</h1>
          <p className={styles.loginSubtitle}>You do not have permission to access the admin panel.</p>
          <p className={styles.loginHint}>Please sign in with an admin account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminPage}>
      <button
        className={styles.hamburgerBtn}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span className={styles.hamburgerIcon}>{mobileMenuOpen ? "✕" : "☰"}</span>
      </button>

      {mobileMenuOpen && (
        <div
          className={`${styles.overlay} ${styles.overlayActive}`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Lumyn Admin</h2>
          <p className={styles.adminName}>{user.fullName || user.emailAddresses[0].emailAddress}</p>
          <button
            className={styles.logoutBtn}
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" })
              window.location.href = "/"
            }}
          >
            Sign Out
          </button>
        </div>
        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${activeTab === "news" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("news")}
          >
            News
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "blog" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("blog")}
          >
            Blog
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "events" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("events")}
          >
            Events
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "gallery" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("gallery")}
          >
            Gallery
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "members" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("members")}
          >
            Members
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "projects" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("projects")}
          >
            Projects
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "leadership" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("leadership")}
          >
            Leadership
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "contacts" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("contacts")}
          >
            Contact Messages
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "careers" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("careers")}
          >
            Careers
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "partners" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("partners")}
          >
            Partners
          </button>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>MODULES</h3>
          </div>
          <button
            className={`${styles.navBtn} ${activeTab === "studio" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("studio")}
          >
            Lumyn Studio
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "market" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("market")}
          >
            Lumyn Market
          </button>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>GROWTH</h3>
          </div>
          <Link href="/admin/ai-marketing" className={styles.navBtn}>
            AI Marketing Suite
          </Link>
          <Link href="/admin/proposals" className={styles.navBtn}>
            Enterprise Proposals
          </Link>
          <Link href="/admin/analytics" className={styles.navBtn}>
            Analytics
          </Link>
          <Link href="/admin/marketing" className={styles.navBtn}>
            Marketing Blasts
          </Link>
          <Link href="/admin/partners" className={styles.navBtn}>
            Partners
          </Link>
          <Link href="/admin/service-requests" className={styles.navBtn}>
            Service Requests
          </Link>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>GDPR</h3>
            <button
              className={styles.navBtn}
              onClick={async () => {
                try {
                  const response = await fetch("/api/gdpr/export")
                  const data = await response.json()
                  if (response.ok) {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "gdpr-export.json"
                    a.click()
                    URL.revokeObjectURL(url)
                  } else {
                    alert("Export failed: " + data.error)
                  }
                } catch (error) {
                  alert("Export failed")
                }
              }}
            >
              Export Data
            </button>
            <button
              className={styles.navBtn}
              onClick={async () => {
                if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
                  try {
                    const response = await fetch("/api/gdpr/delete", { method: "DELETE" })
                    const data = await response.json()
                    if (response.ok) {
                      alert("Data deleted successfully")
                    } else {
                      alert("Delete failed: " + data.error)
                    }
                  } catch (error) {
                    alert("Delete failed")
                  }
                }
              }}
            >
              Delete Data
            </button>
          </div>
        </nav>
      </div>

      <div className={styles.content}>
         {activeTab === "news" && <NewsManager />}
         {activeTab === "blog" && <BlogManager />}
         {activeTab === "events" && <EventsManager />}
         {activeTab === "gallery" && <GalleryManager />}
         {activeTab === "members" && <MembersManager />}
         {activeTab === "projects" && <ProjectsManager />}
         {activeTab === "leadership" && <LeadershipManager />}
         {activeTab === "contacts" && <ContactsManager />}
         {activeTab === "careers" && <CareersManager />}
         {activeTab === "partners" && <PartnersManager />}
         {activeTab === "studio" && <StudioManager />}
         {activeTab === "market" && <MarketManager />}
      </div>
    </div>
  )
}
