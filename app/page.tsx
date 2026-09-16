"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./page.module.css"

interface Event { id: string; title: string; description: string; date: string; location: string; image: string }
interface News { id: string; title: string; excerpt: string; image?: string; publishedAt: string }
interface Stats { members: number; events: number; news: number; yearsActive: number; projects: number }

const capabilities = [
  { number: "01", title: "Launch", description: "High-performance websites and digital products that move ideas into the world.", href: "/launch" },
  { number: "02", title: "Studio", description: "Premium templates, assets, and practical tools for ambitious creators.", href: "/studio" },
  { number: "03", title: "Market", description: "A focused marketplace for discovering, selling, and scaling digital work.", href: "/market" },
  { number: "04", title: "Hire", description: "A better way for talented people and growing teams to find each other.", href: "/hire" },
]

const principles = [
  { title: "Technology", description: "We build reliable systems with the speed and clarity modern teams need." },
  { title: "Design", description: "We make complex products feel direct, useful, and unmistakably human." },
  { title: "Community", description: "We create more opportunity by connecting African talent with the wider world." },
]

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [stats, setStats] = useState<Stats>({ members: 0, events: 0, news: 0, yearsActive: 1, projects: 50 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsResponse, newsResponse] = await Promise.all([fetch("/api/events"), fetch("/api/news")])
        const eventsData: Event[] = await eventsResponse.json()
        const newsData: News[] = await newsResponse.json()
        setUpcomingEvents(eventsData.filter((event) => new Date(event.date) >= new Date()).slice(0, 3))
        setLatestNews(newsData.slice(0, 3))
        setStats((current) => ({ ...current, events: eventsData.length, news: newsData.length }))
      } catch (error) { console.error("Failed to fetch homepage data:", error) } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroEyebrow}><span /> Independent technology company · Nairobi / Everywhere</div>
        <h1><span>Build what</span><span className={styles.outline}>comes next.</span><span className={styles.orange}>Together.</span></h1>
        <div className={styles.heroLower}><p>We design and build digital platforms, products, and opportunities for African creators and ambitious businesses.</p><div className={styles.actions}><Link href="/get-started" className={styles.primaryButton}>Start a project <span>↗</span></Link><Link href="/projects" className={styles.secondaryButton}>Explore our work</Link></div></div>
        <section className={styles.stats} aria-label="Lumyn at a glance">
          {[[stats.projects, "+", "Projects delivered"], [stats.members, "+", "Creators reached"], [stats.events, "+", "Events hosted"], [stats.yearsActive, "+", "Years building"]].map(([value, suffix, label]) => <div className={styles.stat} key={label as string}><strong>{value as number}{suffix as string}</strong><span>{label}</span></div>)}
        </section>
      </section>

      <div className={styles.ticker} aria-label="Lumyn principles">
        <div className={styles.tickerTrack}>
          {["Build with intent", "Digital products", "African imagination", "Useful technology", "Ideas into motion", "Build with intent", "Digital products", "African imagination", "Useful technology", "Ideas into motion"].map((item, index) => <span key={`${item}-${index}`}>{item}<b aria-hidden="true">•</b></span>)}
        </div>
      </div>

      <section className={styles.section} id="capabilities"><div className={styles.sectionHeading}><div><span className={styles.kicker}>01 / What we do</span><h2>Capabilities<br />with momentum.</h2></div><p>One connected ecosystem for turning sharp ideas into useful, lasting work.</p></div><div className={styles.capabilities}>{capabilities.map((capability) => <Link href={capability.href} className={styles.capability} key={capability.number}><span className={styles.capabilityNumber}>{capability.number}</span><h3>{capability.title}</h3><p>{capability.description}</p><span className={styles.arrow}>↗</span></Link>)}</div></section>

      <section className={`${styles.section} ${styles.offWhite}`} id="about"><div className={styles.sectionHeading}><div><span className={styles.kicker}>02 / Who we are</span><h2>Useful by<br />design.</h2></div><p>Technology should open doors. Our work brings product thinking, creative craft, and community into the same room.</p></div><div className={styles.principles}>{principles.map((principle, index) => <article key={principle.title}><span className={styles.swatch}>{String(index + 1).padStart(2, "0")}</span><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></section>

      <section className={styles.section} id="insights"><div className={styles.sectionHeading}><div><span className={styles.kicker}>03 / From Lumyn</span><h2>Ideas in<br />motion.</h2></div><Link href="/news" className={styles.textLink}>View all insights ↗</Link></div><div className={styles.insights}>{loading ? [1, 2, 3].map((item) => <div className={styles.skeleton} key={item} />) : latestNews.length ? latestNews.map((news) => <article className={styles.insight} key={news.id}>{news.image ? <div className={styles.insightImage}><Image src={news.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div> : <div className={styles.insightPlaceholder}>L</div>}<div className={styles.insightBody}><span className={styles.kicker}>Insight</span><h3>{news.title}</h3><p>{news.excerpt}</p><Link href={`/news/${news.id}`} className={styles.textLink}>Read more ↗</Link></div></article>) : <p>No insights available yet.</p>}</div></section>

      {upcomingEvents.length > 0 && <section className={`${styles.section} ${styles.offWhite}`}><div className={styles.sectionHeading}><div><span className={styles.kicker}>04 / In the calendar</span><h2>Meet us<br />out there.</h2></div></div><div className={styles.eventList}>{upcomingEvents.map((event) => <Link href="/events" className={styles.event} key={event.id}><time>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time><strong>{event.title}</strong><span>{event.location} ↗</span></Link>)}</div></section>}

      <section className={styles.cta}><span className={styles.kicker}>05 / Make it real</span><h2>Have a big idea?<br /><span>Let&apos;s build it.</span></h2><p>Tell us where you want to go. We&apos;ll help you find the clearest way there.</p><div className={styles.actions}><Link href="/get-started" className={styles.signalButton}>Start a conversation ↗</Link><Link href="/contact" className={styles.whiteButton}>Contact us</Link></div></section>
    </main>
  )
}
