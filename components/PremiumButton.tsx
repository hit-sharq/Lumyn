import { ReactNode } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import styles from "./PremiumButton.module.css"

interface PremiumButtonProps {
  children: ReactNode
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
  iconPosition?: "left" | "right"
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export default function PremiumButton({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  onClick,
  className = "",
  disabled = false,
  type = "button"
}: PremiumButtonProps) {
  const Component = href ? motion.a : motion.button
  const commonProps = {
    className: `${styles.button} ${styles[variant]} ${styles[size]} ${className}`,
    onClick,
    disabled,
    whileHover: { scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { duration: 0.2 }
  }

  const content = (
    <>
      {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
      {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <Component {...commonProps} as="a">
          {content}
        </Component>
      </Link>
    )
  }

  return (
    <Component type={type} {...commonProps}>
      {content}
    </Component>
  )
}