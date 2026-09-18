import type { Metadata } from "next"
import { motion } from "framer-motion"
import styles from "./partners.module.css"
import PartnersClient from "./PartnersClient"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  title: "Partners | Lumyn Technologies",
  description: "Our valued partners who support our mission to empower African creators through technology and innovation.",
  path: "/partners",
  keywords: ["partners", "collaborations", "African creators", "technology partners", "innovation"],
})

export default function PartnersPage() {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Partners", url: "https://www.lumyn.co.ke/partners" },
      ])}
      <div className={styles.container}>
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>Our Partners</h1>
          <p className={styles.subtitle}>
            We collaborate with leading organizations to drive innovation and create meaningful impact.
          </p>
        </motion.div>

        <PartnersClient />
      </div>
    </>
  )
}