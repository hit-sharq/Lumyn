"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import styles from "./blog.module.css"
import LoadingState from "@/components/LoadingState"

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  createdAt: string
  category: string
  tags: string[]
  isPublished: boolean
  featured: boolean
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])


  const fetchPosts = async () => {
    try {
      // Fetch only published posts
      const response = await fetch("/api/blog?isPublished=true")
      const data = await response.json()
      if (Array.isArray(data)) {
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.blogPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Lumyn Technologies Blog
            </motion.h1>
            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              Stories, insights, and experiences from our community
            </motion.p>
          </div>
        </section>

        <section className={styles.blogSection}>
          <div className={styles.container}>
            {loading ? (
              <LoadingState variant="editorial" label="Loading stories" count={6} />
            ) : posts.length === 0 ? (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3>No blog posts yet</h3>
                <p>Check back soon for stories and insights from our community</p>
              </motion.div>
            ) : (
              <div className={styles.blogGrid}>
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className={styles.blogCard}
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.blogImageWrapper}>
                      <Image
                        src={post.image || "/placeholder.svg?height=300&width=500&query=blog"}
                        alt={post.title}
                        fill
                        className={styles.blogImage}
                      />
                      <span className={styles.blogCategory}>{post.category}</span>
                      {post.featured && (
                        <span className={styles.featuredBadge}>Featured</span>
                      )}
                    </div>
                    <div className={styles.blogContent}>
                      <h3 className={styles.blogTitle}>{post.title}</h3>
                      <div className={`${styles.blogDescription} ${styles.richText}`} dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                      <div className={styles.blogMeta}>
                        <span className={styles.blogAuthor}>By {post.author}</span>
                        <span className={styles.blogDate}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <div className={styles.blogTags}>
                            {post.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className={styles.blogTag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className={styles.blogReadMore} onClick={() => setSelectedPost(post)}>
                        Read More
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            <AnimatePresence>
              {selectedPost && (
                <motion.div
                  className={styles.modalOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setSelectedPost(null)}
                >
                  <motion.div
                    className={styles.modalContent}
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className={styles.modalClose} onClick={() => setSelectedPost(null)}>
                      ×
                    </button>
                    <div className={styles.modalImageWrapper}>
                      <Image
                        src={selectedPost.image || "/placeholder.svg?height=300&width=500&query=blog"}
                        alt={selectedPost.title}
                        fill
                        className={styles.modalImage}
                      />
                    </div>
                    <div className={styles.modalBody}>
                      <h3 className={styles.modalTitle}>{selectedPost.title}</h3>
                      <div className={`${styles.modalDescription} ${styles.richText}`} dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                      <div className={styles.blogMeta}>
                        <div className={styles.blogMetaItem}>
                          <span className={styles.blogMetaIcon}>👤</span>
                          <span>{selectedPost.author}</span>
                        </div>
                        <div className={styles.blogMetaItem}>
                          <span className={styles.blogMetaIcon}>📅</span>
                          <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.blogMetaItem}>
                          <span className={styles.blogMetaIcon}>🏷️</span>
                          <span>{selectedPost.category}</span>
                        </div>
                      </div>
                      <Link href={`/blog/${selectedPost.id}`} className={styles.viewFullArticle}>
                        View Full Article →
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </>
  )
}
