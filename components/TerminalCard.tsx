'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './TerminalCard.module.css'

interface TerminalCardProps {
  children: React.ReactNode
  title: string
  className?: string
  typingDelay?: number
  showPrompt?: boolean
  promptText?: string
}

export default function TerminalCard({
  children,
  title,
  className = '',
  typingDelay = 0,
  showPrompt = true,
  promptText = 'core@lumyn:~$'
}: TerminalCardProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const contentRef = useRef<string>('')

  useEffect(() => {
    contentRef.current = typeof children === 'string' ? children : ''
  }, [children])

  useEffect(() => {
    if (!contentRef.current) return

    const fullText = contentRef.current
    let currentIndex = 0
    const typingSpeed = 30 // ms per character

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setDisplayedContent(fullText.slice(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeNextChar, typingSpeed)
      } else {
        setIsTyping(false)
      }
    }

    const timer = setTimeout(() => {
      typeNextChar()
    }, typingDelay)

    return () => clearTimeout(timer)
  }, [typingDelay])

  return (
    <motion.div
      className={`${styles.terminalWindow} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Terminal Header */}
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <span className={`${styles.terminalButton} ${styles.red}`} />
          <span className={`${styles.terminalButton} ${styles.yellow}`} />
          <span className={`${styles.terminalButton} ${styles.green}`} />
        </div>
        <div className={styles.terminalTitle}>
          {title}.{isTyping ? '_' : 'sh'}
        </div>
        <div className={styles.terminalStatus} />
      </div>

      {/* Terminal Body */}
      <div className={styles.terminalBody}>
        {showPrompt && (
          <div className={styles.terminalPrompt}>
            <span className={styles.promptSymbol}>$</span>
            <span className={styles.promptPath}>{promptText}</span>
            <span className={isTyping ? styles.cursor : ''} />
          </div>
        )}

        <div className={styles.typingContainer}>
          <span className={styles.typingText}>
            {displayedContent}
            {isTyping && <span className={styles.cursor} />}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// For content that should appear after typing completes
export function TerminalContent({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}

// Reusable terminal list component
export function TerminalList({ items }: { items: string[] }) {
  return (
    <ul className={styles.terminalList}>
      {items.map((item, index) => (
        <TerminalListItem key={index} item={item} index={index} />
      ))}
    </ul>
  )
}

function TerminalListItem({ item, index }: { item: string, index: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Each item appears 500ms after the previous
    const timer = setTimeout(() => setIsVisible(true), (index + 1) * 500)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <motion.li
      className={styles.terminalListItem}
      initial={{ opacity: 0, x: -10 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      <span className={styles.listPrefix}>&gt;</span>
      <span dangerouslySetInnerHTML={{ __html: item }} />
    </motion.li>
  )
}

// Code block component for terminal
export function TerminalCode({ children, comment }: { children: React.ReactNode, comment?: string }) {
  return (
    <div className={styles.terminalCode}>
      {comment && (
        <div className={styles.codeComment}>// {comment}</div>
      )}
      <code>{children}</code>
    </div>
  )
}