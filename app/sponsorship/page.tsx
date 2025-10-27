"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import styles from "./sponsorship.module.css"

interface SponsorshipTier {
  id: string
  name: string
  amount: string
  color: string
  benefits: string[]
}

const sponsorshipTiers: SponsorshipTier[] = [
  {
    id: "supporter",
    name: "Supporter",
    amount: "$100",
    color: "#051F20",
    benefits: [
      "Recognition on KESA's social media platforms",
      "A personalized thank-you email from the KESA board",
      "Invitation to attend one of our general meetings or events",
    ],
  },
  {
    id: "advocate",
    name: "Advocate",
    amount: "$250",
    color: "#0B2B26",
    benefits: [
      "All benefits from the Supporter level",
      "Logo or name featured on event flyers and promotional materials",
      "Verbal recognition at one of our major events",
    ],
  },
  {
    id: "partner",
    name: "Partner",
    amount: "$500",
    color: "#163832",
    benefits: [
      "All benefits from the Advocate level",
      "Logo or name featured on KESA's website and newsletters",
      "Opportunity to showcase your business or organization at a KESA event",
      "Special recognition at both Fall and Spring Kickoff events",
    ],
  },
  {
    id: "custom",
    name: "Custom Sponsorship",
    amount: "Open",
    color: "#235347",
    benefits: [
      "Open contributions of any amount",
      "Discussion of aligned sponsorship opportunities",
      "In-kind donations, services, or monetary contributions",
      "Support to help KESA grow and thrive",
    ],
  },
]

export default function SponsorshipPage() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.2 },
    )

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Sponsorship Opportunities | Kenyan Student Association - University of Minnesota</title>
        <meta
          name="description"
          content="Partner with the Kenyan Student Association at the University of Minnesota. Support our mission and gain recognition through various sponsorship levels."
        />
        <meta name="keywords" content="KESA, Kenyan Student Association, sponsorship, partner, support, University of Minnesota, student organization" />
        <meta property="og:title" content="Sponsorship Opportunities | Kenyan Student Association - University of Minnesota" />
        <meta
          property="og:description"
          content="Partner with the Kenyan Student Association at the University of Minnesota. Support our mission and gain recognition through various sponsorship levels."
        />
        <meta property="og:url" content="https://kesa-umn.vercel.app/sponsorship" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sponsorship Opportunities | Kenyan Student Association - University of Minnesota" />
        <meta
          name="twitter:description"
          content="Partner with the Kenyan Student Association at the University of Minnesota. Support our mission and gain recognition through various sponsorship levels."
        />
        <link rel="canonical" href="https://kesa-umn.vercel.app/sponsorship" />
      </Head>
      <div className={styles.sponsorshipPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Partner With KESA</h1>
            <p className={styles.heroSubtitle}>
              Support our mission of fostering inclusivity, academic excellence, and leadership development
            </p>
            <p className={styles.heroDescription}>
              Your sponsorship will make a significant impact on the lives of students at the University of Minnesota
            </p>
          </div>
        </section>

      {/* Sponsorship Tiers Section */}
      <section className={styles.tiersSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Sponsorship Opportunities</h2>
          <p className={styles.sectionDescription}>
            Choose a sponsorship level that aligns with your organization's goals and budget
          </p>

          <div className={styles.tiersContainer}>
            {sponsorshipTiers.map((tier, index) => (
              <div
                key={tier.id}
                id={tier.id}
                ref={(el) => {
                  cardRefs.current[tier.id] = el
                }}
                className={`${styles.tierCard} ${visibleCards.has(tier.id) ? styles.visible : ""}`}
                style={{
                  backgroundColor: tier.color,
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div className={styles.tierHeader}>
                  <h3 className={styles.tierName}>{tier.name}</h3>
                  <p className={styles.tierAmount}>{tier.amount}</p>
                </div>
                <ul className={styles.benefitsList}>
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className={styles.benefitItem}>
                      <span className={styles.checkmark}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Sponsor Section */}
      <section className={styles.howToSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How to Become a Sponsor</h2>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Complete the Form</h3>
              <p className={styles.stepDescription}>
                Fill out our sponsorship application form with your organization details and preferred sponsorship level
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Send Contribution</h3>
              <p className={styles.stepDescription}>
                Financial contributions can be sent via CashApp ($kesaumn) or mailed to our address
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Get Recognition</h3>
              <p className={styles.stepDescription}>
                Receive your sponsorship benefits and recognition across our platforms and events
              </p>
            </div>
          </div>

          <div className={styles.ctaContainer}>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdnkGYfBO2rlcPkhxdKAOpVZjEEXryrgmWhVxuq7Ajvhget0w/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Apply for Sponsorship
            </a>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Mailing Address</h3>
              <p className={styles.contactText}>
                Kenyan Student Association (KESA)
                <br />
                University of Minnesota
                <br />
                326 SE 17th Ave, 446
                <br />
                Minneapolis, MN 55414
              </p>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Contact Information</h3>
              <p className={styles.contactText}>
                <strong>President:</strong> Rachael Omoke
                <br />
                <a href="mailto:omoke005@umn.edu" className={styles.contactLink}>
                  omoke005@umn.edu
                </a>
              </p>
              <p className={styles.contactText}>
                <strong>General Inquiries:</strong>
                <br />
                <a href="mailto:kesa@umn.edu" className={styles.contactLink}>
                  kesa@umn.edu
                </a>
              </p>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Payment Options</h3>
              <p className={styles.contactText}>
                <strong>CashApp:</strong> $kesaumn
              </p>
              <p className={styles.contactText}>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://www.instagram.com/kesaumn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  @kesaumn
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to Make an Impact?</h2>
          <p className={styles.ctaDescription}>
            Join us in supporting the next generation of Kenyan leaders at the University of Minnesota
          </p>
          <div className={styles.ctaButtons}>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdnkGYfBO2rlcPkhxdKAOpVZjEEXryrgmWhVxuq7Ajvhget0w/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Become a Sponsor
            </a>
            <Link href="/contact" className={styles.secondaryButton}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
