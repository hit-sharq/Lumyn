"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Head from "next/head"
import Image from "next/image"
import styles from "./article.module.css"
import ShareButton from "@/components/ShareButton"

interface NewsItem {
  id: string
  title: string
  content: string
  image: string
  author: string
  createdAt: string
  category: string
}

export default function NewsArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data)
      } else {
        router.push("/news")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      router.push("/news")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading article...</p>
      </div>
    )
  }

  if (!article) {
    return null
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <>
      <Head>
        <title>{article.title} | Lumyn News</title>
        <meta name="description" content={`Read this news article: ${article.title} by ${article.author}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={`Read this news article: ${article.title} by ${article.author}`} />
        <meta property="og:image" content={article.image || "/placeholder.svg"} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Lumyn" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={`Read this news article: ${article.title} by ${article.author}`} />
        <meta name="twitter:image" content={article.image || "/placeholder.svg"} />
      </Head>

      <div className={styles.articlePage}>
        <article className={styles.article}>
          <div className={styles.articleHeader}>
            <div className={styles.articleMeta}>
              <span className={styles.category}>{article.category}</span>
              <span className={styles.date}>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className={styles.title}>{article.title}</h1>
            <div className={styles.author}>By {article.author}</div>
          </div>

          <div className={styles.imageWrapper}>
            <Image
              src={article.image || "/placeholder.svg?height=600&width=1200&query=news article"}
              alt={article.title}
              fill
              className={styles.image}
              priority
            />
          </div>

          <div className={styles.content}>
            <div className={styles.contentInner} dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          <div className={styles.shareSection}>
            <ShareButton
              title={article.title}
              text={`Read this news article: ${article.title} by ${article.author}`}
              image={article.image}
            />
          </div>

          <div className={styles.backButton}>
            <button onClick={() => router.back()} className={styles.backBtn}>
              ← Back to News
            </button>
          </div>
        </article>
      </div>
    </>
  )
}
