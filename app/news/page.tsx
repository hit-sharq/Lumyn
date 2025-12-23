"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./news.module.css"

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
      <div className={styles.newsPage}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Latest News</h1>
            <p className={styles.heroSubtitle}>Stay updated with our latest announcements and insights</p>
          </div>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.newsPage}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Latest News</h1>
          <p className={styles.heroSubtitle}>Stay updated with our latest announcements and insights</p>
        </div>
      </div>

      <div className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${selectedCategory === category ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No articles found</h3>
              <p>Try selecting a different category or check back later for updates.</p>
            </div>
          ) : (
            <div className={styles.newsGrid}>
              {filteredItems.map((item) => (
                <article 
                  key={`${item.source}-${item.id}`} 
                  className={styles.newsCard}
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: 'pointer' }}
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
                    
                    <span className={styles.readMoreBtn}>
                      {item.source === "blog" ? "Read Blog Post" : "Read More"} →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
