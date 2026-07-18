"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
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
  projects: number
}

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [stats, setStats] = useState<Stats>({ members: 0, events: 0, news: 0, yearsActive: 1, projects: 0 })
  const [loading, setLoading] = useState(true)
  const [countersStarted, setCountersStarted] = useState(false)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 1000], [0, 300])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const statsSectionRef = useRef<HTMLDivElement>(null)

  const parallaxY = useSpring(heroY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsRes = await fetch("/api/events")
        const eventsData = await eventsRes.json()
        const upcoming = eventsData.filter((event: Event) => new Date(event.date) >= new Date()).slice(0, 3)
        setUpcomingEvents(upcoming)

        const newsRes = await fetch("/api/news")
        const newsData = await newsRes.json()
        setLatestNews(newsData.slice(0, 3))

        setStats(prev => ({
          ...prev,
          events: eventsData.length,
          news: newsData.length,
          projects: 50,
          members: 2000
        }))
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Intersection Observer for stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersStarted) {
          setCountersStarted(true)
        }
      },
      { threshold: 0.3 }
    )

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current)
    }

    return () => observer.disconnect()
  }, [countersStarted])

  const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!countersStarted) return

      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }, [countersStarted, value])

    return <span>{count}{suffix}</span>
  }

  return (
    <div className={styles.homePage}>
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Animated Mesh Gradient Background */}
        <div className={styles.heroBackground}>
          <motion.div
            className={styles.gradientOrb1}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className={styles.gradientOrb2}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className={styles.gradientOrb3}
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating UI Elements */}
        <motion.div
          className={styles.floatingElement1}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.floatingElement2}
          animate={{
            y: [0, 25, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.floatingElement3}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className={styles.heroContent}
          style={{ y: parallaxY, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className={styles.badgeDot} />
            <span>Redefining Digital Innovation</span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Building Tomorrow&apos;s
            <br />
            <span className={styles.titleGradient}>Technology</span>
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Lumyn is a global technology company crafting
            <br />
            <span className={styles.highlight}>enterprise-grade solutions</span> that
            <br />
            transform industries and shape the future.
          </motion.p>

          <motion.div
            className={styles.heroButtons}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/get-started" className={styles.primaryButton}>
              <span>Start Building</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/projects" className={styles.secondaryButton}>
              <span>View Our Work</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection} ref={statsSectionRef}>
        <div className={styles.container}>
          <motion.div
            className={styles.statsGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { number: stats.projects, label: "Projects Delivered", suffix: "+" },
              { number: stats.members, label: "Team Members", suffix: "+" },
              { number: stats.events, label: "Events Hosted", suffix: "+" },
              { number: stats.yearsActive, label: "Years of Innovation", suffix: "+" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <div className={styles.statIconWrapper}>
                  <div className={styles.statIcon}>
                    {index === 0 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M3 9h18"/>
                        <path d="M9 21V9"/>
                      </svg>
                    )}
                    {index === 1 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    )}
                    {index === 2 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    )}
                    {index === 3 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    )}
                  </div>
                </div>
                <h3 className={styles.statNumber}>
                  {countersStarted ? <AnimatedCounter value={stat.number} suffix={stat.suffix} /> : "0" + stat.suffix}
                </h3>
                <p className={styles.statLabel}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.aboutContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className={styles.sectionLabel}>About Us</span>
              <h2 className={styles.sectionTitle}>
                Pioneering the Future of
                <br />
                <span className={styles.titleLight}>Digital Innovation</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                We&apos;re a global technology company built on innovation, excellence, and the relentless pursuit of groundbreaking solutions.
              </p>
            </motion.div>

            <div className={styles.aboutFeatures}>
              {[
                {
                  title: "Enterprise Solutions",
                  description: "Scalable architecture built for global enterprises with mission-critical requirements."
                },
                {
                  title: "Cutting-Edge Technology",
                  description: "Leveraging AI, cloud-native architectures, and modern development practices."
                },
                {
                  title: "Global Impact",
                  description: "Trusted by industry leaders across continents to drive digital transformation."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={styles.featureCard}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.15, duration: 0.8 }}
                >
                  <div className={styles.featureIcon}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2L2 7L14 12L26 7L14 2Z"/>
                      <path d="M2 17L14 22L26 17"/>
                      <path d="M2 12L14 17L26 12"/>
                    </svg>
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.sectionLabel}>What We Do</span>
            <h2 className={styles.sectionTitle}>
              Comprehensive Technology
              <br />
              <span className={styles.titleLight}>Services</span>
            </h2>
          </motion.div>

          <div className={styles.servicesGrid}>
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="24" height="24" rx="4"/>
                    <path d="M4 12H28"/>
                    <path d="M12 12V28"/>
                  </svg>
                ),
                title: "Launch",
                description: "Build stunning, high-performance websites and web applications with our cutting-edge platform.",
                color: "#6d8196"
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="16" cy="16" r="12"/>
                    <path d="M16 8V16L22 20"/>
                  </svg>
                ),
                title: "Market",
                description: "Launch and scale digital products with our comprehensive marketplace ecosystem.",
                color: "#ffffe3"
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 4L4 10V14L16 20L28 14V10L16 4Z"/>
                    <path d="M4 10L16 16"/>
                    <path d="M16 16V28"/>
                    <path d="M16 20L28 14"/>
                  </svg>
                ),
                title: "Studio",
                description: "Premium templates, assets, and tools for creators and developers worldwide.",
                color: "#cbcbcb"
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 8L24 24"/>
                    <path d="M24 8L8 24"/>
                    <circle cx="16" cy="16" r="10"/>
                  </svg>
                ),
                title: "Hire",
                description: "Connect with top talent and discover opportunities in our global network.",
                color: "#6d8196"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className={styles.serviceCardInner}>
                  <div className={styles.serviceIcon} style={{ color: service.color }}>
                    {service.icon}
                  </div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                  <Link href={`/${service.title.toLowerCase()}`} className={styles.serviceLink}>
                    Explore <span>→</span>
                  </Link>
                </div>
                <div className={styles.serviceGlow} style={{ background: `${service.color}20` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

       {/* News Section */}
       <section className={styles.projectsSection}>
         <div className={styles.container}>
           <motion.div
             className={styles.sectionHeader}
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
             <span className={styles.sectionLabel}>Latest News</span>
             <h2 className={styles.sectionTitle}>
               Stay Updated
               <br />
               <span className={styles.titleLight}>With Lumyn</span>
             </h2>
           </motion.div>

           <div className={styles.projectsGrid + " " + styles.mobileSwipeGrid}>
             {loading ? (
               [1, 2, 3].map((i) => (
                 <div key={i} className={styles.projectCardSkeleton}>
                   <div className={styles.skeletonImage} />
                   <div className={styles.skeletonContent}>
                     <div className={styles.skeletonTitle} />
                     <div className={styles.skeletonDesc} />
                   </div>
                 </div>
               ))
             ) : latestNews.length > 0 ? (
               latestNews.map((news, index) => (
                 <motion.div
                   key={news.id}
                   className={styles.projectCard}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.15, duration: 0.8 }}
                   whileHover={{ y: -12, transition: { duration: 0.4 } }}
                 >
                   <div className={styles.projectImageWrapper}>
                     {news.image ? (
                       <Image
                         src={news.image}
                         alt={news.title}
                         fill
                         className={styles.projectImage}
                       />
                     ) : (
                       <div className={styles.projectPlaceholder}>
                         <span>L</span>
                       </div>
                     )}
                   <div className={styles.projectOverlay}>
                     <Link href={`/news/${news.id}`} className={styles.projectView}>
                       Read More
                     </Link>
                   </div>
                   </div>
                   <div className={styles.projectContent}>
                     <h3 className={styles.projectTitle}>{news.title}</h3>
                     <p className={styles.projectExcerpt}>{news.excerpt}</p>
                   </div>
                 </motion.div>
               ))
             ) : (
               <div className={styles.noProjects}>
                 <p>No news available</p>
               </div>
             )}
           </div>

           <motion.div
             className={styles.viewAllContainer}
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.5 }}
           >
             <Link href="/news" className={styles.viewAllButton}>
               View All News <span>→</span>
             </Link>
           </motion.div>
         </div>
       </section>

      {/* Events Section */}
      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.sectionLabel}>Events</span>
            <h2 className={styles.sectionTitle}>
              Upcoming
              <br />
              <span className={styles.titleLight}>Events</span>
            </h2>
          </motion.div>

          <div className={styles.eventsGrid + " " + styles.mobileSwipeGrid}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className={styles.eventCard}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.7 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className={styles.eventDateBadge}>
                    <span className={styles.eventDay}>
                      {new Date(event.date).getDate()}
                    </span>
                    <span className={styles.eventMonth}>
                      {new Date(event.date).toLocaleString("en-US", { month: "short" }).toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.eventImageWrapper}>
                    {event.image && (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className={styles.eventImage}
                      />
                    )}
                  </div>
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventExcerpt}>
                      {event.description.length > 100
                        ? event.description.substring(0, 100) + "..."
                        : event.description}
                    </p>
                    <Link href={`/events?id=${event.id}`} className={styles.eventLink}>
                      Learn More <span>→</span>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className={styles.noEvents}>
                <p>No upcoming events. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaGlow1} />
          <div className={styles.ctaGlow2} />
        </div>

        <div className={styles.container}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.ctaTitle}>
              Ready to Transform
              <br />
              <span className={styles.titleLight}>Your Vision?</span>
            </h2>
            <p className={styles.ctaText}>
              Partner with Lumyn and let&apos;s build the future together.
              <br />
              <span className={styles.ctaHighlight}>We turn ambitious ideas into reality.</span>
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className={styles.ctaPrimaryButton}>
                <span>Start a Project</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/about" className={styles.ctaSecondaryButton}>
                Learn About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Keep existing EventCard and NewsCard helper components
function EventCard({ event }: { event?: Event }) {
  if (!event) {
    return (
      <div className={styles.eventCard}>
        <div className={styles.eventImageWrapper}>
          <div className={styles.eventPlaceholder}>
            <span>📅</span>
          </div>
        </div>
        <div className={styles.eventContent}>
          <h3 className={styles.eventTitle}>No upcoming events</h3>
          <p className={styles.eventExcerpt}>Check back soon for upcoming events</p>
          <Link href="/events" className={styles.eventLink}>Learn More</Link>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)

  return (
    <div className={styles.eventCard}>
      <div className={styles.eventDateBadge}>
        <span className={styles.eventDay}>{eventDate.getDate()}</span>
        <span className={styles.eventMonth}>
          {eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase()}
        </span>
      </div>
      <div className={styles.eventImageWrapper}>
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill style={{ objectFit: "cover" }} />
      </div>
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventExcerpt}>
          {event.description.length > 100 ? event.description.substring(0, 100) + "..." : event.description}
        </p>
        <Link href={`/events?id=${event.id}`} className={styles.eventLink}>Learn More</Link>
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
          <h3 className={styles.newsTitle}>No news available</h3>
          <p className={styles.newsExcerpt}>Check back soon for the latest updates</p>
          <Link href="/news" className={styles.readMore}>Learn More</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.newsCard}>
      <div className={styles.newsImageWrapper}>
        {news.image ? (
          <Image src={news.image} alt={news.title} fill style={{ objectFit: "cover" }} />
        ) : (
          <div className={styles.newsImagePlaceholder}>
            <span>📰</span>
          </div>
        )}
      </div>
      <div className={styles.newsContent}>
        <h3 className={styles.newsTitle}>{news.title}</h3>
        <p className={styles.newsExcerpt}>
          {news.excerpt.length > 100 ? news.excerpt.substring(0, 100) + "..." : news.excerpt}
        </p>
        <Link href={`/news?id=${news.id}`} className={styles.readMore}>Learn More</Link>
      </div>
    </div>
  )
}

