"use client"


import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ToastProvider, useToast } from "@/components/toast"
import ShareButton from "@/components/ShareButton"
import styles from "./careers.module.css"

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
  applicationLink?: string
  contactEmail?: string
  featured: boolean
  image?: string
  jobType: string
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
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const response = await fetch("/api/careers")
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
    if (career.jobType === "formal") {
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
        <title>Careers | Lumyn - Join Our Team</title>
        <meta
          name="description"
          content="Explore career opportunities at Lumyn. Join our team and work on innovative digital solutions."
        />
        <meta name="keywords" content="careers, jobs, employment, opportunities, digital solutions, technology" />
        <meta property="og:title" content="Careers | Lumyn - Join Our Team" />
        <meta
          property="og:description"
          content="Explore career opportunities at Lumyn. Join our team and work on innovative digital solutions."
        />
        <meta property="og:image" content="/placeholder.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Lumyn" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Careers | Lumyn - Join Our Team" />
        <meta name="twitter:description" content="Explore career opportunities at Lumyn. Join our team and work on innovative digital solutions." />
        <meta name="twitter:image" content="/placeholder.svg" />
      </Head>

      <div className={styles.careersPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Career Opportunities</h1>
            <p className={styles.heroSubtitle}>Join our team and shape the future of digital solutions</p>
          </div>
        </section>

        <section className={styles.careersSection}>
          <div className={styles.container}>
            <div className={styles.filterBar}>
              {careerTypes.map((type) => (
                <button
                  key={type}
                  className={`${styles.filterBtn} ${filter === type ? styles.filterBtnActive : ""}`}
                  onClick={() => setFilter(type)}
                >
                  {type === "all" ? "All Positions" : type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading career opportunities...</p>
              </div>
            ) : filteredCareers.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No career opportunities yet</h3>
                <p>Check back soon for new positions or contact us with your resume</p>
              </div>
            ) : (
              <div className={styles.careersGrid}>
                {filteredCareers.map((career) => (
                  <article key={career.id} className={styles.careerCard}>
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
                      <button className={styles.readMoreBtn} onClick={() => setSelectedCareer(career)}>
                        View Details →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {selectedCareer && (
              <div className={styles.modalOverlay} onClick={() => setSelectedCareer(null)}>
                <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.detailClose} onClick={() => setSelectedCareer(null)}>
                    ×
                  </button>
                  <div className={styles.detailImageWrapper}>
                    <Image
                      src={selectedCareer.image || "/placeholder.svg?height=300&width=500&query=career"}
                      alt={selectedCareer.title}
                      fill
                      className={styles.detailImage}
                    />
                  </div>
                  <div className={styles.detailBody}>
                    <h3 className={styles.detailTitle}>{selectedCareer.title}</h3>
                    <div className={styles.detailMeta}>
                      <span className={styles.detailBadge}>{selectedCareer.company}</span>
                      <span className={styles.detailBadge}>{selectedCareer.type.replace("-", " ")}</span>
                      {selectedCareer.featured && <span className={styles.featuredBadge}>Featured</span>}
                    </div>
                    <div className={styles.detailDescription}>
                      <p>{selectedCareer.description}</p>
                    </div>
                    <div className={styles.detailDetails}>
                      <div className={styles.detailDetail}>
                        <span className={styles.detailIcon}>📍</span>
                        <span>{selectedCareer.location}</span>
                      </div>
                      {selectedCareer.salary && (
                        <div className={styles.detailDetail}>
                          <span className={styles.detailIcon}>💰</span>
                          <span>{selectedCareer.salary}</span>
                        </div>
                      )}
                      {selectedCareer.applicationDeadline && (
                        <div className={styles.detailDetail}>
                          <span className={styles.detailIcon}>📅</span>
                          <span>Deadline: {selectedCareer.applicationDeadline}</span>
                        </div>
                      )}
                    </div>
                    {selectedCareer.requirements && (
                      <div className={styles.detailRequirements}>
                        <h4>Requirements</h4>
                        <p>{selectedCareer.requirements}</p>
                      </div>
                    )}
                    <div className={styles.detailActions}>
                      {selectedCareer.jobType === "formal" ? (
                        <button
                          className={styles.detailApplyBtn}
                          onClick={() => {
                            setSelectedCareer(null)
                            handleApplyNow(selectedCareer)
                          }}
                        >
                          Apply Now →
                        </button>
                      ) : (
                        <>
                          <button
                            className={styles.detailWhatsAppBtn}
                            onClick={() => {
                              setSelectedCareer(null)
                              handleWhatsApp(selectedCareer)
                            }}
                          >
                            WhatsApp 📱
                          </button>
                          <button
                            className={styles.detailCallBtn}
                            onClick={() => {
                              setSelectedCareer(null)
                              handlePhoneCall(selectedCareer)
                            }}
                          >
                            Call 📞
                          </button>
                        </>
                      )}

                      <ShareButton
                        title={`${selectedCareer.title} at ${selectedCareer.company}`}
                        text={`Check out this job opportunity: ${selectedCareer.title} at ${selectedCareer.company}`}
                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/careers/apply/${selectedCareer.id}`}
                        image={selectedCareer.image}
                        variant="default"
                        showLabels={true}
                      />
                    </div>
                  </div>
                </div>
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
