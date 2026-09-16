"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import styles from "./header.module.css"
import SearchComponent from "./search"
import { motion } from "framer-motion"
import NotificationBell from "./NotificationBell"
import { Menu, X } from "lucide-react"


export default function Header() {
  const pathname = usePathname()
  const { user, isSignedIn } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const isAdminRoute = pathname?.startsWith("/admin")

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.brand} aria-label="Lumyn Technologies home">
          <span className={styles.brandMark} aria-hidden="true">L</span>
          <span className={styles.brandText}>Lumyn</span>
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
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                toggleMobileMenu()
              }
            }}
          >
            {isMobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </div>
        )}

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ""}`}>
          {isAdmin && (
            <Link
              href="/admin"
              className={styles.navLinkAdmin}
              onClick={closeMobileMenu}
            >
              Admin
            </Link>
          )}

          <Link
            href="/services"
            className={styles.navLink}
            onClick={closeMobileMenu}
          >
            Services
          </Link>

          <Link
            href="/projects"
            className={styles.navLink}
            onClick={closeMobileMenu}
          >
            Work
          </Link>
          <Link
            href="/about"
            className={styles.navLink}
            onClick={closeMobileMenu}
          >
            About
          </Link>
          <Link
            href="/blog"
            className={styles.navLink}
            onClick={closeMobileMenu}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className={styles.navLink}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>

          <div className={styles.authButtons}>
            {isSignedIn ? (
              <>
                <NotificationBell />
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      boxShadow: '0 0 0 2px var(--signal)',
                    }
                  }
                }} />
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