"use client"

import Link from "next/link"
import { useState } from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import styles from "./header.module.css"
import SearchComponent from "./search"



export default function Header() {

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



        <nav className={styles.nav}>
          {isAdmin && (
            <Link href="/admin" className={styles.navLinkAdmin}>
              Admin
            </Link>
          )}
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
    </header>
  )
}
