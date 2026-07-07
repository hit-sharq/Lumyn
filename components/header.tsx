"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import styles from "./header.module.css"
import SearchComponent from "./search"
import { motion } from "framer-motion"
import NotificationBell from "./NotificationBell"


export default function Header() {
  const pathname = usePathname()
  const { user, isSignedIn } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!isSignedIn) {
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
  }, [isSignedIn])
  const isAdminRoute = pathname?.startsWith("/admin")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Close if the click is outside the header area (i.e., any "system" click)
      if (target.closest(`.${styles.container}`) === null) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleDocumentClick)
    return () => document.removeEventListener("mousedown", handleDocumentClick)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (isAdminRoute && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [isAdminRoute, isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }



  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Lumyn</span>
          <span className={styles.logoSubtext}>lym</span>
        </Link>

        {/* Mobile Menu Toggle */}
        {!isAdminRoute && (
          <div
            className={styles.menuToggle}
            onClick={toggleMobileMenu}
            role="button"
            tabIndex={0}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleMobileMenu()
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}


        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ""}`}>
          {isAdmin && (
            <Link
              href="/admin"
              className={styles.navLinkAdmin}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}

          <Link
            href="/services"
            className={styles.navLink}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </Link>

          <Link
            href="/projects"
            className={styles.navLink}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className={styles.navLink}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>

          <div className={styles.authButtons}>
            {isSignedIn ? (
              <>
                <NotificationBell />
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className={styles.signInBtn}>Sign In</button>
              </SignInButton>
            )}
          </div>
          <div style={{ marginLeft: '16px' }}>
            <SearchComponent />
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
