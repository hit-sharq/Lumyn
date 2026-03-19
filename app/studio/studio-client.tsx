"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import styles from './studio.module.css'

interface TemplateItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  price: number
  isFree: boolean
  featured: boolean
  tags: string[]
}

export default function StudioClient() {
  const [items, setItems] = useState<TemplateItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/studio/templates")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading templates...</p>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Lumyn Studio</h1>
          <p className={styles.heroSubtitle}>Premium templates marketplace</p>
        </div>
      </div>

      <div className={styles.newsSection}>
        <div className={styles.container}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No templates available</h3>
              <p>Check back soon for premium templates</p>
            </div>
          ) : (
            <div className={styles.newsGrid}>
              {items.map((item) => (
                <Link key={item.id} href={`/studio/${item.id}`} className="block">
                  <article className={styles.newsCard}>
                    <div className={styles.newsImageWrapper}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className={styles.newsImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <span className={styles.templateCategory}>{item.category}</span>
                    </div>
                    
                    <div className={styles.newsContent}>
                      <div className={styles.newsMeta}>
                        <span className={styles.newsAuthor}>{item.tags[0] || 'Template'}</span>
                        <Badge className={item.featured ? 'bg-yellow-400 text-black' : ''}>
                          {item.featured ? 'Featured' : ''}
                        </Badge>
                      </div>
                      
                      <h3 className={styles.newsTitle}>{item.title}</h3>
                      
                      <p className={styles.newsExcerpt}>
                        {item.description}
                      </p>
                      
                      <div className={styles.templatePrice}>
                        {item.isFree ? 'FREE' : `$${item.price}`}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

