"use client"

import { useState, useEffect } from "react"
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
import AnalyticsManager from "./components/analytics-manager"
import ProposalsManager from "./components/proposals-manager"
import MarketingManager from "./components/marketing-manager"
import ServiceRequestsManager from "./components/service-requests-manager"
import AIMarketingPageManager from "./components/ai-marketing-page-manager"

type Tab = "news" | "blog" | "events" | "gallery" | "members" | "contacts" | "leadership" | "projects" | "careers" | "partners" | "studio" | "market" | "analytics" | "proposals" | "marketing" | "service-requests" | "ai-marketing"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("news")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isSignedIn, isLoaded } = useUser()

  const [isAdmin, setIsAdmin] = useState(false)

  // Query server to determine admin status; server uses ADMIN_IDS env
  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsAdmin(false)
      return
    }

    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/is-admin')
        const data = await res.json()
        if (mounted) setIsAdmin(!!data.isAdmin)
      } catch (_) {
        if (mounted) setIsAdmin(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [isLoaded, isSignedIn])

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
          <p className={styles.adminName}>{user?.fullName || user?.emailAddresses?.[0]?.emailAddress || ''}</p>
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
          <button
            className={`${styles.navBtn} ${activeTab === "ai-marketing" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("ai-marketing")}
          >
            AI Marketing Suite
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "proposals" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("proposals")}
          >
            Enterprise Proposals
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "analytics" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("analytics")}
          >
            Analytics
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "marketing" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("marketing")}
          >
            Marketing Blasts
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "partners" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("partners")}
          >
            Partners
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === "service-requests" ? styles.navBtnActive : ""}`}
            onClick={() => handleTabChange("service-requests")}
          >
            Service Requests
          </button>
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
         {activeTab === "analytics" && <AnalyticsManager />}
         {activeTab === "proposals" && <ProposalsManager />}
         {activeTab === "marketing" && <MarketingManager />}
         {activeTab === "service-requests" && <ServiceRequestsManager />}
         {activeTab === "ai-marketing" && <AIMarketingPageManager />}
      </div>
    </div>
  )
}
