"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./company-profile.module.css";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function CompanyProfilePage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const sections: Section[] = [
    {
      id: "about",
      title: "About Lumyn",
      content: (
        <div className={styles.aboutContent}>
          <p className={styles.aboutText}>
            Lumyn Technologies is a forward-thinking digital solutions company
            specializing in modern web development, cloud infrastructure, and
            strategic design. We were founded with a singular purpose: to help
            businesses unlock their full potential through elegant, efficient,
            and scalable technology.
          </p>
          <p className={styles.aboutText}>
            Our team combines deep technical expertise with creative vision to
            deliver products that don’t just meet expectations — redefine them.
            From pixel-perfect frontends to robust backend architecture, we build
            experiences that scale with your ambition.
          </p>
        </div>
      ),
    },
    {
      id: "mission",
      title: "Mission & Vision",
      content: (
        <div className={styles.missionGrid}>
          <motion.div
            className={styles.missionCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={styles.missionTitle}>Our Mission</h3>
            <p className={styles.missionText}>
              To empower businesses and individuals with elegant, efficient, and
              scalable digital solutions that drive measurable impact.
            </p>
          </motion.div>
          <motion.div
            className={styles.missionCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className={styles.missionTitle}>Our Vision</h3>
            <p className={styles.missionText}>
              To become the most trusted digital partner for startups and
              enterprises seeking innovation, impact, and long-term growth across
              Africa and beyond.
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      id: "services",
      title: "Our Capabilities",
      content: (
        <div className={styles.servicesWrapper}>
          <div className={styles.serviceCategory}>
            <h4 className={styles.categoryHeading}>Software Engineering</h4>
            <ul className={styles.serviceList}>
              <li>Frontend Development (React, Next.js, TypeScript)</li>
              <li>Backend Engineering (Node.js, Python, Go)</li>
              <li>Full-Stack Applications</li>
              <li>API Development (REST, GraphQL, Webhooks)</li>
            </ul>
          </div>
          <div className={styles.serviceCategory}>
            <h4 className={styles.categoryHeading}>Platform & Infrastructure</h4>
            <ul className={styles.serviceList}>
              <li>Cloud Architecture (AWS, GCP, Azure)</li>
              <li>DevOps & CI/CD Pipelines</li>
              <li>Database Design & Optimization</li>
              <li>Monitoring & Observability</li>
            </ul>
          </div>
          <div className={styles.serviceCategory}>
            <h4 className={styles.categoryHeading}>Strategy & Creative</h4>
            <ul className={styles.serviceList}>
              <li>Product Strategy & Roadmapping</li>
              <li>UI/UX Design & Prototyping</li>
              <li>Brand Identity Systems</li>
              <li>Digital Marketing & Growth</li>
            </ul>
          </div>
          <div className={styles.serviceCategory}>
            <h4 className={styles.categoryHeading}>Security & Compliance</h4>
            <ul className={styles.serviceList}>
              <li>Application Security & Pen Testing</li>
              <li>Authentication & Authorization</li>
              <li>Compliance Audits (GDPR, SOC 2, HIPAA)</li>
              <li>Infrastructure Security</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "process",
      title: "How We Work",
      content: (
        <div className={styles.processGrid}>
          {[
            { num: "01", title: "Discovery", text: "Deep dive into your business, users, and technical requirements to define success criteria." },
            { num: "02", title: "Design", text: "Wireframes, prototypes, and design systems that align with your brand and user needs." },
            { num: "03", title: "Build", text: "Agile development with weekly demos, transparent progress, and quality gates." },
            { num: "04", title: "Launch", text: "Staged rollouts, monitoring, and handoff documentation for smooth deployment." },
            { num: "05", title: "Evolve", text: "Ongoing maintenance, feature iterations, and optimization based on real data." },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              className={styles.processCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className={styles.stepNum}>{step.num}</span>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepText}>{step.text}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: "why-us",
      title: "Why Choose Lumyn",
      content: (
        <div className={styles.featuresWrapper}>
          {[
            { icon: "⚡", title: "Modern Design", text: "Clean, user-first design that delights users and drives engagement." },
            { icon: "📈", title: "Scalable Tech", text: "Architectures that grow with your business from day one." },
            { icon: "🔐", title: "Security First", text: "Best-in-class security practices embedded into every layer." },
            { icon: "🤝", title: "Client-First", text: "Transparent collaboration, clear timelines, and honest communication." },
            { icon: "✅", title: "Proven Results", text: "Track record of shipped projects with measurable outcomes." },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className={styles.featureIcon}>{feature.icon}</span>
              <div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureText}>{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Company Profile | Lumyn Technologies</title>
        <meta name="description" content="Lumyn Technologies company profile — modern digital solutions, web development, and cloud infrastructure." />
        <meta property="og:title" content="Company Profile | Lumyn Technologies" />
        <meta property="og:description" content="Lumyn Technologies company profile — modern digital solutions, web development, and cloud infrastructure." />
        <meta property="og:url" content="https://www.lumyn.co.ke/company-profile" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.lumyn.co.ke/company-profile" />
      </Head>

      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.toolbar}>
            <h1 className={styles.brandName}>Lumyn</h1>
            <button
              type="button"
              className={styles.printButton}
              onClick={() => window.print()}
            >
              Download / Print Profile
            </button>
          </div>

          <motion.div
            className={styles.cover}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.coverLogo}>
              <Image src="/DZ000.jpg" alt="Lumyn Technologies" width={160} height={160} />
            </div>
            <h1 className={styles.coverTitle}>Lumyn Technologies</h1>
            <p className={styles.coverSubtitle}>Powering Digital Innovation</p>
            <div className={styles.coverMeta}>
              <span>https://www.lumyn.co.ke</span>
              <span>lumyntechnologies@gmail.com</span>
            </div>
          </motion.div>

          <div className={styles.content}>
            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className={`${styles.section} ${visibleSections.has(section.id) ? styles.visible : ""}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <div className={styles.sectionLine} />
                </div>
                <div className={styles.sectionBody}>{section.content}</div>
              </section>
            ))}
          </div>

          <footer className={styles.profileFooter}>
            <div className={styles.footerBlock}>
              <h3 className={styles.footerHeading}>Contact</h3>
              <p>Email: lumyntechnologies@gmail.com</p>
              <p>Website: https://www.lumyn.co.ke</p>
            </div>
            <div className={styles.footerBlock}>
              <h3 className={styles.footerHeading}>Services</h3>
              <p>Web Development &middot; Cloud &middot; Security &middot; Strategy</p>
            </div>
            <div className={styles.footerBrand}>
              <Image src="/favicon.ico" alt="Lumyn" width={32} height={32} />
              <span>&copy; {new Date().getFullYear()} Lumyn Technologies</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
