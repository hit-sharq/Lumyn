"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/components/toast"
import styles from "./apply-button.module.css"

interface Career {
  id: string
  title: string
  company: string
  description: string
  requirements?: string | null
  location: string | null
  type: string
  salary?: string | null
  applicationDeadline?: Date | null
  applicationUrl?: string | null
  contactEmail?: string | null
  featured: boolean
  image?: string | null
  jobType?: string
  whatsappNumber?: string | null
  phoneNumber?: string | null
  createdAt: Date
}

interface ApplyButtonProps {
  career: Career
  className?: string
}

export default function ApplyButton({ career, className = "" }: ApplyButtonProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleApply = async () => {
    if (career.applicationUrl) {
      setIsLoading(true)
      try {
        window.open(career.applicationUrl, "_blank")
        showToast({
          type: "success",
          title: "Redirecting to Application",
          message: "Opening external application link...",
        })
      } catch {
        showToast({
          type: "error",
          title: "Error",
          message: "Failed to open application link. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    } else if (career.jobType === "formal" || !career.jobType) {
      setIsLoading(true)
      router.push(`/careers/apply/${career.id}`)
    } else {
      showToast({
        type: "info",
        title: "Informal Job Application",
        message: "This job requires direct contact. Please use WhatsApp or call the provided number.",
      })
    }
  }

  const getButtonText = () => {
    if (career.applicationUrl) return isLoading ? "Opening..." : "Apply Now"
    if (career.jobType === "formal" || !career.jobType) return isLoading ? "Loading..." : "Apply Now"
    return "Contact Employer"
  }

  return (
    <button
      onClick={handleApply}
      disabled={isLoading}
      className={`${styles.applyButton} ${className}`}
    >
      {isLoading && <span className={styles.spinner} />}
      <span>{getButtonText()}</span>
    </button>
  )
}
