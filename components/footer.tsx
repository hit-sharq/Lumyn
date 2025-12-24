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
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <nav className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
              <Link href="/projects" className={styles.footerLink}>
                Projects
              </Link>
              <Link href="/events" className={styles.footerLink}>
                Events
              </Link>
              <Link href="/news" className={styles.footerLink}>
                News & Blog
              </Link>
              <Link href="/gallery" className={styles.footerLink}>
                Gallery
              </Link>
              <Link href="/partners" className={styles.footerLink}>
                Partners
              </Link>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Get Involved</h4>
            <nav className={styles.footerLinks}>
              <Link href="/get-started" className={styles.footerLink}>
                Start Project
              </Link>
              <Link href="/sponsorship" className={styles.footerLink}>
                Sponsorship
              </Link>
              <Link href="/contact" className={styles.footerLink}>
                Contact Us
              </Link>
              <Link href="/newsletter" className={styles.footerLink}>
                Newsletter
              </Link>
              <Link href={"/careers"} className={styles.footerLink}>
                Careers
              </Link>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                L
              </a>
              <a
                href="https://www.instagram.com/j_lee087/"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                Y
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                M
              </a>
            </div>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>
                Privacy Policy
              </Link>
              <span className={styles.separator}>•</span>
              <Link href="/terms" className={styles.legalLink}>
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Lumyn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
