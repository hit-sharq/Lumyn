"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./about.module.css";
import type { JSX } from "react/jsx-runtime";
import { markdownToHtml } from "@/lib/markdown";
interface Section {
  id: string;
  title: string;
  content: JSX.Element;
}
interface Leader {
  id: string;
  name: string;
  position: string;
  role: string;
  imageUrl?: string;
  order: number;
}
export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLeaderId, setExpandedLeaderId] = useState<string | null>(null);
  const sectionRefs = useRef<{
    [key: string]: HTMLElement | null;
  }>({});
  const {
    scrollY
  } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 50;
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
        }
      });
    }, {
      threshold: 0.15
    });
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    async function fetchLeaders() {
      try {
        const response = await fetch('/api/leadership');
        if (response.ok) {
          const data = await response.json();
          setLeaders(data);
        }
      } catch (error) {
        console.error('Failed to fetch leadership team:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);
  const sections: Section[] = [{
    id: "introduction",
    title: "About Lumyn",
    content: <div className={styles.introGrid}>
          <div className={styles.introText}>
            <p className={styles.text}>
              Lumyn is a forward-thinking tech company that designs and develops modern, high-performance digital experiences.
              We blend creativity, strategy, and engineering to help brands shine online — from sleek websites to intelligent web applications.
            </p>
          </div>
          <div className={styles.introVisual}>
            <motion.div className={styles.floatingCard} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
              <div className={styles.floatingCardGlow}></div>
              <div className={styles.floatingCardContent}>
                <span className={styles.floatingIcon}>⚡</span>
                <span className={styles.floatingText}>Fast</span>
              </div>
            </motion.div>
            <motion.div className={styles.floatingCard} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }}>
              <div className={styles.floatingCardGlow}></div>
              <div className={styles.floatingCardContent}>
                <span className={styles.floatingIcon}>🎨</span>
                <span className={styles.floatingText}>Design</span>
              </div>
            </motion.div>
            <motion.div className={styles.floatingCard} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
              <div className={styles.floatingCardGlow}></div>
              <div className={styles.floatingCardContent}>
                <span className={styles.floatingIcon}>🔒</span>
                <span className={styles.floatingText}>Secure</span>
              </div>
            </motion.div>
          </div>
        </div>
  }, {
    id: "mission-vision",
    title: "Mission & Vision",
    content: <div className={styles.missionGrid}>
          <motion.div className={styles.missionCard} initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }}>
            <div className={styles.missionIcon}>🎯</div>
            <h3 className={styles.missionHeading}>Our Mission</h3>
            <p className={styles.text}>
              To empower businesses and individuals with elegant, efficient, and scalable digital solutions.
            </p>
          </motion.div>
          <motion.div className={styles.missionCard} initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5,
        delay: 0.1
      }}>
            <div className={styles.missionIcon}>🔭</div>
            <h3 className={styles.missionHeading}>Our Vision</h3>
            <p className={styles.text}>
              To become a trusted digital partner for startups and enterprises seeking innovation and impact.
            </p>
          </motion.div>
        </div>
  }, {
    id: "services",
    title: "What We Do",
    content: <motion.div className={styles.servicesGrid} initial="hidden" whileInView="visible" viewport={{
      once: true
    }}>
          {[{
        icon: "💻",
        title: "Web Design & Development",
        desc: "Creating beautiful, responsive websites that engage users and drive results"
      }, {
        icon: "🎯",
        title: "Branding & Strategy",
        desc: "Developing comprehensive digital strategies that align with your brand vision"
      }, {
        icon: "⚙️",
        title: "Full-Stack Apps",
        desc: "Building robust, scalable applications with modern technologies"
      }, {
        icon: "☁️",
        title: "Cloud & Hosting",
        desc: "Seamless cloud solutions for reliable, secure, and scalable hosting"
      }, {
        icon: "🛡️",
        title: "Security & Maintenance",
        desc: "Ongoing support, updates, and security monitoring"
      }].map((service, i) => <motion.div key={i} className={styles.serviceCard} initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.4,
        delay: i * 0.08
      }}>
              <span className={styles.serviceIcon}>{service.icon}</span>
              <h4 className={styles.serviceTitle}>{service.title}</h4>
              <p className={styles.serviceDesc}>{service.desc}</p>
            </motion.div>)}
        </motion.div>
  }, {
    id: "why-choose",
    title: "Why Choose Lumyn",
    content: <div className={styles.featureList}>
          {[{
        icon: "✨",
        title: "Modern Design",
        desc: "Clean design principles that prioritize user experience and visual appeal"
      }, {
        icon: "📈",
        title: "Scalable Tech",
        desc: "Modern technologies that grow with your business needs"
      }, {
        icon: "🔐",
        title: "Security First",
        desc: "Best practices for security and data protection"
      }, {
        icon: "🤝",
        title: "Client-First",
        desc: "Transparent communication and collaboration throughout every project"
      }, {
        icon: "✅",
        title: "Proven Results",
        desc: "Successfully launched numerous projects with measurable results"
      }].map((feature, i) => <motion.div key={i} className={styles.featureItem} initial={{
        opacity: 0,
        x: -30
      }} whileInView={{
        opacity: 1,
        x: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.4,
        delay: i * 0.08
      }}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            </motion.div>)}
        </div>
  }, {
    id: "team",
    title: "Our Team",
    content: <div style={{
      marginTop: '24px'
    }}>
          {loading ? <motion.div className={styles.loadingCard} initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }}>
              <div className={styles.spinner}></div>
              <p>Loading team members...</p>
            </motion.div> : leaders.length > 0 ? <motion.div className={styles.teamGrid} initial="hidden" whileInView="visible" viewport={{
        once: true
      }}>
              {leaders.map((leader, index) => <motion.div key={leader.id} className={styles.teamCard} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.08
        }} whileHover={{
          y: -8,
          transition: {
            duration: 0.2
          }
        }}>
                  <div className={styles.teamImageWrapper}>
                    {leader.imageUrl ? <Image src={leader.imageUrl} alt={leader.name} fill className={styles.teamImage} /> : <div className={styles.teamImagePlaceholder}>
                        <span>👤</span>
                      </div>}
                    <div className={styles.teamOverlay}></div>
                  </div>
                  <div className={styles.teamContent}>
                    <h3 className={styles.teamName}>{leader.name}</h3>
                    <p className={styles.teamPosition}>{leader.position}</p>
                    <div className={styles.teamBio} dangerouslySetInnerHTML={{
              __html: markdownToHtml(expandedLeaderId === leader.id || leader.role.length <= 150 ? leader.role : `${leader.role.slice(0, 150).trimEnd()}...`)
            }} />
                    {leader.role.length > 150 && <button type="button" className={styles.readMoreButton} onClick={() => setExpandedLeaderId(current => current === leader.id ? null : leader.id)}>
                        {expandedLeaderId === leader.id ? "Show less" : "Read more"}
                      </button>}
                  </div>
                </motion.div>)}
            </motion.div> : <motion.p className={styles.text} initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }}>
              Team members will be displayed here once added through the admin panel.
            </motion.p>}
          <div style={{
        marginTop: 32,
        textAlign: 'center'
      }}>
            <Link href="/team" className={styles.ctaButton}>
              Explore the full team page
            </Link>
          </div>
        </div>
  }];
  return <>
      <Head>
        <title>About Lumyn | Modern Digital Solutions Company</title>
        <meta name="description" content="Learn about Lumyn, a forward-thinking tech company specializing in modern digital solutions, web development, and innovative technology." />
        <meta name="keywords" content="Lumyn, digital solutions, web development, tech company, software engineering, digital strategy" />
        <meta property="og:title" content="About Lumyn | Modern Digital Solutions Company" />
        <meta name="og:description" content="Learn about Lumyn, a forward-thinking tech company specializing in modern digital solutions, web development, and innovative technology." />
        <meta property="og:url" content="https://www.lumyn.co.ke/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Lumyn | Modern Digital Solutions Company" />
        <meta name="twitter:description" content="Learn about Lumyn, a forward-thinking tech company specializing in modern digital solutions, web development, and innovative technology." />
        <link rel="canonical" href="https://www.lumyn.co.ke/about" />
      </Head>

      <div className={styles.aboutPage}>
        {/* Hero Section */}
        <motion.section className={styles.hero} style={{
        y: heroY,
        opacity: heroOpacity,
        scale: heroScale
      }}>
          {/* Animated Background */}
          <div className={styles.heroBg}>
            <div className={styles.gradientOrb1}></div>
            <div className={styles.gradientOrb2}></div>
            <div className={styles.gradientOrb3}></div>
          </div>

          <div className={styles.heroContent}>
            <motion.h1 className={styles.heroTitle} initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              About Lumyn
            </motion.h1>
            <motion.p className={styles.heroSubtitle} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }}>
              Forward-thinking tech company crafting digital experiences
            </motion.p>
            <motion.p className={styles.heroDescription} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              Empowering businesses with innovative technology since 2024
            </motion.p>
          </div>
        </motion.section>

        {/* Content Sections */}
        <section className={styles.contentSection}>
          <div className={styles.container}>
            {sections.map((section, index) => <section key={section.id} id={section.id} ref={el => {
            sectionRefs.current[section.id] = el;
          }} className={`${styles.sectionWrapper} ${visibleSections.has(section.id) ? styles.visible : ""}`} style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <div className={styles.sectionLine}></div>
                </div>
                <div className={styles.sectionContent}>
                  {section.content}
                </div>
              </section>)}

            {/* CTA */}
            <motion.div className={styles.ctaSection} initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h3 className={styles.ctaHeading}>Ready to build something extraordinary?</h3>
              <p className={styles.ctaText}>
                Let&apos;s collaborate and bring your vision to life with cutting-edge technology and design.
              </p>
              <Link href="/contact" className={styles.ctaButton}>
                Start a Conversation
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>;
}