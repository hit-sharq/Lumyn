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
  const [stats, setStats] = useState<Stats>({ members: 0, events: 0, news: 0, yearsActive: 10})
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
        <div className={styles.heroOverlay}></div>
        <Image
          src="/images/hero-team.jpg"
          alt="Kenyan Student Association Team"
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Kenyan Student Association</h1>
          <p className={styles.heroSubtitle}>University of Minnesota</p>
          <p className={styles.heroDescription}>
            Celebrating Kenyan culture, building community, and creating lasting connections
          </p>
          <Link href="/membership" className={styles.joinButton}>
            Join Now
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Welcome to KESA</h2>
          <p className={styles.aboutText}>
            The Kenyan Student Association at the University of Minnesota is a vibrant community dedicated to
            celebrating Kenyan culture, fostering connections among students, and creating a home away from home for
            Kenyan students and friends of Kenya.
          </p>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{loading ? "..." : stats.members}</h3>
              <p className={styles.statLabel}>Active Members</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{loading ? "..." : stats.events}</h3>
              <p className={styles.statLabel}>Total Events</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{loading ? "..." : `${stats.yearsActive}+`}</h3>
              <p className={styles.statLabel}>Years Strong</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <Link href="/events" className={styles.viewAllLink}>
              View All Events →
            </Link>
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

      <section className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest News</h2>
            <Link href="/news" className={styles.viewAllLink}>
              View All News →
            </Link>
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
        <Image
          src="/images/WhatsApp Image 2025-10-03 at 18.32.17_5a3dc3ec.jpg"
          alt="Join the Kenyan Student Association Community"
          fill
          className={styles.ctaBackgroundImage}
        />
        <div className={styles.ctaOverlay}></div>
        <div className={`${styles.container} ${styles.ctaContainer}`}>
          <h2 className={styles.ctaTitle}>Ready to Join Our Community?</h2>
          <p className={styles.ctaText}>
            Become a member today and be part of something special. Membership is completely free!
          </p>
          <Link href="/membership" className={styles.ctaButton}>
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}

function EventCard({ event }: { event?: Event }) {
  if (!event) {
    return (
      <div className={styles.eventCard}>
        <div className={styles.eventDate}>
          <span className={styles.eventDay}>--</span>
          <span className={styles.eventMonth}>---</span>
        </div>
        <div className={styles.eventContent}>
          <h3 className={styles.eventTitle}>No upcoming events</h3>
          <p className={styles.eventDescription}>Check back soon for upcoming events</p>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const truncatedDescription = event.description.length > 100 ? event.description.substring(0, 100) + "..." : event.description

  return (
    <Link href={`/events`} className={styles.eventCard}>
      <div className={styles.eventDate}>
        <span className={styles.eventDay}>{day}</span>
        <span className={styles.eventMonth}>{month}</span>
      </div>
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventDescription}>{truncatedDescription}</p>
        <p className={styles.eventLocation}>📍 {event.location}</p>
        <span className={styles.readMore}>Read More →</span>
      </div>
    </Link>
  )
}

function NewsCard({ news }: { news?: News }) {
  if (!news) {
    return (
      <div className={styles.newsCard}>
        <div className={styles.newsImagePlaceholder}>
          <span>📰</span>
        </div>
        <div className={styles.newsContent}>
          <h3 className={styles.newsTitle}>No news available</h3>
          <p className={styles.newsExcerpt}>Check back soon for the latest updates</p>
          <button className={styles.readMore} onClick={() => window.location.href = '/news'}>Read More →</button>
        </div>
      </div>
    )
  }

  const truncatedExcerpt = news.excerpt.length > 80 ? news.excerpt.substring(0, 80) + "..." : news.excerpt

  return (
    <div className={styles.newsCard}>
      {news.image ? (
        <div className={styles.newsImage}>
          <Image src={news.image || "/placeholder.svg"} alt={news.title} fill style={{ objectFit: "cover" }} />
        </div>
      ) : (
        <div className={styles.newsImagePlaceholder}>
          <span>📰</span>
        </div>
      )}
      <div className={styles.newsContent}>
        <h3 className={styles.newsTitle}>{news.title}</h3>
        <p className={styles.newsExcerpt}>{truncatedExcerpt}</p>
        <button className={styles.readMore} onClick={() => window.location.href = `/news?id=${news.id}`}>Read More →</button>
      </div>
    </div>
  )
}
