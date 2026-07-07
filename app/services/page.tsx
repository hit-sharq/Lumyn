"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./services.module.css";
import type { JSX } from "react/jsx-runtime";
import CustomSelect from "@/components/CustomSelect";
const services = [{
  category: "Software Engineering",
  icon: "⚙️",
  items: [{
    title: "Frontend Development",
    desc: "React, Next.js, TypeScript — pixel-perfect, accessible UIs with performance-first architecture"
  }, {
    title: "Backend Engineering",
    desc: "Node.js, Python, Go — scalable APIs, microservices, event-driven systems"
  }, {
    title: "Full-Stack Applications",
    desc: "End-to-end ownership — database to deployment, with real-time capabilities"
  }, {
    title: "API Development",
    desc: "REST, GraphQL, webhooks — robust, documented, versioned interfaces"
  }]
}, {
  category: "Platform & Infrastructure",
  icon: "☁️",
  items: [{
    title: "Cloud Architecture",
    desc: "AWS, GCP, Azure — serverless, containerized, auto-scaling infrastructure"
  }, {
    title: "DevOps & CI/CD",
    desc: "GitHub Actions, Docker, Terraform — automated pipelines, zero-downtime deploys"
  }, {
    title: "Database Design",
    desc: "PostgreSQL, MongoDB, Redis — normalized schemas, indexing strategies, replication"
  }, {
    title: "Monitoring & Observability",
    desc: "Sentry, Datadog, logs/metrics/traces — proactive issue detection"
  }]
}, {
  category: "Strategy & Creative",
  icon: "🎨",
  items: [{
    title: "Product Strategy",
    desc: "Roadmapping, MVP definition, user research — product-market fit focused"
  }, {
    title: "UI/UX Design",
    desc: "Figma design systems, prototyping, usability testing — intuitive user journeys"
  }, {
    title: "Brand Identity",
    desc: "Logo, typography, color systems, voice — cohesive brand experiences"
  }, {
    title: "Digital Marketing",
    desc: "SEO, content strategy, analytics — growth-oriented campaigns"
  }]
}, {
  category: "Security & Compliance",
  icon: "🔒",
  items: [{
    title: "Application Security",
    desc: "OWASP, penetration testing, secure coding practices — SDLC integrated"
  }, {
    title: "Authentication & Authorization",
    desc: "OAuth, JWT, RBAC — identity management, session handling"
  }, {
    title: "Compliance & Audits",
    desc: "GDPR, SOC2, HIPAA — documentation, policies, certifications"
  }, {
    title: "Infrastructure Security",
    desc: "VPCs, firewalls, WAF, DDoS protection — defense in depth"
  }]
}];
const processSteps = [{
  number: "01",
  title: "Discovery",
  desc: "We dive deep into your business, users, and technical requirements to define success criteria."
}, {
  number: "02",
  title: "Design",
  desc: "Wireframes, prototypes, and design systems that align with your brand and user needs."
}, {
  number: "03",
  title: "Build",
  desc: "Agile development with weekly demos, transparent progress, and quality gates."
}, {
  number: "04",
  title: "Launch",
  desc: "Staged rollouts, monitoring, and handoff documentation — we ensure smooth deployment."
}, {
  number: "05",
  title: "Evolve",
  desc: "Ongoing maintenance, feature iterations, and optimization based on real data."
}];
export default function ServicesPage() {
  const sectionRefs = useRef<{
    [key: string]: HTMLElement | null;
  }>({});
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    serviceType: "fullstack",
    budget: "",
    timeline: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitMessage({
          type: "success",
          text: "Service request submitted successfully! We'll get back to you soon."
        });
        setFormData({
          userName: "",
          userEmail: "",
          serviceType: "fullstack",
          budget: "",
          timeline: "",
          message: ""
        });
        setShowRequestForm(false);
      } else {
        const data = await res.json();
        setSubmitMessage({
          type: "error",
          text: data.error || "Failed to submit request"
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Something went wrong. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
        }
      });
    }, {
      threshold: 0.1
    });
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);
  return <>
      <Head>
        <title>Services | Lumyn — Full-Stack Development & Digital Solutions</title>
        <meta name="description" content="Comprehensive technology services: full-stack development, cloud infrastructure, product strategy, UI/UX design, security & compliance. End-to-end solutions for modern businesses." />
        <meta name="keywords" content="Lumyn services, full-stack development, cloud infrastructure, product strategy, UI UX design, security compliance, software engineering, DevOps, API development" />
        <meta property="og:title" content="Services | Lumyn — Full-Stack Development & Digital Solutions" />
        <meta name="og:description" content="Comprehensive technology services: full-stack development, cloud infrastructure, product strategy, UI/UX design, security & compliance. End-to-end solutions for modern businesses." />
        <meta property="og:url" content="https://www.lumyn.co.ke/services" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services | Lumyn — Full-Stack Development & Digital Solutions" />
        <meta name="twitter:description" content="Comprehensive technology services: full-stack development, cloud infrastructure, product strategy, UI/UX design, security & compliance." />
        <link rel="canonical" href="https://www.lumyn.co.ke/services" />
      </Head>

      <div className={styles.servicesPage}>
        {/* Hero */}
        <section className={styles.hero}>
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
              What We <span className={styles.highlight}>Build</span>
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
              End-to-end technology solutions engineered for scale, security, and speed.
            </motion.p>
          </div>
        </section>

        {/* Services Grid */}
        <section className={styles.servicesSection} id="services">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Services</h2>
              <p className={styles.sectionSubtitle}>
                Full-stack capabilities across engineering, infrastructure, and strategy
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {services.map((category, catIndex) => <motion.div key={catIndex} className={styles.serviceColumn} initial={{
              opacity: 0,
              y: 40
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: catIndex * 0.1
            }}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    <h3 className={styles.categoryTitle}>{category.category}</h3>
                  </div>
                  <div className={styles.serviceList}>
                    {category.items.map((item, itemIndex) => <div key={itemIndex} className={styles.serviceItem}>
                        <h4 className={styles.serviceItemTitle}>{item.title}</h4>
                        <p className={styles.serviceItemDesc}>{item.desc}</p>
                      </div>)}
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className={styles.processSection} id="process">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How We Work</h2>
              <p className={styles.sectionSubtitle}>
                A proven process from discovery to ongoing evolution
              </p>
            </div>

            <div className={styles.processGrid}>
              {processSteps.map((step, index) => <motion.div key={index} className={styles.processCard} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <motion.div className={styles.ctaContent} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h2 className={styles.ctaTitle}>Ready to start your project?</h2>
              <p className={styles.ctaText}>
                Let&apos;s discuss your goals and craft a tailored solution — no templates, no fluff.
              </p>
              <button onClick={() => setShowRequestForm(!showRequestForm)} className={styles.ctaButton}>
                Request a Service
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.div>
          </div>
        </section>

        {/* Service Request Form */}
        {showRequestForm && <section className={styles.requestSection}>
            <div className={styles.container}>
              <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} className={styles.requestFormWrapper}>
                <div className={styles.requestHeader}>
                  <h2 className={styles.requestTitle}>Request a Service</h2>
                  <p className={styles.requestSubtitle}>
                    Tell us about your project and we&apos;ll get back to you within 24 hours.
                  </p>
                </div>

                {submitMessage && <div className={`${styles.requestMessage} ${submitMessage.type === "success" ? styles.requestMessageSuccess : styles.requestMessageError}`}>
                    {submitMessage.text}
                  </div>}

                <form onSubmit={handleSubmit} className={styles.requestForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="userName" className={styles.formLabel}>
                        Full Name
                      </label>
                      <input type="text" id="userName" value={formData.userName} onChange={e => setFormData({
                    ...formData,
                    userName: e.target.value
                  })} className={styles.formInput} placeholder="joshua mwendwa" />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="userEmail" className={styles.formLabel}>
                        Email Address *
                      </label>
                      <input type="email" id="userEmail" value={formData.userEmail} onChange={e => setFormData({
                    ...formData,
                    userEmail: e.target.value
                  })} className={styles.formInput} placeholder="joshua@gmail.com" required />
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="serviceType" className={styles.formLabel}>
                        Service Type *
                      </label>
                      <CustomSelect value={formData.serviceType} onChange={value => setFormData({
                    ...formData,
                    serviceType: value
                  })} className={styles.formInput} />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="budget" className={styles.formLabel}>
                        Budget Range (KES)
                      </label>
                      <input type="text" id="budget" value={formData.budget} onChange={e => setFormData({
                    ...formData,
                    budget: e.target.value
                  })} className={styles.formInput} placeholder="e.g., 50,000 - 100,000" />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="timeline" className={styles.formLabel}>
                      Expected Timeline
                    </label>
                    <input type="text" id="timeline" value={formData.timeline} onChange={e => setFormData({
                  ...formData,
                  timeline: e.target.value
                })} className={styles.formInput} placeholder="e.g., 2-3 months" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.formLabel}>
                      Project Details *
                    </label>
                    <textarea id="message" value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} rows={6} className={styles.formTextarea} placeholder="Describe your project, goals, and any specific requirements..." required />
                  </div>

                  <div className={styles.formActions}>
                    <button type="submit" disabled={submitting} className={styles.submitButton}>
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                    <button type="button" onClick={() => setShowRequestForm(false)} className={styles.cancelButton}>
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </section>}
      </div>
    </>;
}