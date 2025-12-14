"use client"



import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ToastProvider, useToast } from "@/components/toast"
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
  jobType: string // 'formal' or 'informal'
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


  const filteredCareers = filter === "all"
    ? careers
    : careers.filter(career => career.type === filter)






  const handleApplyNow = (career: Career) => {
    if (career.jobType === 'formal') {
      router.push(`/careers/apply/${career.id}`)
    } else {
      // For informal jobs, show contact options
      showToast({
        type: 'info',
        title: 'Informal Job Application',
        message: 'This job requires direct contact. Please use WhatsApp or call the provided number.'
      })
    }
  }

  const handleReadMore = (career: Career) => {
    setSelectedCareer(career)
  }

  const closeModal = () => {
    setSelectedCareer(null)
  }

  const handleWhatsApp = (career: Career) => {
    const whatsappNumber = career.whatsappNumber || '0792687584'
    const message = `Hello, I'm interested in the ${career.title} position at ${career.company}.`
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
    
    showToast({
      type: 'success',
      title: 'Opening WhatsApp',
      message: 'Redirecting you to WhatsApp to contact about this job.'
    })
  }

  const handlePhoneCall = (career: Career) => {
    const phoneNumber = career.phoneNumber || '0794773452'
    window.location.href = `tel:${phoneNumber}`
    
    showToast({
      type: 'info',
      title: 'Initiating Call',
      message: `Calling ${phoneNumber} for the ${career.title} position.`
    })
  }


  const handleShare = async (career: Career) => {
    const shareData = {
      title: `${career.title} at ${career.company}`,
      text: `Check out this job opportunity: ${career.title} at ${career.company}`,
      url: `${window.location.origin}/careers/apply/${career.id}`
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        showToast({
          type: 'success',
          title: 'Shared Successfully',
          message: 'Job opportunity shared successfully!'
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = shareData.url
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url)
          showToast({
            type: 'success',
            title: 'Link Copied',
            message: 'Job link copied to clipboard!'
          })
        } else {
          // Final fallback
          const textArea = document.createElement('textarea')
          textArea.value = url
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          showToast({
            type: 'success',
            title: 'Link Copied',
            message: 'Job link copied to clipboard!'
          })
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // If sharing fails, just copy the URL
      try {
        await navigator.clipboard.writeText(shareData.url)
        showToast({
          type: 'success',
          title: 'Link Copied',
          message: 'Job link copied to clipboard!'
        })
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError)
        showToast({
          type: 'error',
          title: 'Share Failed',
          message: 'Unable to share or copy the link. Please try again.'
        })
      }
    }
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
      </Head>

      <div className={styles.careersPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={`${styles.container} ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>Join Our Team</h1>
            <p className={styles.heroSubtitle}>
              Shape the future of digital solutions with us
            </p>
            <p className={styles.heroDescription}>
              We're always looking for talented individuals who are passionate about creating innovative digital experiences.
            </p>
          </div>
        </section>




        {/* All Careers Section */}
        <section className={styles.careersSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>All Opportunities</h2>
              <div className={styles.filterButtons}>
                {careerTypes.map((type) => (
                  <button
                    key={type}
                    className={`${styles.filterBtn} ${filter === type ? styles.filterBtnActive : ""}`}
                    onClick={() => setFilter(type)}
                  >
                    {type === "all" ? "All" : type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <p>Loading career opportunities...</p>
              </div>
            ) : filteredCareers.length > 0 ? (
              <div className={styles.careersGrid}>

                {filteredCareers.map((career) => (
                  <div key={career.id} className={styles.careerCard}>
                    {career.image && (
                      <div className={styles.careerImage}>
                        <Image
                          src={career.image}
                          alt={`${career.title} at ${career.company}`}
                          fill
                          className={styles.careerImage}
                        />
                      </div>
                    )}
                    <div className={styles.careerHeader}>
                      <h3 className={styles.careerTitle}>{career.title}</h3>
                      <p className={styles.careerCompany}>{career.company}</p>
                    </div>
                    <p className={styles.careerDescription}>
                      {career.description.length > 120
                        ? `${career.description.substring(0, 120)}...`
                        : career.description}
                    </p>
                    <div className={styles.careerMeta}>
                      <span className={styles.careerLocation}>📍 {career.location}</span>
                      <span className={styles.careerType}>{career.type.replace("-", " ")}</span>
                      {career.salary && (
                        <span className={styles.careerSalary}>💰 {career.salary}</span>
                      )}
                    </div>




                    <div className={styles.careerActions}>
                      {career.jobType === 'formal' ? (
                        <>
                          <button
                            className={styles.applyBtn}
                            onClick={() => handleApplyNow(career)}
                          >
                            Apply Now →
                          </button>
                          <button
                            className={styles.readMoreBtn}
                            onClick={() => handleReadMore(career)}
                          >
                            Read More →
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={styles.whatsAppBtn}
                            onClick={() => handleWhatsApp(career)}
                          >
                            WhatsApp 📱
                          </button>
                          <button
                            className={styles.callBtn}
                            onClick={() => handlePhoneCall(career)}
                          >
                            Call 📞
                          </button>
                          <button
                            className={styles.readMoreBtn}
                            onClick={() => handleReadMore(career)}
                          >
                            Details 📋
                          </button>
                        </>
                      )}
                      <button
                        className={styles.shareBtn}
                        onClick={() => handleShare(career)}
                        title="Share this job"
                      >
                        Share 🔗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noCareers}>
                <p>No career opportunities found in this category.</p>
                <button className={styles.resetFilter} onClick={() => setFilter("all")}>
                  Show All Opportunities
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaOverlay}></div>
          <div className={`${styles.container} ${styles.ctaContainer}`}>
            <h2 className={styles.ctaTitle}>Don't See the Right Fit?</h2>
            <p className={styles.ctaText}>
              We're always interested in meeting talented individuals. Send us your resume and let's talk.
            </p>
            <a href="/contact" className={styles.ctaButton}>
              Get In Touch
            </a>
          </div>

        </section>

        {/* Job Details Modal */}
        {selectedCareer && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedCareer.title}</h2>
                <button className={styles.modalClose} onClick={closeModal}>
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                {selectedCareer.image && (
                  <div className={styles.modalImage}>
                    <Image
                      src={selectedCareer.image}
                      alt={`${selectedCareer.title} at ${selectedCareer.company}`}
                      fill
                      className={styles.modalImage}
                    />
                  </div>
                )}
                <div className={styles.modalDetails}>
                  <div className={styles.modalMeta}>
                    <span className={styles.modalCategory}>{selectedCareer.company}</span>
                    <span className={styles.modalCategory}>{selectedCareer.type.replace("-", " ")}</span>
                    {selectedCareer.featured && <span className={styles.featuredBadge}>Featured</span>}
                  </div>
                  
                  <div className={styles.modalDescription}>
                    <p><strong>📍 Location:</strong> {selectedCareer.location}</p>
                    {selectedCareer.salary && (
                      <p><strong>💰 Salary:</strong> {selectedCareer.salary}</p>
                    )}
                    {selectedCareer.applicationDeadline && (
                      <p><strong>📅 Application Deadline:</strong> {selectedCareer.applicationDeadline}</p>
                    )}
                  </div>

                  <div className={styles.modalSection}>
                    <h4>Job Description</h4>
                    <div className={styles.modalRequirements}>
                      {selectedCareer.description}
                    </div>
                  </div>

                  {selectedCareer.requirements && (
                    <div className={styles.modalSection}>
                      <h4>Requirements</h4>
                      <div className={styles.modalRequirements}>
                        {selectedCareer.requirements}
                      </div>
                    </div>
                  )}

                  <div className={styles.modalActions}>
                    {selectedCareer.jobType === 'formal' ? (
                      <button
                        className={styles.featuredApplyBtn}
                        onClick={() => {
                          closeModal()
                          handleApplyNow(selectedCareer)
                        }}
                      >
                        Apply Now →
                      </button>
                    ) : (
                      <div className={styles.informalActions}>
                        <button
                          className={styles.whatsappBtn}
                          onClick={() => {
                            closeModal()
                            handleWhatsApp(selectedCareer)
                          }}
                        >
                          WhatsApp 📱
                        </button>
                        <button
                          className={styles.phoneBtn}
                          onClick={() => {
                            closeModal()
                            handlePhoneCall(selectedCareer)
                          }}
                        >
                          Call 📞
                        </button>
                        {selectedCareer.contactEmail && (
                          <button
                            className={styles.emailBtn}
                            onClick={() => {
                              window.location.href = `mailto:${selectedCareer.contactEmail}?subject=Application for ${selectedCareer.title} position`
                            }}
                          >
                            Email ✉️
                          </button>
                        )}
                      </div>
                    )}
                    
                    <button
                      className={styles.featuredShareBtn}
                      onClick={() => handleShare(selectedCareer)}
                      title="Share this job"
                    >
                      Share 🔗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

// Wrap the content with ToastProvider for toast notifications
export default function CareersPage() {
  return (
    <ToastProvider>
      <CareersPageContent />
    </ToastProvider>
  )
}
