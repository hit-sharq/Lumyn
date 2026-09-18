"use client"


import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ToastProvider, useToast } from "@/components/toast"
import ShareButton from "@/components/ShareButton"
import styles from "./careers.module.css"
import LoadingState from "@/components/LoadingState"

interface Career {
  id: string
  title: string
  company: string
  description: string
  requirements?: string
  location: string
  type: string
  salary?: string
  applicationDeadline?: string
  applicationUrl?: string
  contactEmail?: string
  featured: boolean
  image?: string
  jobType?: string
  whatsappNumber?: string
  phoneNumber?: string
  createdAt: string
}

function CareersPageContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const response = await fetch("/api/careers", {
        cache: "no-store",
      })
      if (response.ok) {
        const data = await response.json()
        setCareers(data)
      }
    } catch (error) {
      console.error("Failed to fetch careers:", error)
    } finally {
      setLoading(false)
    }
  }

  const careerTypes = ["all", "full-time", "part-time", "internship", "contract"]

  const filteredCareers = filter === "all" ? careers : careers.filter((career) => career.type === filter)

  const handleApplyNow = (career: Career) => {
    if (career.applicationUrl) {
      window.open(career.applicationUrl, "_blank")
      showToast({
        type: "success",
        title: "Redirecting to Application",
        message: "Opening external application link...",
      })
    } else if (career.jobType === "formal" || !career.jobType) {
      router.push(`/careers/apply/${career.id}`)
    } else {
      showToast({
        type: "info",
        title: "Informal Job Application",
        message: "This job requires direct contact. Please use WhatsApp or call the provided number.",
      })
    }
  }

  const handleWhatsApp = (career: Career) => {
    const whatsappNumber = career.whatsappNumber || "0792687584"
    const message = `Hello, I'm interested in the ${career.title} position at ${career.company}.`
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, "_blank")

    showToast({
      type: "success",
      title: "Opening WhatsApp",
      message: "Redirecting you to WhatsApp to contact about this job.",
    })
  }

  const handlePhoneCall = (career: Career) => {
    const phoneNumber = career.phoneNumber || "0794773452"
    window.location.href = `tel:${phoneNumber}`

    showToast({
      type: "info",
      title: "Initiating Call",
      message: `Calling ${phoneNumber} for the ${career.title} position.`,
    })
  }

  return (
    <>
      <Head>
        <title>Careers | Lumyn Technologies - Build Your Career With Us</title>
        <meta
          name="description"
          content="Discover career opportunities at Lumyn Technologies. Join a team shaping the future of digital innovation across engineering, design, and growth."
        />
        <meta name="keywords" content="careers, jobs, employment, opportunities, digital solutions, technology" />
        <meta property="og:title" content="Careers | Lumyn Technologies - Build Your Career With Us" />
        <meta
          property="og:description"
          content="Explore career opportunities at Lumyn Technologies. Join our team and work on innovative digital solutions."
        />
        <meta property="og:image" content="/placeholder.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Lumyn Technologies" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Careers | Lumyn Technologies - Build Your Career With Us" />
        <meta name="twitter:description" content="Explore career opportunities at Lumyn Technologies. Join our team and work on innovative digital solutions." />
        <meta name="twitter:image" content="/placeholder.svg" />
      </Head>

      <div className={styles.careersPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Career Opportunities
            </motion.h1>
            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              Build your career and shape the future of digital innovation
            </motion.p>
          </div>
        </section>

        <section className={styles.careersSection}>
          <div className={styles.container}>
            <div className={styles.filterBar}>
              {careerTypes.map((type, index) => (
                <motion.button
                  key={type}
                  className={`${styles.filterBtn} ${filter === type ? styles.filterBtnActive : ""}`}
                  onClick={() => setFilter(type)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {type === "all" ? "All Positions" : type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </motion.button>
              ))}
            </div>

            {loading ? (
              <LoadingState variant="page" label="Loading careers" />
            ) : filteredCareers.length === 0 ? (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3>No career opportunities yet</h3>
                <p>Check back soon for new positions or contact us with your resume</p>
              </motion.div>
            ) : (
              <div className={styles.careersGrid}>
                {filteredCareers.map((career, index) => (
                  <motion.article
                    key={career.id}
                    className={styles.careerCard}
                    initial={{ opacity: 0, y: 44 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.careerImageWrapper}>
                      <Image
                        src={career.image || "/placeholder.svg?height=300&width=400&query=career"}
                        alt={career.title}
                        fill
                        className={styles.careerImage}
                      />
                      <span className={styles.careerCategory}>{career.type.replace("-", " ")}</span>
                    </div>
                    <div className={styles.careerContent}>
                      <div className={styles.careerMeta}>
                        <span className={styles.careerCompany}>{career.company}</span>
                        <span className={styles.careerLocation}>📍 {career.location}</span>
                      </div>
                      <h2 className={styles.careerTitle}>{career.title}</h2>
                      <p className={styles.careerExcerpt}>
                        {career.description.length > 120
                          ? `${career.description.substring(0, 120)}...`
                          : career.description}
                      </p>
                      <button
                        className={styles.readMoreBtn}
                        onClick={() => router.push(`/careers/${career.id}`)}
                      >
                        View Details →
                      </button>
                      <div className={styles.careerActions}>
                        {career.jobType === "formal" || !career.jobType ? (
                          <button
                            className={styles.callBtn}
                            onClick={() => handleApplyNow(career)}
                          >
                            Apply Now
                          </button>
                        ) : (
                          <>
                            <button
                              className={styles.whatsAppBtn}
                              onClick={() => handleWhatsApp(career)}
                            >
                              WhatsApp
                            </button>
                            <button
                              className={styles.callBtn}
                              onClick={() => handlePhoneCall(career)}
                            >
                              Call
                            </button>
                          </>
                        )}
                        <ShareButton
                          title={`${career.title} at ${career.company}`}
                          text={`Check out this job opportunity: ${career.title} at ${career.company}`}
                          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/careers/${career.id}`}
                          image={career.image}
                        />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default function CareersPage() {
  return (
    <ToastProvider>
      <CareersPageContent />
    </ToastProvider>
  )
}
