import Link from "next/link"
import { Github, Instagram, Linkedin, Twitter } from "lucide-react"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.brand}>
              <span className={styles.brandMark} aria-hidden="true">L</span>
              <span className={styles.brandText}>Lumyn</span>
            </div>
            <p className={styles.footerText}>
              A digital innovation studio engineering bespoke platforms, products, and experiences that move ambitious businesses forward.
            </p>
            <div className={styles.footerContact}>
              <a href="mailto:info@lumyn.co.ke" className={styles.footerContactItem}>
                <span className={styles.footerContactIcon} aria-hidden="true">✉</span>
                <span>info@lumyn.co.ke</span>
              </a>
              <a href="mailto:support@lumyn.co.ke" className={styles.footerContactItem}>
                <span className={styles.footerContactIcon} aria-hidden="true">🛟</span>
                <span>support@lumyn.co.ke</span>
              </a>
            </div>
            <div className={styles.socialLinks} aria-label="Social media">
              <a href="https://x.com/LumynTec" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/company/lumyn-technologies" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/lumyntechnologies-oss" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://www.instagram.com/lumyn_technologies" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className={styles.footerCol}>
            <h5>Company</h5>
            <nav className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>About</Link>
              <Link href="/team" className={styles.footerLink}>Team</Link>
              <Link href="/careers" className={styles.footerLink}>Careers</Link>
              <Link href="/services" className={styles.footerLink}>Services</Link>
              <Link href="/company-profile" className={styles.footerLink}>Company Profile</Link>
              <Link href="/projects" className={styles.footerLink}>Projects</Link>
              <Link href="/partners" className={styles.footerLink}>Partners</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
            </nav>
          </div>

          {/* Products */}
          <div className={styles.footerCol}>
            <h5>Products</h5>
            <nav className={styles.footerLinks}>
              <Link href="/studio" className={styles.footerLink}>
                <span className={styles.productDot} aria-hidden="true" />
                Lumyn Studio
              </Link>
              <Link href="/launch" className={styles.footerLink}>
                <span className={styles.productDot} aria-hidden="true" />
                Lumyn Launch
              </Link>
              <Link href="/market" className={styles.footerLink}>
                <span className={styles.productDot} aria-hidden="true" />
                Lumyn Market
              </Link>
              <Link href="/hire" className={styles.footerLink}>
                <span className={styles.productDot} aria-hidden="true" />
                Lumyn Hire
              </Link>
              <Link href="/ai-marketing" className={styles.footerLink}>
                <span className={styles.productDot} aria-hidden="true" />
                AI Marketing
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className={styles.footerCol}>
            <h5>Resources</h5>
            <nav className={styles.footerLinks}>
              <Link href="/blog" className={styles.footerLink}>Blog</Link>
              <Link href="/events" className={styles.footerLink}>Events</Link>
              <Link href="/news" className={styles.footerLink}>News</Link>
              <Link href="/gallery" className={styles.footerLink}>Gallery</Link>
              <Link href="/newsletter" className={styles.footerLink}>Newsletter</Link>
              <Link href="/sponsorship" className={styles.footerLink}>Sponsorship</Link>
              <Link href="/studio/dashboard" className={styles.footerLink}>My Downloads</Link>
              <Link href="/launch/dashboard" className={styles.footerLink}>My Portfolios</Link>
            </nav>
          </div>

          {/* Contact / Technologies */}
          <div className={styles.footerCol}>
            <h5>Contact</h5>
            <nav className={styles.footerLinks}>
              <a href="mailto:info@lumyn.co.ke" className={styles.footerLink}>info@lumyn.co.ke</a>
              <a href="mailto:support@lumyn.co.ke" className={styles.footerLink}>support@lumyn.co.ke</a>
              <a href="https://www.google.com/maps?q=Nairobi,Kenya" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Nairobi, Kenya</a>
            </nav>
            <div className={styles.techCategories}>
              <div className={styles.techCategory}>
                <span className={styles.techCategoryTitle}>Frontend</span>
                <div className={styles.techLinks}>
                  <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>React</a>
                  <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Next.js</a>
                  <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>TypeScript</a>
                </div>
              </div>
              <div className={styles.techCategory}>
                <span className={styles.techCategoryTitle}>Backend</span>
                <div className={styles.techLinks}>
                  <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Node.js</a>
                  <a href="https://www.python.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Python</a>
                  <a href="https://go.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Go</a>
                </div>
              </div>
              <div className={styles.techCategory}>
                <span className={styles.techCategoryTitle}>Cloud</span>
                <div className={styles.techLinks}>
                  <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>AWS</a>
                  <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>GCP</a>
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Vercel</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.fbRow}>
            <p className={styles.fbCopy}>&copy; {new Date().getFullYear()} LUMYN TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
            <div className={styles.fbLegal}>
              <Link href="/privacy" className={styles.fbLegalLink}>Privacy</Link>
              <span className={styles.fbSeparator}>/</span>
              <Link href="/terms" className={styles.fbLegalLink}>Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
