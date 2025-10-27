"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import styles from "./faq.module.css"
import type { JSX } from "react/jsx-runtime"

interface Section {
  id: string
  title: string
  content: JSX.Element
}

export default function FAQPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const sections: Section[] = [
    {
      id: "about-kesa",
      title: "About KESA",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is KESA?</summary>
            <p className={styles.faqAnswer}>
              KESA (Kenyan Student Association) is a student organization at the University of Minnesota dedicated to
              fostering a vibrant community for Kenyan students and friends of Kenya. We celebrate Kenyan culture,
              promote academic excellence, and build lasting connections.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is KESA's mission?</summary>
            <p className={styles.faqAnswer}>
              Our mission is to unite and empower Kenyan youth by fostering a sense of community, academic excellence,
              cultural pride, and professional development among our members while preserving and celebrating our rich heritage.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>When was KESA founded?</summary>
            <p className={styles.faqAnswer}>
              KESA was established to serve the growing Kenyan student community at the University of Minnesota and
              continues to grow and evolve with the needs of our members.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "membership",
      title: "Membership",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How do I become a member of KESA?</summary>
            <p className={styles.faqAnswer}>
              Membership is free and open to all University of Minnesota students. Simply visit our membership page,
              fill out the application form, and submit it. You'll receive a confirmation email once your application is processed.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Is membership free?</summary>
            <p className={styles.faqAnswer}>
              Yes! KESA membership is completely free. We believe that access to our community and resources should be
              available to all students regardless of financial situation.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Who can join KESA?</summary>
            <p className={styles.faqAnswer}>
              Any current University of Minnesota student who is interested in Kenyan culture and community building
              is welcome to join. You don't need to be Kenyan or have Kenyan heritage to be a member.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What benefits do members receive?</summary>
            <p className={styles.faqAnswer}>
              Members get access to exclusive events, networking opportunities, mentorship programs, leadership
              development, cultural celebrations, and a supportive community of fellow students.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "events",
      title: "Events",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What types of events does KESA organize?</summary>
            <p className={styles.faqAnswer}>
              We organize cultural celebrations, networking events, social gatherings, academic workshops, community
              service activities, and professional development seminars throughout the academic year.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How do I find out about upcoming events?</summary>
            <p className={styles.faqAnswer}>
              Stay updated by subscribing to our newsletter, following us on social media (@kesaumn on Instagram),
              checking our events page regularly, or joining our mailing list.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do I need to be a member to attend events?</summary>
            <p className={styles.faqAnswer}>
              While membership provides priority access to some events, many of our events are open to the entire
              university community. Check individual event descriptions for registration requirements.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How do I register for events?</summary>
            <p className={styles.faqAnswer}>
              Event registration details are provided on our events page. Some events require advance registration
              through our website, while others are first-come, first-served.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "getting-involved",
      title: "Getting Involved",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How can I get more involved with KESA?</summary>
            <p className={styles.faqAnswer}>
              There are many ways to get involved! Join committees, volunteer for events, participate in leadership
              roles, contribute to our newsletter, or help with community outreach. Contact our leadership team to
              learn about current opportunities.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Are there leadership opportunities?</summary>
            <p className={styles.faqAnswer}>
              Yes! KESA offers various leadership positions including committee chairs, event coordinators,
              social media managers, and executive board roles. These positions help develop valuable skills for your
              future career.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Can I start my own initiative or event?</summary>
            <p className={styles.faqAnswer}>
              Absolutely! We encourage member-driven initiatives. If you have an idea for an event, workshop, or
              project that aligns with our mission, reach out to our leadership team to discuss how we can support it.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "contact-support",
      title: "Contact & Support",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How do I contact KESA?</summary>
            <p className={styles.faqAnswer}>
              You can reach us through our contact form on the website, email us at kesa@umn.edu, or connect with us
              on Instagram (@kesaumn). For specific inquiries, contact our president at omoke005@umn.edu.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Where is KESA located?</summary>
            <p className={styles.faqAnswer}>
              KESA operates primarily online and through campus events. Our mailing address is: Kenyan Student
              Association, University of Minnesota, 326 SE 17th Ave, 446, Minneapolis, MN 55414.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How can I provide feedback or suggestions?</summary>
            <p className={styles.faqAnswer}>
              We value your feedback! You can share suggestions through our contact form, email us directly, or
              participate in our member surveys and feedback sessions.
            </p>
          </details>
        </>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>FAQ | Kenyan Student Association - University of Minnesota</title>
        <meta
          name="description"
          content="Frequently asked questions about the Kenyan Student Association at the University of Minnesota. Learn about membership, events, and how to get involved."
        />
        <meta name="keywords" content="KESA, Kenyan Student Association, FAQ, frequently asked questions, membership, events, University of Minnesota" />
        <meta property="og:title" content="FAQ | Kenyan Student Association - University of Minnesota" />
        <meta
          property="og:description"
          content="Frequently asked questions about the Kenyan Student Association at the University of Minnesota."
        />
        <meta property="og:url" content="https://kesa-umn.vercel.app/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ | Kenyan Student Association - University of Minnesota" />
        <meta
          name="twitter:description"
          content="Frequently asked questions about the Kenyan Student Association at the University of Minnesota."
        />
        <link rel="canonical" href="https://kesa-umn.vercel.app/faq" />
      </Head>
      <div className={styles.faqPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
            <p className={styles.heroSubtitle}>Everything you need to know about KESA</p>
            <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.container}>
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el
                }}
                className={`${styles.sectionCard} ${visibleSections.has(section.id) ? styles.visible : ""}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <div className={styles.sectionContent}>{section.content}</div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
