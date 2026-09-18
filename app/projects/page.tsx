"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "./projects.module.css";
import LoadingState from "@/components/LoadingState";
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [initialSelectedId, setInitialSelectedId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setInitialSelectedId(id);
    }
  }, []);
  useEffect(() => {
    if (initialSelectedId && projects.length > 0) {
      const found = projects.find(item => item.id === initialSelectedId);
      if (found) {
        setSelectedProject(found);
        setInitialSelectedId(null);
      }
    }
  }, [initialSelectedId, projects]);
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);
  const categories = ["all", "website", "web-app", "mobile-app", "e-commerce", "api", "other"];
  const filteredProjects = filter === "all" ? projects : projects.filter(project => project.category === filter);
  const featuredProjects = projects.filter(project => project.featured);
  return <>
      <Head>
        <title>Our Projects | Lumyn Technologies - Digital Solutions Portfolio</title>
        <meta name="description" content="Explore our portfolio of successful projects. From web applications to mobile apps, see how Lumyn Technologies delivers innovative digital solutions." />
        <meta name="keywords" content="projects, portfolio, web development, mobile apps, digital solutions, case studies" />
        <meta property="og:title" content="Our Projects | Lumyn Technologies - Digital Solutions Portfolio" />
        <meta name="og:description" content="Explore our portfolio of successful projects. From web applications to mobile apps, see how Lumyn Technologies delivers innovative digital solutions." />
        <meta property="og:url" content="https://www.lumyn.co.ke/projects" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Projects | Lumyn Technologies - Digital Solutions Portfolio" />
        <meta name="twitter:description" content="Explore our portfolio of successful projects. From web applications to mobile apps, see how Lumyn Technologies delivers innovative digital solutions." />
        <link rel="canonical" href="https://www.lumyn.co.ke/projects" />
      </Head>

      <div className={styles.projectsPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              01 / Selected work
            </motion.p>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Our Projects
            </motion.h1>
            <motion.p
              className={styles.heroDescription}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              Discover our portfolio of successful digital solutions, from web applications to mobile experiences.
            </motion.p>
          </div>
        </section>

        {/* Featured Projects Section */}
        {(loading || featuredProjects.length > 0) && (
          <motion.section
            className={styles.featuredSection}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.container}>
              <motion.h2
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                Featured Projects
              </motion.h2>
              {loading ? (
                <LoadingState variant="portfolio" label="Loading featured work" count={3} />
              ) : (
                <div className={styles.featuredGrid}>
                  {featuredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className={styles.featuredCard}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={styles.featuredImage}>
                        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill style={{ objectFit: "cover" }} />
                      </div>
                      <div className={styles.featuredContent}>
                        <h3 className={styles.featuredTitle}>{project.title}</h3>
                        <p className={styles.featuredDescription}>{project.description}</p>
                        <div className={styles.featuredTech}>
                          {project.technologies.map((tech) => (
                            <span key={tech} className={styles.techTag}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className={styles.featuredLinks}>
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                              View Live →
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                              GitHub →
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* All Projects Section */}
        <motion.section
          className={styles.projectsSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <motion.h2
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                All Projects
              </motion.h2>
              <div className={styles.filterButtons}>
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    className={`${styles.filterButton} ${filter === category ? styles.active : ""}`}
                    onClick={() => setFilter(category)}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {category === "all" ? "All" : category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </motion.button>
                ))}
              </div>
            </div>

            {loading ? (
                <LoadingState variant="portfolio" label="Loading selected work" count={6} />
              ) : filteredProjects.length > 0 ? (
                <div className={styles.projectsGrid}>
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className={styles.projectCard}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={styles.projectImage}>
                        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill style={{ objectFit: "cover" }} />
                        <div className={styles.projectCategory}>
                          {project.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      </div>
                      <div className={styles.projectContent}>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <p className={styles.projectDescription}>
                          {project.description.length > 80 ? `${project.description.substring(0, 80)}...` : project.description}
                        </p>
                        <div className={styles.projectTech}>
                          {project.technologies.slice(0, 2).map((tech) => (
                            <span key={tech} className={styles.techTag}>
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 2 && <span className={styles.techTag}>+{project.technologies.length - 2}</span>}
                        </div>
                        <button className={styles.readMoreBtn} onClick={() => {
                          setSelectedProject(project);
                          setShowDetailModal(true);
                        }}>
                          Read More →
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className={styles.noProjects}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p>No projects found in this category.</p>
                  <button className={styles.resetFilter} onClick={() => setFilter("all")}>
                    Show All Projects
                  </button>
                </motion.div>
              )}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className={styles.ctaSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.ctaOverlay}></div>
          <div className={`${styles.container} ${styles.ctaContainer}`}>
            <motion.h2
              className={styles.ctaTitle}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              Ready to Start Your Project?
            </motion.h2>
            <motion.p
              className={styles.ctaText}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s discuss your vision and bring it to life with our expert team.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/get-started" className={styles.ctaButton}>
                Start Your Project
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedProject && (
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>{selectedProject.title}</h2>
                  <button className={styles.modalClose} onClick={() => setShowDetailModal(false)}>
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.modalImage}>
                    <Image src={selectedProject.image || "/placeholder.svg"} alt={selectedProject.title} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className={styles.modalDetails}>
                    <div className={styles.modalMeta}>
                      <span className={styles.modalCategory}>
                        {selectedProject.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {selectedProject.featured && <span className={styles.featuredBadge}>Featured</span>}
                    </div>
                    <p className={styles.modalDescription}>{selectedProject.description}</p>
                    <div className={styles.modalTech}>
                      <h4>Technologies:</h4>
                      <div className={styles.modalTechTags}>
                        {selectedProject.technologies.map((tech) => (
                          <span key={tech} className={styles.modalTechTag}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.modalLinks}>
                      {selectedProject.liveUrl && (
                        <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                          View Live →
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                          GitHub →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>;
}