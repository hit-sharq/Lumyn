import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>KESA - UMN</h3>
            <p className={styles.footerText}>
              Kenyan Student Association at the University of Minnesota. Building community and celebrating culture.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <nav className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
              <Link href="/events" className={styles.footerLink}>
                Events
              </Link>
              <Link href="/news" className={styles.footerLink}>
                News
              </Link>
              <Link href="/gallery" className={styles.footerLink}>
                Gallery
              </Link>
              <Link href="/faq" className={styles.footerLink}>
                FAQ
              </Link>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Get Involved</h4>
            <nav className={styles.footerLinks}>
              <Link href="/membership" className={styles.footerLink}>
                Join KESA
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
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                KE
              </a>
              <a
                href="https://www.instagram.com/kesa.umn?igsh=MW0yYWJsdTY1b3N6eQ=="
                className={styles.socialLink}
                aria-label="Instagram"
              >
                IG
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                SA
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
            © {new Date().getFullYear()} Kenyan Student Association - University of Minnesota. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
