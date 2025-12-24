"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Head from "next/head"
import styles from "./get-started.module.css"
import type { JSX } from "react/jsx-runtime"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  requirements: string
  goals: string
  references: string
}

export default function GetStartedPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
    goals: "",
    references: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

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

    // Validate form data before submission
    const validationErrors = []
    
    if (formData.requirements.trim().length < 10) {
      validationErrors.push("Requirements must be at least 10 characters long")
    }
    
    if (formData.goals.trim().length < 10) {
      validationErrors.push("Project goals must be at least 10 characters long")
    }

    if (validationErrors.length > 0) {
      setStatus("error")
      setErrorMessage(validationErrors.join(". "))
      return
    }

    try {
      // Clean and prepare form data
      const cleanedFormData = {
        ...formData,
        requirements: formData.requirements.trim(),
        goals: formData.goals.trim(),
        references: formData.references.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.company.trim(),
      }

      console.log("Submitting project inquiry:", cleanedFormData)

      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedFormData),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          projectType: "",
          budget: "",
          timeline: "",
          requirements: "",
          goals: "",
          references: "",
        })
      } else {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        
        // Handle validation errors from API
        if (errorData.errors) {
          const fieldErrors = []
          if (errorData.errors.requirements) {
            fieldErrors.push("Requirements: " + errorData.errors.requirements._errors.join(", "))
          }
          if (errorData.errors.goals) {
            fieldErrors.push("Goals: " + errorData.errors.goals._errors.join(", "))
          }
          setErrorMessage(fieldErrors.join(". "))
        } else {
          setErrorMessage(errorData.error || "Failed to submit project inquiry. Please try again.")
        }
        setStatus("error")
      }
    } catch (error) {
      console.error("Network Error:", error)
      setStatus("error")
      setErrorMessage("An error occurred. Please check your connection and try again.")
    }
  }

  const sections = [
    {
      id: "intro",
      title: "Start Your Project Today",
      content: (
        <>
          <p className={styles.text}>
            Ready to transform your business with custom digital solutions? Our expert team at Lumyn specializes in creating 
            professional websites, web applications, and mobile apps that drive results. From concept to launch, we're here to 
            make your project a success.
          </p>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🚀</div>
              <h4 className={styles.benefitTitle}>Custom Development</h4>
              <p className={styles.benefitText}>Tailored solutions built specifically for your business needs.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⚡</div>
              <h4 className={styles.benefitTitle}>Fast Delivery</h4>
              <p className={styles.benefitText}>Efficient development with clear timelines and regular updates.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🎯</div>
              <h4 className={styles.benefitTitle}>Quality Assurance</h4>
              <p className={styles.benefitText}>Rigorous testing to ensure your project exceeds expectations.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🛠️</div>
              <h4 className={styles.benefitTitle}>Full Support</h4>
              <p className={styles.benefitText}>Ongoing maintenance and support for long-term success.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "form",
      title: "Tell Us About Your Project",
      content: (
        <>
          {status === "success" && (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>🎉</div>
              <h3>Thank You!</h3>
              <p>Your project inquiry has been received! We'll review your requirements and get back to you within 2-3 business days with a detailed proposal.</p>
            </div>
          )}

          {status === "error" && (
            <div className={styles.errorMessage}>
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Personal Information */}
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter your first name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter your last name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="your.email@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="+254700000000"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company" className={styles.label}>Company/Organization *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Your company or organization name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="projectType" className={styles.label}>Project Type *</label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select project type</option>
                <option value="website">Website</option>
                <option value="web-app">Web Application</option>
                <option value="mobile-app">Mobile App</option>
                <option value="e-commerce">E-commerce Platform</option>
                <option value="cms">Content Management System</option>
                <option value="api">API Development</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="budget" className={styles.label}>Budget Range *</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select budget range</option>
                <option value="under-5k">Under 50,000 KSH</option>
                <option value="5k-15k">50,000 - 150,000 KSH</option>
                <option value="15k-30k">150,000 - 300,000 KSH</option>
                <option value="30k-50k">300,000 - 500,000 KSH</option>
                <option value="50k-100k">500,000 - 1,000,000 KSH</option>
                <option value="over-100k">Over 1,000,000 KSH</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeline" className={styles.label}>Preferred Timeline *</label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-month">Within 1 month</option>
                <option value="2-3-months">2-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-months-plus">6+ months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="requirements" className={styles.label}>Project Requirements * (min 10 characters)</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
                className={styles.textarea}
                rows={4}
                placeholder="Describe what you need built, key features, functionality, and any specific requirements..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="goals" className={styles.label}>Project Goals & Objectives * (min 10 characters)</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
                className={styles.textarea}
                rows={3}
                placeholder="What are the main goals and objectives you want to achieve with this project?"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="references" className={styles.label}>References & Inspiration (Optional)</label>
              <textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
                placeholder="Share any websites, apps, or examples that inspire your vision..."
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <span className={styles.spinner}></span>
                  Submitting Project Inquiry...
                </>
              ) : (
                "Get Started →"
              )}
            </button>

            <p className={styles.disclaimer}>
              By submitting this project inquiry, you agree to receive communications from Lumyn about your project.
              We respect your privacy and will never share your information without permission.
            </p>
          </form>
        </>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Get Started | Custom Web Development Services - Lumyn</title>
        <meta
          name="description"
          content="Ready to start your project? Tell us about your needs and get custom web development, mobile apps, and digital solutions from Lumyn's expert team."
        />
        <meta name="keywords" content="web development, mobile apps, project inquiry, custom development, digital solutions" />
        <meta property="og:title" content="Get Started | Custom Web Development Services - Lumyn" />
        <meta
          property="og:description"
          content="Ready to start your project? Tell us about your needs and get custom web development, mobile apps, and digital solutions from Lumyn's expert team."
        />
        <meta property="og:url" content="https://lumyn.vercel.app/get-started" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Get Started | Custom Web Development Services - Lumyn" />
      </Head>

      <div className={styles.getStartedPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Get Started</h1>
            <p className={styles.heroSubtitle}>Let's build something amazing together</p>
            <p className={styles.heroDescription}>
              Share your project vision and requirements. We'll create a custom solution that brings your ideas to life
              with our expert development team.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.container}>
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el
                }}
                className={`${styles.sectionCard} ${visibleSections.has(section.id) ? styles.visible : ""}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <div className={styles.sectionContent}>{section.content}</div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

