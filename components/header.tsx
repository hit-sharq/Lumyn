"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import styles from "./header.module.css"
import SearchComponent from "./search"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { user, isSignedIn } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  const isAdmin = isSignedIn && user && adminIds.includes(user.id)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
        <div className={styles.menuToggle} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ""}`}>
          {isAdmin && (
            <Link href="/admin" className={styles.navLinkAdmin} onClick={() => setIsMobileMenuOpen(false)}>
              Admin
            </Link>
          )}
          <Link href="/projects" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
            Projects
          </Link>
          <Link href="/blog" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>
          <div className={styles.authButtons}>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
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
