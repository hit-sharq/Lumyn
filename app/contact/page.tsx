"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./contact.module.css";

// Enhanced contact form with phone number and areas of interest for well-detailed submissions

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    interests: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          interests: "",
          message: ""
        });
      } else {
        setStatus("error");
        setErrorMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("An error occurred. Please try again later.");
    }
  };
return (
    <div className={styles.contactPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Get In Touch
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            We&apos;d love to hear from you. Send us a message!
          </motion.p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <motion.div
              className={styles.contactInfo}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.h2
                className={styles.infoTitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Contact Information
              </motion.h2>
              <p className={styles.infoText}>
                Have questions about our services? Want to discuss a project? Reach out to us and we&apos;ll get back to you as soon as
                possible.
              </p>

              <div className={styles.infoCards}>
                {[
                  { icon: "📧", title: "General Inquiries", link: "mailto:info@lumyn.co.ke", text: "info@lumyn.co.ke" },
                  { icon: "🛟", title: "Technical Support", link: "mailto:support@lumyn.co.ke", text: "support@lumyn.co.ke" },
                  { icon: "📍", title: "Location", text: "Remote &amp; On-site Services" },
                  { icon: "🕐", title: "Response Time", text: "Within 24 hours" },
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    className={styles.infoCard}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.infoIcon}>{card.icon}</div>
                    <h3 className={styles.infoCardTitle}>{card.title}</h3>
                    {card.link ? (
                      <a href={card.link} className={styles.infoCardLink}>{card.text}</a>
                    ) : (
                      <p className={styles.infoCardText}>{card.text}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Follow Us</h3>
                <div className={styles.socialLinks}>
                  <a href="https://www.instagram.com/lumyn_technologies" className={styles.socialLink}>
                    Instagram
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.contactForm}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className={styles.formTitle}>Send Us a Message</h2>

              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    className={styles.successMessage}
                    initial={{ opacity: 0, y: -16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>Thank you for your message! We&apos;ll get back to you soon.</p>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    className={styles.errorMessage}
                    initial={{ opacity: 0, y: -16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

<form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Full Name *
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={styles.input} placeholder="Joshua Mwendwa" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address *
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={styles.input} placeholder="joshua@example.com" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone Number
                  </label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} placeholder="+254 712 345 678" />
                  {/* Added phone field for more detailed contact information */}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    Subject *
                  </label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={styles.select}>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="project">Project Discussion</option>
                    <option value="services">Service Information</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="interests" className={styles.label}>
                    Areas of Interest
                  </label>
                  <select id="interests" name="interests" value={formData.interests} onChange={handleChange} className={styles.select}>
                    <option value="">Select areas of interest (optional)</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-apps">Mobile Applications</option>
                    <option value="e-commerce">E-commerce Solutions</option>
                    <option value="digital-strategy">Digital Strategy</option>
                    <option value="branding">Branding &amp; Design</option>
                    <option value="consulting">Technical Consulting</option>
                    <option value="maintenance">Ongoing Maintenance</option>
                    <option value="other">Other Services</option>
                  </select>
                  {/* Added interests field for more detailed contact information */}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Message *
                  </label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required className={styles.textarea} rows={6} placeholder="Tell us what's on your mind..." />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}