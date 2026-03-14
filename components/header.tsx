"use client"

import Link from "next/link"
import { useState } from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import styles from "./header.module.css"
import SearchComponent from "./search"

const NAV_LINKS = [
  { href: "/studio", label: "Studio", color: "#6d8196" },
  { href: "/launch", label: "Launch", color: "#2d6a9f" },
  { href: "/market", label: "Market", color: "#c0622a" },
  { href: "/hire", label: "Hire", color: "#1a5c3a" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isSignedIn } = useUser()

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  const isAdmin = isSignedIn && user && adminIds.includes(user.id)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Lumyn</span>
          <span className={styles.logoSubtext}>lym</span>
        </Link>

        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          <span className={isMenuOpen ? styles.menuIconOpen : styles.menuIcon}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <div className={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className={styles.navLinkAdmin} onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>
          <div className={styles.authButtons}>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className={styles.signInBtn} onClick={() => setIsMenuOpen(false)}>Sign In</button>
              </SignInButton>
            )}
          </div>
          <div style={{ marginLeft: '16px' }}>
            <SearchComponent />
          </div>
        </nav>
      </div>
    </header>
  )
}
