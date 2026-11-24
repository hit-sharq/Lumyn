"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import styles from "./MotionSystem.module.css"

export default function MotionSystem() {
  const { scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.2 })

  return <motion.div className={styles.progress} style={{ scaleX: progressScale }} />
}
