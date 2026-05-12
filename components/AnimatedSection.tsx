"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import styles from "./AnimatedSection.module.css"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  once?: boolean
  threshold?: number
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 50,
  once = true,
  threshold = 0.1
}: AnimatedSectionProps) {
  const getDirectionalOffset = () => {
    switch (direction) {
      case "up": return { y: distance, x: 0 }
      case "down": return { y: -distance, x: 0 }
      case "left": return { y: 0, x: distance }
      case "right": return { y: 0, x: -distance }
    }
  }

  const directionalOffset = getDirectionalOffset()

  return (
    <motion.section
      className={`${styles.section} ${className}`}
      initial={{ opacity: 0, y: directionalOffset.y, x: directionalOffset.x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.section>
  )
}