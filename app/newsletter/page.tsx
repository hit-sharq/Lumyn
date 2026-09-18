"use client";

import type React from "react";
import { useState } from "react";
import Head from "next/head";
import styles from "./newsletter.module.css";
import { motion } from "framer-motion";
export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });
      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing! You'll receive our latest updates.");
        setEmail("");
      } else {
        const data = await response.json();
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
    }
  };
  return <>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className={styles.title}>Stay Connected with Lumyn Technologies</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className={styles.subtitle}>
            Subscribe to our newsletter and never miss an update about upcoming events, news, and community activities.
          </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className={styles.benefits}>
          <h2 className={styles.benefitsTitle}>What You&apos;ll Get:</h2>
          <ul className={styles.benefitsList}>
            {["Weekly updates on upcoming tech events and activities", "Exclusive member-only content and opportunities", "Tech conference and workshop announcements", "Community news and achievements", "Networking and professional development opportunities"].map((item, index) => <motion.li key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}>{item}</motion.li>)}
          </ul>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className={styles.form} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className={styles.inputGroup}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" className={styles.input} required disabled={status === "loading"} />
            <motion.button type="submit" className={styles.button} disabled={status === "loading"} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </motion.button>
          </motion.div>

          {status === "success" && <p className={styles.successMessage}>{message}</p>}
          {status === "error" && <p className={styles.errorMessage}>{message}</p>}
        </motion.form>

        <p className={styles.privacy}>
          We respect your privacy. Your email will only be used for Lumyn Technologies updates. You can unsubscribe at any time.
        </p>
      </div>
    </div>
    </>;
}