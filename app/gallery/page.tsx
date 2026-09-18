"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import styles from "./gallery.module.css"
import LoadingState from "@/components/LoadingState"

interface GalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  createdAt: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]
  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter)

  return (
    <>

      <div className={styles.galleryPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Photo Gallery
            </motion.h1>
            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              Capturing moments and memories from our community
            </motion.p>
          </div>
        </section>

      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className={`${styles.filterBtn} ${filter === category ? styles.filterBtnActive : ""}`}
                onClick={() => setFilter(category)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <LoadingState variant="page" label="Loading gallery" />
          ) : filteredItems.length === 0 ? (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3>No images yet</h3>
              <p>Check back soon for photos from our events and activities</p>
            </motion.div>
          ) : (
            <div className={styles.galleryGrid}>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={styles.galleryItem}
                  onClick={() => setSelectedItem(item)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.imageUrl || "/placeholder.svg?height=400&width=400&query=gallery"}
                      alt={item.title}
                      fill
                      className={styles.image}
                    />
                    <div className={styles.overlay}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemCategory}>{item.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
          {selectedItem && (
            <motion.div
              className={styles.lightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className={styles.lightboxContent}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>
                  ✕
                </button>
                <div className={styles.lightboxImageWrapper}>
                  <Image
                    src={selectedItem.imageUrl || "/placeholder.svg?height=800&width=1200&query=gallery"}
                    alt={selectedItem.title}
                    fill
                    className={styles.lightboxImage}
                  />
                </div>
                <div className={styles.lightboxInfo}>
                  <h2 className={styles.lightboxTitle}>{selectedItem.title}</h2>
                  <p className={styles.lightboxDescription}>{selectedItem.description}</p>
                  <div className={styles.lightboxMeta}>
                    <span className={styles.lightboxCategory}>{selectedItem.category}</span>
                    <span className={styles.lightboxDate}>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
    </>
  )
}
