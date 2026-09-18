"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import styles from "./events.module.css"
import ShareButton from "@/components/ShareButton"
import LoadingState from "@/components/LoadingState"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  category: string
  registrationLink?: string
  isStaple?: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming")
  const [selectedStapleEvent, setSelectedStapleEvent] = useState<Event | null>(null)
  const [selectedRegularEvent, setSelectedRegularEvent] = useState<Event | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const now = new Date()
  const stapleEvents = events.filter((event) => event.isStaple)
  const upcomingEvents = events.filter((event) => !event.isStaple && new Date(event.date) >= now)
  const pastEvents = events.filter((event) => !event.isStaple && new Date(event.date) < now)
  const displayEvents = filter === "upcoming" ? upcomingEvents : pastEvents

  return (
    <>
      <div className={styles.eventsPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Lumyn Technologies Events
            </motion.h1>
            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              Join us for tech conferences, workshops, and innovation showcases
            </motion.p>
          </div>
        </section>

        <section className={styles.eventsSection}>
          <div className={styles.container}>
            {stapleEvents.length > 0 && (
              <div className={styles.stapleSection}>
                <motion.h2
                  className={styles.sectionTitle}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  Staple Events & Programs
                </motion.h2>
                <div className={styles.stapleContainer}>
                  <div className={styles.stapleGrid}>
                    {stapleEvents.map((event, index) => (
                      <motion.article
                        key={event.id}
                        className={styles.stapleCard}
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className={styles.stapleImageWrapper}>
                          <Image
                            src={event.image || "/placeholder.svg?height=300&width=500&query=event"}
                            alt={event.title}
                            fill
                            className={styles.stapleImage}
                          />
                          <span className={styles.stapleCategory}>{event.category}</span>
                        </div>
                        <div className={styles.stapleContent}>
                          <h3 className={styles.stapleTitle}>{event.title}</h3>
                          <p className={styles.stapleDescription}>{event.description}</p>
                          {event.registrationLink ? (
                            <a
                              href={event.registrationLink}
                              className={styles.stapleReadMore}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Register
                            </a>
                          ) : (
                            <button className={styles.stapleReadMore} onClick={() => setSelectedStapleEvent(event)}>
                              Read More
                            </button>
                          )}
                        </div>
                      </motion.article>
                    ))}
                  </div>
                  {selectedStapleEvent && (
                    <AnimatePresence>
                      <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedStapleEvent(null)}
                      >
                        <motion.div
                          className={styles.stapleDetailCard}
                          initial={{ opacity: 0, y: 40, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 24, scale: 0.98 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className={styles.detailClose} onClick={() => setSelectedStapleEvent(null)}>
                            ×
                          </button>
                          <div className={styles.detailImageWrapper}>
                            <Image
                              src={selectedStapleEvent.image || "/placeholder.svg?height=300&width=500&query=event"}
                              alt={selectedStapleEvent.title}
                              fill
                              className={styles.detailImage}
                            />
                          </div>
                          <div className={styles.detailBody}>
                            <h3 className={styles.detailTitle}>{selectedStapleEvent.title}</h3>
                            <p className={styles.detailDescription}>{selectedStapleEvent.description}</p>
                            <div className={styles.detailDetails}>
                              <div className={styles.detailDetail}>
                                <span className={styles.detailIcon}>📅</span>
                                <span>{new Date(selectedStapleEvent.date).toLocaleDateString()}</span>
                              </div>
                              <div className={styles.detailDetail}>
                                <span className={styles.detailIcon}>🕒</span>
                                <span>{selectedStapleEvent.time}</span>
                              </div>
                              <div className={styles.detailDetail}>
                                <span className={styles.detailIcon}>📍</span>
                                <span>{selectedStapleEvent.location}</span>
                              </div>
                              <div className={styles.detailDetail}>
                                <span className={styles.detailIcon}>🏷️</span>
                                <span>{selectedStapleEvent.category}</span>
                              </div>
                            </div>
                            <div className={styles.shareSection}>
                              <ShareButton
                                title={selectedStapleEvent.title}
                                text={`Join us for ${selectedStapleEvent.title} at ${selectedStapleEvent.location} on ${new Date(selectedStapleEvent.date).toLocaleDateString()}`}
                                image={selectedStapleEvent.image}
                              />
                            </div>
                            {selectedStapleEvent.registrationLink && (
                              <a
                                href={selectedStapleEvent.registrationLink}
                                className={styles.detailRegisterBtn}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Register Now
                              </a>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            )}

            <div className={styles.filterBar}>
              <motion.button
                className={`${styles.filterBtn} ${filter === "upcoming" ? styles.filterBtnActive : ""}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0 * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming Events ({upcomingEvents.length})
              </motion.button>
              <motion.button
                className={`${styles.filterBtn} ${filter === "past" ? styles.filterBtnActive : ""}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1 * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setFilter("past")}
              >
                Past Events ({pastEvents.length})
              </motion.button>
            </div>

            {loading ? (
              <LoadingState variant="page" label="Loading events" />
            ) : displayEvents.length === 0 ? (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3>No {filter} events</h3>
                <p>
                  {filter === "upcoming"
                    ? "Check back soon for upcoming events"
                    : "No past events to display at this time"}
                </p>
              </motion.div>
            ) : (
              <div className={styles.eventsGrid}>
                {displayEvents.map((event, index) => (
                  <motion.article
                    key={event.id}
                    className={styles.stapleCard}
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.stapleImageWrapper}>
                      <Image
                        src={event.image || "/placeholder.svg?height=300&width=500&query=event"}
                        alt={event.title}
                        fill
                        className={styles.stapleImage}
                      />
                      <span className={styles.stapleCategory}>{event.category}</span>
                    </div>
                    <div className={styles.stapleContent}>
                      <h3 className={styles.stapleTitle}>{event.title}</h3>
                      <p className={styles.stapleDescription}>{event.description}</p>
                      {event.registrationLink && filter === "upcoming" ? (
                        <a
                          href={event.registrationLink}
                          className={styles.stapleReadMore}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register
                        </a>
                      ) : (
                        <button className={styles.stapleReadMore} onClick={() => setSelectedRegularEvent(event)}>
                          Read More
                        </button>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {selectedRegularEvent && (
          <AnimatePresence>
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRegularEvent(null)}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.modalClose} onClick={() => setSelectedRegularEvent(null)}>
                  ×
                </button>
                <div className={styles.modalImageWrapper}>
                  <Image
                    src={selectedRegularEvent.image || "/placeholder.svg?height=300&width=500&query=event"}
                    alt={selectedRegularEvent.title}
                    fill
                    className={styles.modalImage}
                  />
                </div>
                <div className={styles.modalBody}>
                  <h3 className={styles.modalTitle}>{selectedRegularEvent.title}</h3>
                  <p className={styles.modalDescription}>{selectedRegularEvent.description}</p>
                  <div className={styles.modalDetails}>
                    <div className={styles.modalDetail}>
                      <span className={styles.detailIcon}>📅</span>
                      <span>{new Date(selectedRegularEvent.date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.modalDetail}>
                      <span className={styles.detailIcon}>🕒</span>
                      <span>{selectedRegularEvent.time}</span>
                    </div>
                    <div className={styles.modalDetail}>
                      <span className={styles.detailIcon}>📍</span>
                      <span>{selectedRegularEvent.location}</span>
                    </div>
                    <div className={styles.modalDetail}>
                      <span className={styles.detailIcon}>🏷️</span>
                      <span>{selectedRegularEvent.category}</span>
                    </div>
                  </div>
                  <div className={styles.shareSection}>
                    <ShareButton
                      title={selectedRegularEvent.title}
                      text={`Join us for ${selectedRegularEvent.title} at ${selectedRegularEvent.location} on ${new Date(selectedRegularEvent.date).toLocaleDateString()}`}
                      image={selectedRegularEvent.image}
                    />
                  </div>
                  {selectedRegularEvent.registrationLink && filter === "upcoming" && (
                    <a
                      href={selectedRegularEvent.registrationLink}
                      className={styles.modalRegisterBtn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  )
}
