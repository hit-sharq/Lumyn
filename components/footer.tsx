import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Lumyn</h3>
            <p className={styles.footerText}>
              A digital innovation studio engineering bespoke platforms, products, and experiences that move ambitious businesses forward.
            </p>
            <div className={styles.footerContact}>
              <a href="mailto:info@lumyn.co.ke" className={styles.footerContactItem}>
                <span className={styles.footerContactIcon}>✉</span>
                <span>info@lumyn.co.ke</span>
              </a>
              <a href="mailto:support@lumyn.co.ke" className={styles.footerContactItem}>
                <span className={styles.footerContactIcon}>🛟</span>
                <span>support@lumyn.co.ke</span>
              </a>
            </div>
            <div className={styles.socialLinks}>
               <a href="https://x.com/LumynTec" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/lumyn-technologies" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://github.com/lumyntechnologies-oss" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/lumyn_technologies" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Company</h4>
            <div className={styles.footerLinkGrid}>
              <nav className={styles.footerLinks}>
                 <Link href="/about" className={styles.footerLink}>About</Link>
                 <Link href="/team" className={styles.footerLink}>Team</Link>
                 <Link href="/careers" className={styles.footerLink}>Careers</Link>
                 <Link href="/services" className={styles.footerLink}>Services</Link>
                 <Link href="/company-profile" className={styles.footerLink}>Company Profile</Link>
                 <Link href="/projects" className={styles.footerLink}>Projects</Link>
              </nav>
              <nav className={styles.footerLinks}>
                 <Link href="/partners" className={styles.footerLink}>Partners</Link>
                 <Link href="/blog" className={styles.footerLink}>Blog</Link>
                 <Link href="/events" className={styles.footerLink}>Events</Link>
                 <Link href="/news" className={styles.footerLink}>News</Link>
                 <Link href="/contact" className={styles.footerLink}>Contact</Link>
              </nav>
            </div>
          </div>

          {/* Products */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Products</h4>
            <nav className={styles.footerLinks}>
              <Link href="/studio" className={styles.footerLink}>
                <span className={styles.productDot} style={{ background: "#6d8196" }} />
                Lumyn Studio
              </Link>
              <Link href="/launch" className={styles.footerLink}>
                <span className={styles.productDot} style={{ background: "#2d6a9f" }} />
                Lumyn Launch
              </Link>
              <Link href="/market" className={styles.footerLink}>
                <span className={styles.productDot} style={{ background: "#c0622a" }} />
                Lumyn Market
              </Link>
              <Link href="/hire" className={styles.footerLink}>
                <span className={styles.productDot} style={{ background: "#1a5c3a" }} />
                Lumyn Hire
              </Link>
              <Link href="/ai-marketing" className={styles.footerLink}>
                <span className={styles.productDot} style={{ background: "#a259f7" }} />
                AI Marketing
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Resources</h4>
            <nav className={styles.footerLinks}>
              <Link href="/gallery" className={styles.footerLink}>Gallery</Link>
              <Link href="/newsletter" className={styles.footerLink}>Newsletter</Link>
              <Link href="/sponsorship" className={styles.footerLink}>Sponsorship</Link>
              <Link href="/studio/dashboard" className={styles.footerLink}>My Downloads</Link>
              <Link href="/launch/dashboard" className={styles.footerLink}>My Portfolios</Link>
              <Link href="/market/dashboard" className={styles.footerLink}>Creator Dashboard</Link>
            </nav>
          </div>

          {/* Technologies */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Technologies</h4>
            <nav className={styles.footerLinks}>
              <Link href="/technologies" className={styles.footerLink}>All Technologies</Link>
            </nav>
            <div className={styles.techCategories}>
              <div className={styles.techCategory}>
                <span className={styles.techCategoryTitle}>Frontend</span>
                <nav className={styles.techLinks}>
                  <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>React</a>
                  <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Next.js</a>
                  <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Vue</a>
                  <a href="https://angular.io" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Angular</a>
                  <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Svelte</a>
                  <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>TypeScript</a>
                </nav>
              </div>
              <div className={styles.techCategory}>
                <span className={styles.techCategoryTitle}>Backend</span>
                <nav className={styles.techLinks}>
                  <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Node.js</a>
                  <a href="https://nestjs.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>NestJS</a>
                  <a href="https://www.python.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Python</a>
                  <a href="https://dotnet.microsoft.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>.NET</a>
                  <a href="https://go.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Go</a>
                </nav>
              </div>
              <div className={styles.techCategory}>
                <span className={styles.techCategoryTitle}>Mobile</span>
                <nav className={styles.techLinks}>
                  <a href="https://reactnative.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>React Native</a>
                  <a href="https://flutter.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Flutter</a>
                  <a href="https://swift.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Swift</a>
                  <a href="https://kotlinlang.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Kotlin</a>
                </nav>
              </div>
              <div className={styles.techCategory}>
                <span className={styles.techCategoryTitle}>DevOps & Cloud</span>
                <nav className={styles.techLinks}>
                  <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>AWS</a>
                  <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>GCP</a>
                  <a href="https://azure.microsoft.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Azure</a>
                  <a href="https://www.docker.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Docker</a>
                  <a href="https://kubernetes.io" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Kubernetes</a>
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Vercel</a>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Lumyn. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>Privacy</Link>
            <span className={styles.separator}>·</span>
            <Link href="/terms" className={styles.legalLink}>Terms</Link>
          </div>
          <div className={styles.footerBadge}>
            <span className={styles.footerBadgeDot}></span>
            Accepting new projects
          </div>
        </div>
      </div>
    </footer>
  )
}
