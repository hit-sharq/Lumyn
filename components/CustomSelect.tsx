"use client"

import { useState, useRef, useEffect } from "react"

const options = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Engineering" },
  { value: "fullstack", label: "Full-Stack Application" },
  { value: "cloud", label: "Cloud Architecture" },
  { value: "devops", label: "DevOps & CI/CD" },
  { value: "mobile", label: "Mobile Development" },
  { value: "security", label: "Security & Compliance" },
  { value: "consulting", label: "Technical Consulting" },
  { value: "other", label: "Other" },
]

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function CustomSelect({ value, onChange, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value) || options[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={className ? `custom-select ${className}` : "custom-select"}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select-value">{selected.label}</span>
        <svg
          className={`custom-select-arrow ${isOpen ? "open" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-option ${option.value === value ? "selected" : ""}`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
