"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import styles from "./terms.module.css"
import type { JSX } from "react/jsx-runtime" // Added import for JSX

interface Section {
  id: string
  title: string
  content: JSX.Element
}

export default function TermsPage() {
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
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: (
        <p className={styles.text}>
          By accessing and using the Kenyan Student Association (KESA) website and services, you accept and agree to be
          bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or
          services.
        </p>
      ),
    },
    {
      id: "membership",
      title: "2. Membership",
      content: (
        <>
          <h3 className={styles.subheading}>2.1 Eligibility</h3>
          <p className={styles.text}>
            Membership in KESA is open to all students at the University of Minnesota who are interested in Kenyan
            culture and community. You must be a current student to maintain active membership.
          </p>

          <h3 className={styles.subheading}>2.2 Membership Obligations</h3>
          <p className={styles.text}>As a member, you agree to:</p>
          <ul className={styles.list}>
            <li>Provide accurate and current information during registration</li>
            <li>Respect other members and maintain a welcoming community environment</li>
            <li>Follow the University of Minnesota's student conduct code</li>
            <li>Participate in good faith and support the organization's mission</li>
          </ul>

          <h3 className={styles.subheading}>2.3 Membership Termination</h3>
          <p className={styles.text}>
            KESA reserves the right to terminate or suspend membership for violations of these terms, university
            policies, or conduct detrimental to the organization.
          </p>
        </>
      ),
    },
    {
      id: "events",
      title: "3. Events and Activities",
      content: (
        <>
          <h3 className={styles.subheading}>3.1 Event Registration</h3>
          <p className={styles.text}>
            Registration for events is subject to availability. KESA reserves the right to cancel or modify events at
            any time. Registered participants will be notified of any changes.
          </p>

          <h3 className={styles.subheading}>3.2 Event Conduct</h3>
          <p className={styles.text}>Participants at KESA events must:</p>
          <ul className={styles.list}>
            <li>Behave respectfully toward all attendees, organizers, and venue staff</li>
            <li>Follow all venue rules and safety guidelines</li>
            <li>Refrain from harassment, discrimination, or disruptive behavior</li>
            <li>Comply with applicable laws and university policies</li>
          </ul>

          <h3 className={styles.subheading}>3.3 Photography and Media</h3>
          <p className={styles.text}>
            By attending KESA events, you consent to being photographed or recorded for promotional purposes. If you do
            not wish to be included in photos or videos, please inform event organizers.
          </p>
        </>
      ),
    },
    {
      id: "website",
      title: "4. Website Use",
      content: (
        <>
          <h3 className={styles.subheading}>4.1 Acceptable Use</h3>
          <p className={styles.text}>You agree not to:</p>
          <ul className={styles.list}>
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Interfere with or disrupt the website's functionality</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Impersonate others or misrepresent your affiliation with KESA</li>
          </ul>

          <h3 className={styles.subheading}>4.2 User Content</h3>
          <p className={styles.text}>
            If you submit content to our website (comments, photos, etc.), you grant KESA a non-exclusive, royalty-free
            license to use, reproduce, and display that content. You represent that you own or have permission to share
            any content you submit.
          </p>
        </>
      ),
    },
    {
      id: "intellectual",
      title: "5. Intellectual Property",
      content: (
        <p className={styles.text}>
          All content on the KESA website, including text, graphics, logos, images, and software, is the property of
          KESA or its content suppliers and is protected by copyright and intellectual property laws. You may not
          reproduce, distribute, or create derivative works without explicit permission.
        </p>
      ),
    },
    {
      id: "payments",
      title: "6. Payments and Refunds",
      content: (
        <>
          <h3 className={styles.subheading}>6.1 Event Fees</h3>
          <p className={styles.text}>
            Some events may require payment for registration. All fees must be paid in advance unless otherwise
            specified. Payment information is processed securely through third-party payment processors.
          </p>

          <h3 className={styles.subheading}>6.2 Refund Policy</h3>
          <p className={styles.text}>
            Refunds for event registrations are handled on a case-by-case basis. Requests must be submitted at least 48
            hours before the event. KESA reserves the right to deny refund requests.
          </p>
        </>
      ),
    },
    {
      id: "disclaimer",
      title: "7. Disclaimer of Warranties",
      content: (
        <p className={styles.text}>
          The KESA website and services are provided "as is" without warranties of any kind, either express or implied.
          We do not guarantee that the website will be uninterrupted, secure, or error-free.
        </p>
      ),
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      content: (
        <p className={styles.text}>
          To the fullest extent permitted by law, KESA shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of the website or participation in events.
        </p>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Terms and Conditions | Kenyan Student Association - University of Minnesota</title>
        <meta
          name="description"
          content="Read the terms and conditions for using the Kenyan Student Association website and participating in our events and services."
        />
        <meta name="keywords" content="KESA, Kenyan Student Association, terms and conditions, terms of use, University of Minnesota" />
        <meta property="og:title" content="Terms and Conditions | Kenyan Student Association - University of Minnesota" />
        <meta
          property="og:description"
          content="Read the terms and conditions for using the Kenyan Student Association website and participating in our events and services."
        />
        <meta property="og:url" content="https://kesa-umn.vercel.app/terms" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms and Conditions | Kenyan Student Association - University of Minnesota" />
        <meta
          name="twitter:description"
          content="Read the terms and conditions for using the Kenyan Student Association website and participating in our events and services."
        />
        <link rel="canonical" href="https://kesa-umn.vercel.app/terms" />
      </Head>
      <div className={styles.termsPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Terms and Conditions</h1>
            <p className={styles.heroSubtitle}>Please read these terms carefully before using our services</p>
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
