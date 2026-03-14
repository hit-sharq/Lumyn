
import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Lumyn</h3>
            <p className={styles.footerText}>
              Modern digital solutions company. Transforming businesses with innovative technology and exceptional user experiences.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">in</a>
              <a href="https://www.instagram.com/j_lee087/" className={styles.socialLink} aria-label="Instagram">ig</a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">x</a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Company</h4>
            <nav className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>About</Link>
              <Link href="/projects" className={styles.footerLink}>Projects</Link>
              <Link href="/events" className={styles.footerLink}>Events</Link>
              <Link href="/news" className={styles.footerLink}>News</Link>
              <Link href="/careers" className={styles.footerLink}>Careers</Link>
              <Link href="/partners" className={styles.footerLink}>Partners</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
            </nav>
          </div>

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
            </nav>
          </div>

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
            Available for projects
          </div>
        </div>
      </div>
    </footer>
  )
}

