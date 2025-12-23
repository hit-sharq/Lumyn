"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./blog.module.css"


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
      setPosts(data)
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
            <h1 className={styles.heroTitle}>Lumyn Blog</h1>
            <p className={styles.heroSubtitle}>Stories, insights, and experiences from our community</p>
          </div>
        </section>

        <section className={styles.blogSection}>
          <div className={styles.container}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading blog posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No blog posts yet</h3>
                <p>Check back soon for stories and insights from our community</p>
              </div>
            ) : (

              <div className={styles.blogGrid}>
                {posts.map((post) => (
                  <article key={post.id} className={styles.blogCard}>
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
                      <p className={styles.blogDescription}>{post.excerpt}</p>
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
                  </article>
                ))}
              </div>
            )}

            {selectedPost && (
              <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
                <div className={styles.blogDetailCard} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.detailClose} onClick={() => setSelectedPost(null)}>
                    ×
                  </button>
                  <div className={styles.detailImageWrapper}>
                    <Image
                      src={selectedPost.image || "/placeholder.svg?height=300&width=500&query=blog"}
                      alt={selectedPost.title}
                      fill
                      className={styles.detailImage}
                    />
                  </div>
                  <div className={styles.detailBody}>
                    <h3 className={styles.detailTitle}>{selectedPost.title}</h3>
                    <p className={styles.detailDescription}>{selectedPost.content}</p>
                    <div className={styles.detailDetails}>
                      <div className={styles.detailDetail}>
                        <span className={styles.detailIcon}>👤</span>
                        <span>{selectedPost.author}</span>
                      </div>
                      <div className={styles.detailDetail}>
                        <span className={styles.detailIcon}>📅</span>
                        <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className={styles.detailDetail}>
                        <span className={styles.detailIcon}>🏷️</span>
                        <span>{selectedPost.category}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${selectedPost.id}`} className={styles.viewFullArticle}>
                      View Full Article →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
