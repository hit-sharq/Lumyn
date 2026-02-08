"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./page.module.css"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image: string
}

interface News {
  id: string
  title: string
  excerpt: string
  image?: string
  publishedAt: string
}

interface Stats {
  members: number
  events: number
  news: number
  yearsActive: number
}

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [stats, setStats] = useState<Stats>({ members: 0, events: 0, news: 0, yearsActive: 1 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch upcoming events (limit to 3)
        const eventsRes = await fetch("/api/events")
        const eventsData = await eventsRes.json()
        const upcoming = eventsData.filter((event: Event) => new Date(event.date) >= new Date()).slice(0, 3)
        setUpcomingEvents(upcoming)

        // Fetch latest news (limit to 3)
        const newsRes = await fetch("/api/news")
        const newsData = await newsRes.json()
        setLatestNews(newsData.slice(0, 3))

        // Update stats with actual counts
        setStats(prev => ({
          ...prev,
          events: eventsData.length,
          news: newsData.length
        }))
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])



  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80"
          alt="Developer Coding"
          className={styles.heroGif}
        />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>Digital Solutions</p>
          <h1 className={styles.heroTitle}>Building Tomorrow&apos;s Technology</h1>
          <p className={styles.heroDescription}>
            We create innovative digital experiences that transform businesses and drive growth in the modern world.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/get-started" className={styles.joinButton}>
              Start Project
            </Link>
            <Link href="/about" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Who We Are</h2>
            <p className={styles.sectionSubtitle}>
              A forward-thinking tech company specializing in modern digital solutions
            </p>
          </div>
          <p className={styles.aboutText}>
            We are a forward-thinking tech company specializing in modern digital solutions. From web development to
            digital strategy, we help businesses shine online with innovative technology and exceptional user experiences.
          </p>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{loading ? "..." : stats.news}</h3>
              <p className={styles.statLabel}>Articles</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{loading ? "..." : stats.events}</h3>
              <p className={styles.statLabel}>Events</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>1+</h3>
              <p className={styles.statLabel}>Years</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>5+</h3>
              <p className={styles.statLabel}>Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <p className={styles.sectionSubtitle}>Join us at our latest gatherings</p>
          </div>
          <div className={styles.eventsGrid}>
            {loading ? (
              <EventCard />
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <EventCard />
            )}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest News</h2>
            <p className={styles.sectionSubtitle}>Stay updated with our latest stories</p>
          </div>
          <div className={styles.newsGrid}>
            {loading ? (
              <NewsCard />
            ) : latestNews.length > 0 ? (
              latestNews.map((news) => <NewsCard key={news.id} news={news} />)
            ) : (
              <NewsCard />
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
          alt="Team Collaboration"
          className={styles.ctaGif}
        />
        <div className={styles.ctaOverlay}></div>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaText}>
            Let&apos;s discuss your project and bring your digital vision to life.
          </p>
          <Link href="/get-started" className={styles.ctaButton}>
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  )
}

function EventCard({ event }: { event?: Event }) {
  if (!event) {
    return (
      <div className={styles.newsCard}>
        <div className={styles.newsImageWrapper}>
          <div className={styles.newsImagePlaceholder}>
            <span>📅</span>
          </div>
        </div>
        <div className={styles.newsContent}>
          <span className={styles.newsCategory}>Events</span>
          <h3 className={styles.newsTitle}>No upcoming events</h3>
          <p className={styles.newsExcerpt}>Check back soon for upcoming events</p>
          <button className={styles.readMore} onClick={() => window.location.href = '/events'}>Learn More</button>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const truncatedDescription = event.description.length > 80 ? event.description.substring(0, 80) + "..." : event.description

  return (
    <div className={styles.newsCard}>
      <div className={styles.newsImageWrapper}>
        <div className={styles.eventDateBadge}>
          <span className={styles.eventDay}>{day}</span>
          <span className={styles.eventMonth}>{month}</span>
        </div>
        <div className={styles.newsImage}>
          <Image src={event.image || "/placeholder.svg"} alt={event.title} fill style={{ objectFit: "cover" }} />
        </div>
      </div>
      <div className={styles.newsContent}>
        <span className={styles.newsCategory}>Event</span>
        <h3 className={styles.newsTitle}>{event.title}</h3>
        <p className={styles.newsExcerpt}>{truncatedDescription}</p>
        <button className={styles.readMore} onClick={() => window.location.href = `/events?id=${event.id}`}>Learn More</button>
      </div>
    </div>
  )
}

function NewsCard({ news }: { news?: News }) {
  if (!news) {
    return (
      <div className={styles.newsCard}>
        <div className={styles.newsImageWrapper}>
          <div className={styles.newsImagePlaceholder}>
            <span>📰</span>
          </div>
        </div>
        <div className={styles.newsContent}>
          <span className={styles.newsCategory}>News</span>
          <h3 className={styles.newsTitle}>No news available</h3>
          <p className={styles.newsExcerpt}>Check back soon for the latest updates</p>
          <button className={styles.readMore} onClick={() => window.location.href = '/news'}>Learn More</button>
        </div>
      </div>
    )
  }

  const truncatedExcerpt = news.excerpt.length > 80 ? news.excerpt.substring(0, 80) + "..." : news.excerpt

  return (
    <div className={styles.newsCard}>
      <div className={styles.newsImageWrapper}>
        {news.image ? (
          <div className={styles.newsImage}>
            <Image src={news.image || "/placeholder.svg"} alt={news.title} fill style={{ objectFit: "cover" }} />
          </div>
        ) : (
          <div className={styles.newsImagePlaceholder}>
            <span>📰</span>
          </div>
        )}
      </div>
      <div className={styles.newsContent}>
        <span className={styles.newsCategory}>Article</span>
        <h3 className={styles.newsTitle}>{news.title}</h3>
        <p className={styles.newsExcerpt}>{truncatedExcerpt}</p>
        <button className={styles.readMore} onClick={() => window.location.href = `/news?id=${news.id}`}>Learn More</button>
      </div>
    </div>
  )
}

