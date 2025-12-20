"use client"


import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Head from "next/head"
import Image from "next/image"
import ShareButton from "@/components/ShareButton"

import styles from "../apply.module.css"


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
  createdAt: string
}

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedIn: string
  portfolio: string
  coverLetter: string
  experience: string
  availability: string
  salaryExpectation: string
  additionalInfo: string
  resumeUrl: string
}

export default function JobApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [career, setCareer] = useState<Career | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    coverLetter: "",
    experience: "",
    availability: "",
    salaryExpectation: "",
    additionalInfo: "",
    resumeUrl: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (jobId) {
      fetchCareer()
    }
  }, [jobId])

  const fetchCareer = async () => {
    try {
      const response = await fetch(`/api/careers/${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setCareer(data)
      } else {
        console.error("Career not found")
        router.push("/careers")
      }
    } catch (error) {
      console.error("Failed to fetch career:", error)
      router.push("/careers")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address"
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        break

      case 2: // Professional Background
        if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required"
        if (!formData.experience.trim()) newErrors.experience = "Please describe your relevant experience"
        if (!formData.availability.trim()) newErrors.availability = "Availability is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return

    setSubmitting(true)
    
    try {
      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          jobId: career?.id,
          jobTitle: career?.title,
          jobCompany: career?.company,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const errorData = await response.json()
        console.error("Application submission failed:", errorData)
        alert("Failed to submit application. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading application form...</p>
      </div>
    )
  }

  if (!career) {
    return (
      <div className={styles.error}>
        <h2>Job not found</h2>
        <p>The job you're trying to apply for doesn't exist or has been removed.</p>
        <button onClick={() => router.push("/careers")} className={styles.backButton}>
          Back to Careers
        </button>
      </div>
    )
  }


  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>✅</div>
          <h1>Application Submitted Successfully!</h1>
          <p>Thank you for your interest in the <strong>{career.title}</strong> position at <strong>{career.company}</strong>.</p>
          <p>We've received your application and will review it carefully. You'll hear from us soon.</p>
          
          <div className={styles.shareSection}>
            <h3>Share this opportunity</h3>
            <p>Know someone who might be interested? Share this job posting:</p>
            <ShareButton
              title={`${career.title} at ${career.company}`}
              text={`Check out this job opportunity: ${career.title} at ${career.company}`}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/careers/apply/${career.id}`}
              image={career.image}
              variant="default"
              showLabels={true}
            />
          </div>
          
          <div className={styles.successActions}>
            <button onClick={() => router.push("/careers")} className={styles.primaryButton}>
              Browse More Opportunities
            </button>
            <button onClick={() => router.push("/")} className={styles.secondaryButton}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: "Personal Information", description: "Tell us about yourself" },
    { number: 2, title: "Professional Background", description: "Your experience and skills" },
    { number: 3, title: "Review & Submit", description: "Final review of your application" },
  ]

  return (
    <>
      <Head>
        <title>Apply for {career.title} | Lumyn Careers</title>
        <meta
          name="description"
          content={`Apply for the ${career.title} position at ${career.company}. Join our team and shape the future of digital solutions.`}
        />
      </Head>

      <div className={styles.applicationPage}>
        {/* Progress Header */}
        <div className={styles.progressHeader}>
          <div className={styles.container}>
            <div className={styles.progressContent}>
              <div className={styles.jobInfo}>
                <h1 className={styles.jobTitle}>Apply for {career.title}</h1>
                <p className={styles.jobCompany}>{career.company} • {career.location}</p>
              </div>
              
              <div className={styles.progressSteps}>
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`${styles.progressStep} ${
                      currentStep === step.number ? styles.activeStep : ""
                    } ${currentStep > step.number ? styles.completedStep : ""}`}
                  >
                    <div className={styles.stepNumber}>{step.number}</div>
                    <div className={styles.stepInfo}>
                      <div className={styles.stepTitle}>{step.title}</div>
                      <div className={styles.stepDescription}>{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className={styles.formContent}>
          <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.applicationForm}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className={styles.formStep}>
                  <h2 className={styles.stepHeading}>Personal Information</h2>
                  <p className={styles.stepSubheading}>Please provide your basic contact information.</p>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName" className={styles.formLabel}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`${styles.formInput} ${errors.firstName ? styles.errorInput : ""}`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="lastName" className={styles.formLabel}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`${styles.formInput} ${errors.lastName ? styles.errorInput : ""}`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.formLabel}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${styles.formInput} ${errors.email ? styles.errorInput : ""}`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone" className={styles.formLabel}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`${styles.formInput} ${errors.phone ? styles.errorInput : ""}`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="linkedIn" className={styles.formLabel}>
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        id="linkedIn"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="portfolio" className={styles.formLabel}>
                        Portfolio/Website
                      </label>
                      <input
                        type="url"
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Background */}
              {currentStep === 2 && (
                <div className={styles.formStep}>
                  <h2 className={styles.stepHeading}>Professional Background</h2>
                  <p className={styles.stepSubheading}>Tell us about your experience and why you're a great fit.</p>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="coverLetter" className={styles.formLabel}>
                      Cover Letter *
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={6}
                      className={`${styles.formTextarea} ${errors.coverLetter ? styles.errorInput : ""}`}
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    />
                    {errors.coverLetter && <span className={styles.errorMessage}>{errors.coverLetter}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="experience" className={styles.formLabel}>
                      Relevant Experience *
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={4}
                      className={`${styles.formTextarea} ${errors.experience ? styles.errorInput : ""}`}
                      placeholder="Describe your relevant work experience, projects, or achievements..."
                    />
                    {errors.experience && <span className={styles.errorMessage}>{errors.experience}</span>}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="availability" className={styles.formLabel}>
                        Availability *
                      </label>
                      <select
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className={`${styles.formSelect} ${errors.availability ? styles.errorInput : ""}`}
                      >
                        <option value="">Select availability</option>
                        <option value="immediately">Available immediately</option>
                        <option value="2-weeks">2 weeks notice</option>
                        <option value="1-month">1 month notice</option>
                        <option value="2-months">2 months notice</option>
                        <option value="other">Other (please specify in additional info)</option>
                      </select>
                      {errors.availability && <span className={styles.errorMessage}>{errors.availability}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="salaryExpectation" className={styles.formLabel}>
                        Salary Expectation
                      </label>
                      <input
                        type="text"
                        id="salaryExpectation"
                        name="salaryExpectation"
                        value={formData.salaryExpectation}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="e.g., $60,000 - $80,000"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="resumeUrl" className={styles.formLabel}>
                      Resume Link
                    </label>
                    <input
                      type="url"
                      id="resumeUrl"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="additionalInfo" className={styles.formLabel}>
                      Additional Information
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={3}
                      className={styles.formTextarea}
                      placeholder="Any additional information you'd like to share..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div className={styles.formStep}>
                  <h2 className={styles.stepHeading}>Review Your Application</h2>
                  <p className={styles.stepSubheading}>Please review your information before submitting.</p>
                  
                  <div className={styles.reviewSection}>
                    <div className={styles.reviewCard}>
                      <h3>Personal Information</h3>
                      <div className={styles.reviewGrid}>
                        <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                        <div><strong>Email:</strong> {formData.email}</div>
                        <div><strong>Phone:</strong> {formData.phone}</div>
                        {formData.linkedIn && <div><strong>LinkedIn:</strong> {formData.linkedIn}</div>}
                        {formData.portfolio && <div><strong>Portfolio:</strong> {formData.portfolio}</div>}
                      </div>
                    </div>

                    <div className={styles.reviewCard}>
                      <h3>Professional Information</h3>
                      <div className={styles.reviewContent}>
                        <div><strong>Availability:</strong> {formData.availability}</div>
                        {formData.salaryExpectation && <div><strong>Salary Expectation:</strong> {formData.salaryExpectation}</div>}
                        {formData.resumeUrl && <div><strong>Resume:</strong> <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></div>}
                      </div>
                    </div>

                    <div className={styles.reviewCard}>
                      <h3>Cover Letter</h3>
                      <div className={styles.reviewContent}>
                        <p>{formData.coverLetter}</p>
                      </div>
                    </div>

                    <div className={styles.reviewCard}>
                      <h3>Experience</h3>
                      <div className={styles.reviewContent}>
                        <p>{formData.experience}</p>
                      </div>
                    </div>

                    {formData.additionalInfo && (
                      <div className={styles.reviewCard}>
                        <h3>Additional Information</h3>
                        <div className={styles.reviewContent}>
                          <p>{formData.additionalInfo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className={styles.formNavigation}>
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className={styles.secondaryButton}>
                    Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep} className={styles.primaryButton}>
                    Next Step
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={styles.submitButton}
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
