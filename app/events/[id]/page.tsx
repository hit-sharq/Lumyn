import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ShareButton from "@/components/ShareButton"
import styles from "../events.module.css"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const res = await fetch(`${BASE_URL}/api/events/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return { title: "Event | Lumyn" }
    const event: any = await res.json()
    const url = `${BASE_URL}/events/${id}`
    return {
      title: `${event.title} | Lumyn Events`,
      description: event.description.length > 160 ? event.description.substring(0, 157) + "..." : event.description,
      openGraph: {
        title: event.title,
        description: event.description.length > 160 ? event.description.substring(0, 157) + "..." : event.description,
        url,
        siteName: "Lumyn",
        type: "event",
        images: event.image ? [{ url: event.image, width: 1200, height: 630, alt: event.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: event.title,
        description: event.description.length > 160 ? event.description.substring(0, 157) + "..." : event.description,
        images: event.image ? [event.image] : undefined,
        creator: "@LumynTec",
      },
      alternates: { canonical: url },
    }
  } catch {
    return { title: "Event | Lumyn" }
  }
}

function EventJsonLd({ event, url }: { event: any; url: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: new Date(event.date).toISOString(),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location,
    },
    organizer: {
      "@type": "Organization",
      name: "Lumyn Technologies",
      url: BASE_URL,
    },
    url,
  }

  if (event.image) {
    jsonLd.image = event.image
  }

  if (event.registrationLink) {
    jsonLd.offers = {
      "@type": "Offer",
      url: event.registrationLink,
      price: "0",
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

async function getEvent(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/events/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const url = `${BASE_URL}/events/${id}`

  return (
    <div className={styles.eventsPage}>
      <EventJsonLd event={event} url={url} />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{event.title}</h1>
          <p className={styles.heroSubtitle}>{event.description}</p>
        </div>
      </section>

      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <div className={styles.stapleContainer}>
            <div className={styles.detailCard}>
              <div className={styles.detailImageWrapper}>
                <Image
                  src={event.image || "/placeholder.svg?height=400&width=800"}
                  alt={event.title}
                  fill
                  className={styles.detailImage}
                />
              </div>
              <div className={styles.detailBody}>
                <h3 className={styles.detailTitle}>{event.title}</h3>
                <p className={styles.detailDescription}>{event.description}</p>
                <div className={styles.detailDetails}>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>🕒</span>
                    <span>{event.time}</span>
                  </div>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>🏷️</span>
                    <span>{event.category}</span>
                  </div>
                </div>
                <div className={styles.shareSection}>
                  <ShareButton
                    title={event.title}
                    text={`Join us for ${event.title} at ${event.location} on ${new Date(event.date).toLocaleDateString()}`}
                    image={event.image}
                  />
                </div>
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    className={styles.detailRegisterBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register Now
                  </a>
                )}
              </div>
            </div>
          </div>
          <Link href="/events" className={styles.backLink} style={{ marginTop: 32, display: "inline-block" }}>
            ← Back to Events
          </Link>
        </div>
      </section>
    </div>
  )
}
