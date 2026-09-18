"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./news.module.css"
import LoadingState from "@/components/LoadingState"

interface NewsItem {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  createdAt: string
  publishedAt: string
  category: string
  tags?: string[]
  source: "news" | "blog" // To distinguish between news and blog posts
}

const CATEGORIES = ["All", "Technology", "Business", "Innovation", "Company News", "Blog"]

export default function NewsPage() {
  const router = useRouter()
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null)

  useEffect(() => {
    fetchAllContent()
  }, [])

  const fetchAllContent = async () => {
    try {
      setLoading(true)
      
      // Fetch both news and blog posts
      const [newsResponse, blogResponse] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/blog?isPublished=true")
      ])

      const news = newsResponse.ok ? await newsResponse.json() : []
      const blogs = blogResponse.ok ? await blogResponse.json() : []

      // Combine and normalize the data
      const combinedItems: NewsItem[] = [
        ...news.map((item: any) => ({
          ...item,
          source: "news" as const,
          publishedAt: item.publishedAt || item.createdAt
        })),
        ...blogs.map((item: any) => ({
          ...item,
          source: "blog" as const,
          publishedAt: item.publishedAt || item.createdAt
        }))
      ]

      // Sort by published date (newest first)
      combinedItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      
      setItems(combinedItems)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory === "All" 
    ? items 
    : selectedCategory === "Blog"
    ? items.filter(item => item.source === "blog")
    : items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  const handleItemClick = (item: NewsItem) => {
    setSelectedItem(item)
  }

  const handleViewFull = (item: NewsItem) => {
    if (item.source === "news") {
      router.push(`/news/${item.id}`)
    } else {
      router.push(`/blog/${item.id}`)
    }
  }

  const getCategoryBadgeColor = (item: NewsItem) => {
    if (item.source === "blog") return "#4CAF50" // Green for blogs
    switch (item.category.toLowerCase()) {
      case "technology": return "#2196F3"
      case "business": return "#FF9800"
      case "innovation": return "#9C27B0"
      case "company news": return "#F44336"
      default: return "#757575"
    }
  }

  if (loading) {
    return (
      <LoadingState variant="page" label="Loading news" />
    )
  }

  return (
    <div className={styles.newsPage}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>Latest News</motion.h1>
          <motion.p className={styles.heroSubtitle} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>Stay updated with our latest announcements and insights</motion.p>
        </div>
      </div>

      <div className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            {CATEGORIES.map((category, index) => (
              <motion.button
                key={category}
                className={`${styles.filterBtn} ${selectedCategory === category ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedCategory(category)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3>No articles found</h3>
              <p>Try selecting a different category or check back later for updates.</p>
            </motion.div>
          ) : (
            <div className={styles.newsGrid}>
{filteredItems.map((item, index) => (
                <motion.article
                  key={`${item.source}-${item.id}`}
                  className={styles.newsCard}
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.newsImageWrapper}>
                    <Image
                      src={item.image || "/placeholder.svg?height=180&width=350&query=article"}
                      alt={item.title}
                      fill
                      className={styles.newsImage}
                    />
                    <span 
                      className={styles.newsCategory}
                      style={{ backgroundColor: getCategoryBadgeColor(item) }}
                    >
                      {item.source === "blog" ? "Blog" : item.category}
                    </span>
                  </div>
                  
                  <div className={styles.newsContent}>
                    <div className={styles.newsMeta}>
                      <span className={styles.newsAuthor}>{item.author}</span>
                      <span className={styles.newsDate}>{formatDate(item.publishedAt)}</span>
                    </div>
                    
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                    
                    <p className={styles.newsExcerpt}>
                      {truncateContent(item.excerpt || item.content)}
                    </p>
                    
                    <button 
                      className={styles.readMoreBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleItemClick(item)
                      }}
                    >
                      {item.source === "blog" ? "Read Blog Post" : "Read More"} →
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className={styles.detailCard}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
            <button className={styles.detailClose} onClick={() => setSelectedItem(null)}>
              ×
            </button>
            <div className={styles.detailImageWrapper}>
              <Image
                src={selectedItem.image || "/placeholder.svg?height=300&width=500&query=article"}
                alt={selectedItem.title}
                fill
                className={styles.detailImage}
              />
            </div>
            <div className={styles.detailBody}>
              <h3 className={styles.detailTitle}>{selectedItem.title}</h3>
              <div className={styles.detailMeta}>
                <span className={styles.detailBadge}>{selectedItem.author}</span>
                <span className={styles.detailBadge}>{formatDate(selectedItem.publishedAt)}</span>
                <span 
                  className={styles.detailBadge}
                  style={{ backgroundColor: getCategoryBadgeColor(selectedItem) }}
                >
                  {selectedItem.source === "blog" ? "Blog" : selectedItem.category}
                </span>
              </div>
              <div className={styles.detailDescription}>
                <div dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
              </div>
              <button
                className={styles.viewFullBtn}
                onClick={() => {
                  setSelectedItem(null)
                  handleViewFull(selectedItem)
                }}
              >
                View Full Article →
              </button>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
