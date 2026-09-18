"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion"
import styles from "./page.module.css"

interface Event { id: string; title: string; description: string; date: string; location: string; image: string }
interface News { id: string; title: string; excerpt: string; image?: string; publishedAt: string }
interface Stats { members: number; events: number; news: number; yearsActive: number; projects: number }

const services = [
  { number: "01", title: "Strategy & Product", description: "Turn sharp ideas into clear roadmaps, useful experiences, and products people can actually use.", href: "/services" },
  { number: "02", title: "Web & Digital Products", description: "Design and engineer fast, accessible websites and platforms that scale with your ambitions.", href: "/services" },
  { number: "03", title: "Platforms & Infrastructure", description: "Build reliable cloud systems, APIs, data foundations, and operations for lasting growth.", href: "/services" },
  { number: "04", title: "Growth & Support", description: "Measure what matters, improve every release, and keep your digital presence moving forward.", href: "/services" },
]

const principles = [
  { title: "Technology", description: "We build reliable systems with the speed and clarity modern teams need." },
  { title: "Design", description: "We make complex products feel direct, useful, and unmistakably human." },
  { title: "Community", description: "We create more opportunity by connecting African talent with the wider world." },
]

const heroLines = [
  { text: "Build what", className: "" },
  { text: "comes next.", className: styles.outline },
  { text: "Together.", className: styles.orange },
]

const tickerItems = ["Build with intent", "Digital products", "African imagination", "Useful technology", "Ideas into motion"]

const easeOutExpo = (value: number) => value === 1 ? 1 : 1 - Math.pow(2, -10 * value)

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value)
      return
    }

    if (!isInView) {
      setDisplay(0)
      return
    }

    let frame = 0
    const startedAt = performance.now()
    const duration = 1300
    const update = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      setDisplay(Math.round(value * easeOutExpo(progress)))
      if (progress < 1) frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [isInView, reducedMotion, value])

  return <span ref={ref}>{display}</span>
}

function CapabilityLink({ service, index }: { service: typeof services[number]; index: number }) {
  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`)
  }

  return (
    <motion.div
      className={styles.capabilityMotion}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={service.href} className={styles.capability} onPointerMove={handlePointerMove}>
        <span className={styles.capabilityNumber}>{service.number}</span>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
    </motion.div>
  )
}

function PrincipleCard({ principle, index }: { principle: typeof principles[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    rotateX.set(-y * 8)
    rotateY.set(x * 8)
  }

  const handlePointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.article
      ref={ref}
      className={styles.principle}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className={styles.swatch}>{String(index + 1).padStart(2, "0")}</span>
      <h3>{principle.title}</h3>
      <p>{principle.description}</p>
      <span className={styles.cardSignal} aria-hidden="true" />
    </motion.article>
  )
}

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [stats, setStats] = useState<Stats>({ members: 0, events: 0, news: 0, yearsActive: 1, projects: 50 })
  const [loading, setLoading] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -28])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.99])

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

  const updateHeroPointer = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`)
  }

  return (
    <main className={styles.homePage}>
      <section ref={heroRef} className={styles.hero} onPointerMove={updateHeroPointer}>
        <div className={styles.heroBackdrop} aria-hidden="true">
          <div className={styles.heroGrid} />
          <div className={`${styles.orb} ${styles.orbOne}`} />
          <div className={`${styles.orb} ${styles.orbTwo}`} />
          <div className={styles.heroPointerGlow} />
          <div className={styles.heroScanline} />
        </div>

        <motion.div className={styles.heroContent} style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}>
          <div className={styles.heroEyebrow}>
            <span /> Independent technology company · Nairobi / Everywhere
          </div>
          <h1 aria-label="Build what comes next. Together.">
            {heroLines.map((line, index) => (
              <span
                className={`${styles.heroLine} ${line.className}`}
                key={line.text}
                style={{ animationDelay: `${0.05 + index * 0.1}s` }}
              >
                <span>{line.text}</span>
              </span>
            ))}
          </h1>
          <div className={styles.heroLower}>
            <p>We design and build digital platforms, products, and opportunities for African creators and ambitious businesses.</p>
            <div className={styles.actions}><Link href="/get-started" className={styles.primaryButton}>Start a project <span>↗</span></Link><Link href="/projects" className={styles.secondaryButton}>Explore our work</Link></div>
          </div>
        </motion.div>

        <div className={styles.stats} aria-label="Lumyn at a glance">
          {[[stats.projects, "+", "Projects delivered"], [stats.members, "+", "Creators reached"], [stats.events, "+", "Events hosted"], [stats.yearsActive, "+", "Years building"]].map(([value, suffix, label]) => <div className={styles.stat} key={label as string}><strong><AnimatedNumber value={value as number} /><sup>{suffix as string}</sup></strong><span>{label}</span></div>)}
        </div>

        <div className={styles.scrollCue} aria-hidden="true"><span /></div>
      </section>

      <div className={styles.ticker} aria-label="Lumyn principles">
        <div className={styles.tickerTrack}>
          {[...tickerItems, ...tickerItems].map((item, index) => <span key={`${item}-${index}`}>{item}<b aria-hidden="true">•</b></span>)}
        </div>
      </div>

      <motion.section className={styles.section} id="services" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <div className={styles.sectionHeading}><motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}><span className={styles.kicker}>01 / What we do</span><h2>Services built<br />to move.</h2></motion.div><motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>From strategy to infrastructure, we help ambitious teams turn ideas into useful digital work that keeps moving forward.</motion.p></div>
        <div className={styles.capabilities}>{services.map((service, index) => <CapabilityLink service={service} index={index} key={service.number} />)}</div>
      </motion.section>

      <motion.section className={`${styles.section} ${styles.offWhite}`} id="about" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <div className={styles.sectionHeading}><motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}><span className={styles.kicker}>02 / Who we are</span><h2>Useful by<br />design.</h2></motion.div><motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>Technology should open doors. Our work brings product thinking, creative craft, and community into the same room.</motion.p></div>
        <div className={styles.principles}>{principles.map((principle, index) => <PrincipleCard principle={principle} index={index} key={principle.title} />)}</div>
      </motion.section>

      <motion.section className={styles.section} id="insights" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <div className={styles.sectionHeading}><motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}><span className={styles.kicker}>03 / From Lumyn</span><h2>Ideas in<br />motion.</h2></motion.div><Link href="/news" className={styles.textLink}>View all insights ↗</Link></div>
        <div className={styles.insights}>{loading ? [1, 2, 3].map((item) => <motion.div className={styles.skeleton} key={item} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, repeat: Infinity, repeatType: "mirror", delay: item * 0.12 }} />) : latestNews.length ? latestNews.map((news, index) => <motion.article className={styles.insight} key={news.id} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}>{news.image ? <div className={styles.insightImage}><Image src={news.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div> : <div className={styles.insightPlaceholder}>L</div>}<div className={styles.insightBody}><span className={styles.kicker}>Insight</span><h3>{news.title}</h3><p>{news.excerpt}</p><Link href={`/news/${news.id}`} className={styles.textLink}>Read more ↗</Link></div></motion.article>) : <p>No insights available yet.</p>}</div>
      </motion.section>

      {upcomingEvents.length > 0 && <motion.section className={`${styles.section} ${styles.offWhite}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}><div className={styles.sectionHeading}><div><span className={styles.kicker}>04 / In the calendar</span><h2>Meet us<br />out there.</h2></div></div><div className={styles.eventList}>{upcomingEvents.map((event) => <Link href="/events" className={styles.event} key={event.id}><time>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time><strong>{event.title}</strong><span>{event.location} ↗</span></Link>)}</div></motion.section>}

      <motion.section className={styles.cta} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <div className={styles.ctaRings} aria-hidden="true"><span /><span /><span /></div>
        <motion.span className={styles.kicker} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>05 / Make it real</motion.span>
        <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>Have a big idea?<br /><span>Let&apos;s build it.</span></motion.h2>
        <motion.p initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}>Tell us where you want to go. We&apos;ll help you find the clearest way there.</motion.p>
        <motion.div className={styles.actions} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}><Link href="/get-started" className={styles.signalButton}>Start a conversation ↗</Link><Link href="/contact" className={styles.whiteButton}>Contact us</Link></motion.div>
      </motion.section>
    </main>
  )
}
