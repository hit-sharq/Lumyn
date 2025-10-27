"use client"

import type React from "react"

import { useState } from "react"
import Head from "next/head"
import styles from "./contact.module.css"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setStatus("error")
        setErrorMessage("Failed to send message. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
    }
  }

  return (
    <>
      <Head>
        <title>Contact KESA | Kenyan Student Association - University of Minnesota</title>
        <meta
          name="description"
          content="Get in touch with the Kenyan Student Association at the University of Minnesota. Have questions about KESA? Want to get involved? Reach out to us."
        />
        <meta name="keywords" content="KESA, Kenyan Student Association, contact, University of Minnesota, get in touch, membership, events" />
        <meta property="og:title" content="Contact KESA | Kenyan Student Association - University of Minnesota" />
        <meta
          property="og:description"
          content="Get in touch with the Kenyan Student Association at the University of Minnesota. Have questions about KESA? Want to get involved? Reach out to us."
        />
        <meta property="og:url" content="https://kesa-umn.vercel.app/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact KESA | Kenyan Student Association - University of Minnesota" />
        <meta
          name="twitter:description"
          content="Get in touch with the Kenyan Student Association at the University of Minnesota. Have questions about KESA? Want to get involved? Reach out to us."
        />
        <link rel="canonical" href="https://kesa-umn.vercel.app/contact" />
      </Head>
      <div className={styles.contactPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Get In Touch</h1>
            <p className={styles.heroSubtitle}>We'd love to hear from you. Send us a message!</p>
          </div>
        </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2 className={styles.infoTitle}>Contact Information</h2>
              <p className={styles.infoText}>
                Have questions about KESA? Want to get involved? Reach out to us and we'll get back to you as soon as
                possible.
              </p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>📧</div>
                  <h3 className={styles.infoCardTitle}>Email</h3>
                  <p className={styles.infoCardText}>kesa@umn.edu</p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>📍</div>
                  <h3 className={styles.infoCardTitle}>Location</h3>
                  <p className={styles.infoCardText}>University of Minnesota, Twin Cities</p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>🕐</div>
                  <h3 className={styles.infoCardTitle}>Office Hours</h3>
                  <p className={styles.infoCardText}>Mon-Fri: 10am - 4pm</p>
                </div>
              </div>

              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Follow Us</h3>
                <div className={styles.socialLinks}>
                  <a href="https://www.instagram.com/kesa.umn?igsh=MW0yYWJsdTY1b3N6eQ==" className={styles.socialLink}>
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <h2 className={styles.formTitle}>Send Us a Message</h2>

              {status === "success" && (
                <div className={styles.successMessage}>
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              )}

              {status === "error" && (
                <div className={styles.errorMessage}>
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Joshua Mwendwa"
                  />
                </div>

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
                    placeholder="joshua@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="membership">Membership Question</option>
                    <option value="events">Event Information</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
