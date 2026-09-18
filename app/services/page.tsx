"use client"

import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react"
import Head from "next/head"
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowDown, ArrowUpRight, Cloud, Code2, Palette, ShieldCheck, Sparkles } from "lucide-react"
import styles from "./services.module.css"
import CustomSelect from "@/components/CustomSelect"

const services = [
  {
    id: "software",
    icon: Code2,
    number: "01",
    category: "Software Engineering",
    positioning: "Interfaces that feel inevitable.",
    items: [
      { title: "Frontend Development", desc: "React, Next.js, TypeScript — pixel-perfect, accessible UIs with performance-first architecture" },
      { title: "Backend Engineering", desc: "Node.js, Python, Go — scalable APIs, microservices, event-driven systems" },
      { title: "Full-Stack Applications", desc: "End-to-end ownership — database to deployment, with real-time capabilities" },
      { title: "API Development", desc: "REST, GraphQL, webhooks — robust, documented, versioned interfaces" },
    ],
  },
  {
    id: "platform",
    icon: Cloud,
    number: "02",
    category: "Platform & Infrastructure",
    positioning: "Systems that disappear when they work.",
    items: [
      { title: "Cloud Architecture", desc: "AWS, GCP, Azure — serverless, containerized, auto-scaling infrastructure" },
      { title: "DevOps & CI/CD", desc: "GitHub Actions, Docker, Terraform — automated pipelines, zero-downtime deploys" },
      { title: "Database Design", desc: "PostgreSQL, MongoDB, Redis — normalized schemas, indexing strategies, replication" },
      { title: "Monitoring & Observability", desc: "Sentry, Datadog, logs/metrics/traces — proactive issue detection" },
    ],
  },
  {
    id: "creative",
    icon: Palette,
    number: "03",
    category: "Strategy & Creative",
    positioning: "Clarity with a pulse.",
    items: [
      { title: "Product Strategy", desc: "Roadmapping, MVP definition, user research — product-market fit focused" },
      { title: "UI/UX Design", desc: "Figma design systems, prototyping, usability testing — intuitive user journeys" },
      { title: "Brand Identity", desc: "Logo, typography, color systems, voice — cohesive brand experiences" },
      { title: "Digital Marketing", desc: "SEO, content strategy, analytics — growth-oriented campaigns" },
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    number: "04",
    category: "Security & Compliance",
    positioning: "Trust engineered into every layer.",
    items: [
      { title: "Application Security", desc: "OWASP, penetration testing, secure coding practices — SDLC integrated" },
      { title: "Authentication & Authorization", desc: "OAuth, JWT, RBAC — identity management, session handling" },
      { title: "Compliance & Audits", desc: "GDPR, SOC2, HIPAA — documentation, policies, certifications" },
      { title: "Infrastructure Security", desc: "VPCs, firewalls, WAF, DDoS protection — defense in depth" },
    ],
  },
] as const

const processSteps = [
  { number: "01", title: "Discovery", desc: "We find the signal inside the brief and define what success actually looks like." },
  { number: "02", title: "Design", desc: "We turn ambiguity into a tangible product language, prototype by prototype." },
  { number: "03", title: "Build", desc: "We ship in tight loops, with visible progress and quality gates at every turn." },
  { number: "04", title: "Launch", desc: "We move from staging to the real world without losing the plot." },
  { number: "05", title: "Evolve", desc: "We keep learning from usage and make the next version sharper than the last." },
]

type Service = typeof services[number]

function CapabilityCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    event.currentTarget.style.setProperty("--spotlight-x", `${x * 100}%`)
    event.currentTarget.style.setProperty("--spotlight-y", `${y * 100}%`)
    rotateX.set((0.5 - y) * 6)
    rotateY.set((x - 0.5) * 6)
  }

  const handlePointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.article
      className={styles.capabilityCard}
      data-motion-interactive
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.cardGlow} aria-hidden="true" />
      <div className={styles.cardTop}>
        <span className={styles.cardIcon}><Icon size={24} strokeWidth={1.7} /></span>
        <span className={styles.cardNumber}>{service.number}</span>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardKicker}>Capability / {service.number}</span>
        <h3>{service.category}</h3>
        <p className={styles.cardPositioning}>{service.positioning}</p>
        <ul className={styles.cardList}>
          {service.items.map((item) => (
            <li key={item.title}>
              <span>{item.title}</span>
              <p>{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.cardFooter}><ArrowUpRight size={18} /> Built to compound</div>
    </motion.article>
  )
}

function ProcessStep({ step, index }: { step: typeof processSteps[number]; index: number }) {
  return (
    <motion.div
      className={styles.processStep}
      initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={styles.processNumber}>{step.number}</span>
      <div>
        <h3>{step.title}</h3>
        <p>{step.desc}</p>
      </div>
      <ArrowUpRight className={styles.processArrow} size={20} />
    </motion.div>
  )
}

export default function ServicesPage() {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    serviceType: "fullstack",
    budget: "",
    timeline: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const processRef = useRef<HTMLElement>(null)
  const requestFormRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: processRef, offset: ["start end", "end start"] })
  const processLine = useTransform(scrollYProgress, [0, 1], [0, 1])
  const processLineSpring = useSpring(processLine, { stiffness: 70, damping: 20, mass: 0.4 })

  useEffect(() => {
    if (showRequestForm) requestFormRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
  }, [reducedMotion, showRequestForm])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)
    try {
      const res = await fetch("/api/service-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
      if (res.ok) {
        setSubmitMessage({ type: "success", text: "Service request submitted successfully! We'll get back to you soon." })
        setFormData({ userName: "", userEmail: "", serviceType: "fullstack", budget: "", timeline: "", message: "" })
        setShowRequestForm(false)
      } else {
        const data = await res.json()
        setSubmitMessage({ type: "error", text: data.error || "Failed to submit request" })
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormField = (field: keyof typeof formData, value: string) => setFormData((current) => ({ ...current, [field]: value }))

  return (
    <>
      <Head>
        <title>Services | Lumyn Technologies — Full-Stack Development & Digital Solutions</title>
        <meta name="description" content="Comprehensive technology services: full-stack development, cloud infrastructure, product strategy, UI/UX design, security & compliance. End-to-end solutions for modern businesses." />
        <meta name="keywords" content="Lumyn Technologies services, full-stack development, cloud infrastructure, product strategy, UI UX design, security compliance, software engineering, DevOps, API development" />
        <meta property="og:title" content="Services | Lumyn Technologies — Full-Stack Development & Digital Solutions" />
        <meta name="og:description" content="Comprehensive technology services: full-stack development, cloud infrastructure, product strategy, UI/UX design, security & compliance. End-to-end solutions for modern businesses." />
        <meta property="og:url" content="https://www.lumyn.co.ke/services" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services | Lumyn Technologies — Full-Stack Development & Digital Solutions" />
        <meta name="twitter:description" content="Comprehensive technology services: full-stack development, cloud infrastructure, product strategy, UI/UX design, security & compliance." />
        <link rel="canonical" href="https://www.lumyn.co.ke/services" />
      </Head>

      <div className={styles.servicesPage}>
        <motion.section className={styles.hero} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <div className={styles.heroBackground} aria-hidden="true">
            <div className={styles.heroGrid} />
            <div className={styles.heroGlow} />
            <div className={styles.heroRing} />
            <div className={styles.heroRingSecond} />
            {["Strategy", "Engineering", "Cloud", "Security"].map((label, index) => (
              <motion.span key={label} className={styles.floatingChip} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.45 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}>{label}</motion.span>
            ))}
          </div>

          <div className={styles.heroContent}>
            <motion.div className={styles.heroKicker} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}>
              <Sparkles size={16} /> Service system / 001
            </motion.div>
            <h1 className={styles.heroTitle} aria-label="We build the impossible into momentum.">
              {["We build", "the impossible", "into momentum."].map((line, index) => (
                <span className={styles.heroLine} key={line}>
                  <motion.span initial={{ y: "115%" }} animate={{ y: "0%" }} transition={{ duration: 0.85, delay: 0.18 + index * 0.1, ease: [0.16, 1, 0.3, 1] }} className={index === 2 ? styles.heroAccent : ""}>{line}</motion.span>
                </span>
              ))}
            </h1>
            <motion.p className={styles.heroSubtitle} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}>Four disciplines. One team. We take the hard, messy, ambitious parts of your product and turn them into systems people love to use.</motion.p>
            <motion.div className={styles.heroActions} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}>
              <button type="button" className={styles.heroPrimary} onClick={() => setShowRequestForm(true)}>Start a request <ArrowUpRight size={18} /></button>
              <a href="#capabilities" className={styles.heroGhost}>Explore capabilities <ArrowDown size={18} /></a>
            </motion.div>
          </div>

          <div className={styles.heroMetrics} aria-label="Service scope">
            <div><strong>04</strong><span>disciplines</span></div>
            <div><strong>16</strong><span>capabilities</span></div>
            <div><strong>01</strong><span>team in your corner</span></div>
          </div>
          <div className={styles.heroScroll} aria-hidden="true"><span>Scroll to explore</span><ArrowDown size={16} /></div>
        </motion.section>

        <motion.section id="capabilities" className={styles.capabilitiesSection} data-service-section="capabilities" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7 }}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.sectionKicker}>01 / The toolkit</span>
              <h2 className={styles.sectionTitle}>Not a menu.<br /><span>A movement.</span></h2>
            </div>
            <p>Every capability is a lever. Pull the right ones and your product starts moving faster than the market around it.</p>
          </div>
          <div className={styles.capabilityGrid}>
            {services.map((service, index) => <CapabilityCard service={service} index={index} key={service.id} />)}
          </div>
        </motion.section>

        <motion.section ref={processRef} className={styles.processSection} data-service-section="process" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7 }}>
          <div className={styles.processBackground} aria-hidden="true"><div className={styles.processGrid} /><div className={styles.processLine}><motion.span className={styles.processLineFill} style={{ scaleY: processLineSpring }} /></div></div>
          <div className={styles.processContent}>
            <div className={styles.processHeading}>
              <span className={styles.sectionKickerLight}>02 / The method</span>
              <h2 className={styles.processTitle}>From signal<br /><span>to launch.</span></h2>
              <p>We do not hide behind jargon. You get a visible path, a working rhythm, and a team that ships.</p>
            </div>
            <div className={styles.processList}>{processSteps.map((step, index) => <ProcessStep step={step} index={index} key={step.number} />)}</div>
          </div>
        </motion.section>

        <motion.section className={styles.ctaSection} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
          <div className={styles.ctaRings} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.sectionKickerLight}>03 / Your move</span>
          <motion.h2 className={styles.ctaTitle} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.08 }}>Bring us the hard part.</motion.h2>
          <motion.p className={styles.ctaText} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.16 }}>A rough idea is enough. We will help you find the shape, the stack, and the first useful version.</motion.p>
          <motion.button type="button" className={styles.ctaButton} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => setShowRequestForm(true)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.24 }}>Request a service <ArrowUpRight size={18} /></motion.button>
        </motion.section>

        <AnimatePresence>
          {showRequestForm && (
            <motion.section ref={requestFormRef} className={styles.requestSection} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
              <div className={styles.requestFormWrapper}>
                <div className={styles.requestHeader}>
                  <span className={styles.sectionKicker}>04 / The brief</span>
                  <h2 className={styles.requestTitle}>Tell us what keeps you up at night.</h2>
                  <p className={styles.requestSubtitle}>The more honest the brief, the sharper the first move.</p>
                </div>
                {submitMessage && <div className={`${styles.requestMessage} ${submitMessage.type === "success" ? styles.requestMessageSuccess : styles.requestMessageError}`} role="status">{submitMessage.text}</div>}
                <form onSubmit={handleSubmit} className={styles.requestForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label htmlFor="userName">Full name</label><input id="userName" value={formData.userName} onChange={(event) => updateFormField("userName", event.target.value)} className={styles.formInput} placeholder="Joshua Mwendwa" /></div>
                    <div className={styles.formGroup}><label htmlFor="userEmail">Email address *</label><input id="userEmail" type="email" value={formData.userEmail} onChange={(event) => updateFormField("userEmail", event.target.value)} className={styles.formInput} placeholder="joshua@lumyn.co.ke" required /></div>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label htmlFor="serviceType">Service type *</label><CustomSelect value={formData.serviceType} onChange={(value) => updateFormField("serviceType", value)} className={styles.formInput} /></div>
                    <div className={styles.formGroup}><label htmlFor="budget">Budget range (KES)</label><input id="budget" value={formData.budget} onChange={(event) => updateFormField("budget", event.target.value)} className={styles.formInput} placeholder="e.g., 50,000 - 100,000" /></div>
                  </div>
                  <div className={styles.formGroup}><label htmlFor="timeline">Expected timeline</label><input id="timeline" value={formData.timeline} onChange={(event) => updateFormField("timeline", event.target.value)} className={styles.formInput} placeholder="e.g., 2-3 months" /></div>
                  <div className={styles.formGroup}><label htmlFor="message">Project details *</label><textarea id="message" rows={6} value={formData.message} onChange={(event) => updateFormField("message", event.target.value)} className={styles.formTextarea} placeholder="Describe the problem, the ambition, and what success looks like..." required /></div>
                  <div className={styles.formActions}><button type="submit" disabled={submitting} className={styles.submitButton}>{submitting ? "Sending..." : "Submit request"} <ArrowUpRight size={18} /></button><button type="button" onClick={() => setShowRequestForm(false)} className={styles.cancelButton}>Cancel</button></div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
