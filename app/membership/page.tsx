"use client"

import type React from "react"

import { useState } from "react"
import Head from "next/head"
import styles from "./membership.module.css"

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    year: "",
    major: "",
    interests: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          year: "",
          major: "",
          interests: "",
        })
      } else {
        setStatus("error")
        setErrorMessage("Failed to submit membership. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
    }
  }

  return (
    <>
      <Head>
        <title>Join KESA | Kenyan Student Association - University of Minnesota</title>
        <meta
          name="description"
          content="Join the Kenyan Student Association at the University of Minnesota. Connect with fellow students and access exclusive events and opportunities."
        />
        <meta name="keywords" content="KESA, Kenyan Student Association, membership, join, University of Minnesota, student organization" />
        <meta property="og:title" content="Join KESA | Kenyan Student Association - University of Minnesota" />
        <meta
          property="og:description"
          content="Join the Kenyan Student Association at the University of Minnesota. Connect with fellow students and access exclusive events and opportunities."
        />
        <meta property="og:url" content="https://kesa-umn.vercel.app/membership" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join KESA | Kenyan Student Association - University of Minnesota" />
        <meta
          name="twitter:description"
          content="Join the Kenyan Student Association at the University of Minnesota. Connect with fellow students and access exclusive events and opportunities."
        />
        <link rel="canonical" href="https://kesa-umn.vercel.app/membership" />
      </Head>
      <div className={styles.membershipPage}>
        <section className={styles.hero}>
          <div className={styles.heroPattern}></div>
          <div className={styles.heroContent}>
            <div className={styles.badge}>FREE MEMBERSHIP</div>
            <h1 className={styles.heroTitle}>Join KESA Today</h1>
            <p className={styles.heroSubtitle}>
              Connect with fellow Kenyan students and become part of a thriving community at the University of Minnesota
            </p>
          </div>
        </section>

      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <div className={styles.benefitsIntro}>
            <h2 className={styles.sectionTitle}>Why Join KESA?</h2>
            <p className={styles.sectionSubtitle}>
              Membership is completely free and opens doors to incredible opportunities
            </p>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>01</div>
              <h3 className={styles.benefitTitle}>Exclusive Events</h3>
              <p className={styles.benefitText}>
                Access to cultural celebrations, networking events, and social gatherings throughout the year.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>02</div>
              <h3 className={styles.benefitTitle}>Community Network</h3>
              <p className={styles.benefitText}>
                Connect with fellow Kenyan students and build lasting friendships and professional relationships.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>03</div>
              <h3 className={styles.benefitTitle}>Academic Support</h3>
              <p className={styles.benefitText}>
                Access mentorship programs, study groups, and resources to help you succeed academically.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>04</div>
              <h3 className={styles.benefitTitle}>Leadership Opportunities</h3>
              <p className={styles.benefitText}>
                Develop leadership skills by participating in committees and organizing community events.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Start Your Journey</h2>
            <p className={styles.formSubtitle}>Complete the form below to join our community</p>
          </div>

          {status === "success" && (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h3>Welcome to KESA!</h3>
              <p>Your membership application has been received. Check your email for confirmation and next steps.</p>
            </div>
          )}

          {status === "error" && (
            <div className={styles.errorMessage}>
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Personal Information Card */}
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>👤</div>
                <h3 className={styles.cardTitle}>Personal Information</h3>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Joshua"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Mwendwa"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📧</div>
                <h3 className={styles.cardTitle}>Contact Information</h3>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="officialjoshuamwendwa2gmail.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="(+254) 794 773 452"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🎓</div>
                <h3 className={styles.cardTitle}>Academic Information</h3>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="year" className={styles.label}>
                    Academic Year *
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select your year</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="graduate">Graduate Student</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="major" className={styles.label}>
                    Major/Field of Study *
                  </label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Computer Science"
                  />
                </div>
              </div>
            </div>

            {/* Interests Card */}
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>✨</div>
                <h3 className={styles.cardTitle}>Get Involved</h3>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="interests" className={styles.label}>
                  Interests & How You'd Like to Get Involved
                </label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Tell us about your interests and how you'd like to contribute to KESA..."
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <span className={styles.spinner}></span>
                  Submitting...
                </>
              ) : (
                "Join KESA Now →"
              )}
            </button>

            <p className={styles.disclaimer}>
              By submitting this form, you agree to receive communications from KESA about events, news, and
              opportunities.
            </p>
          </form>
        </div>
      </section>
    </div>
    </>
  )
}
