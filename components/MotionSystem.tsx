"use client"

import { useEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import styles from "./MotionSystem.module.css"

export default function MotionSystem() {
  const dotRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const dotY = useSpring(cursorY, { stiffness: 500, damping: 28 })
  const ringX = useSpring(cursorX, { stiffness: 180, damping: 18 })
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 18 })
  const glowX = useSpring(cursorX, { stiffness: 90, damping: 16 })
  const glowY = useSpring(cursorY, { stiffness: 90, damping: 16 })
  const ringScale = useSpring(interactive ? 1.8 : 1, { stiffness: 260, damping: 16 })
  const { scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.2 })

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setEnabled(finePointer && !reducedMotion)

    if (!finePointer || reducedMotion) return

    const moveCursor = (event: MouseEvent) => {
      cursorX.set(event.clientX)
      cursorY.set(event.clientY)
    }
    const pointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      setInteractive(Boolean(target?.closest("a, button, input, textarea, select, [data-motion-interactive]")))
    }
    const enterPage = () => animate(0, 1, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        if (dotRef.current) dotRef.current.style.opacity = String(value)
        if (ringRef.current) ringRef.current.style.opacity = String(value)
      }
    })
    const animation = enterPage()

    window.addEventListener("mousemove", moveCursor, { passive: true })
    document.addEventListener("pointerover", pointerOver, { passive: true })
    return () => {
      animation.stop()
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("pointerover", pointerOver)
    }
  }, [cursorX, cursorY])

  if (!enabled) {
    return <motion.div className={styles.progress} style={{ scaleX: progressScale }} />
  }

  return (
    <>
      <motion.div className={styles.progress} style={{ scaleX: progressScale }} />
      <motion.div className={styles.cursorGlow} style={{ x: glowX, y: glowY }} aria-hidden="true" />
      <motion.div className={styles.cursorRingShell} data-motion-interactive={interactive ? "true" : "false"} style={{ x: ringX, y: ringY }} aria-hidden="true">
        <motion.span ref={ringRef} className={styles.cursorRing} style={{ scale: ringScale, opacity: 0 }} />
      </motion.div>
      <motion.div className={styles.cursorDotShell} style={{ x: dotX, y: dotY }} aria-hidden="true">
        <span ref={dotRef} className={styles.cursorDot} />
      </motion.div>
    </>
  )
}
