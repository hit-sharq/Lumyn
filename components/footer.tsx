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

          {/* Resources */}
          <div className={styles.footerCol}>
            <h5>Resources</h5>
            <nav className={styles.footerLinks}>
              <Link href="/blog" className={styles.footerLink}>Blog</Link>
              <Link href="/events" className={styles.footerLink}>Events</Link>
              <Link href="/news" className={styles.footerLink}>News</Link>
              <Link href="/gallery" className={styles.footerLink}>Gallery</Link>
              <Link href="/newsletter" className={styles.footerLink}>Newsletter</Link>
            </nav>
          </div>

          {/* Technologies */}
          <div className={styles.footerCol}>
            <h5>Technologies</h5>
            <div className={styles.technologyList}>
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>React</a>
              <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Next.js</a>
              <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>TypeScript</a>
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer" className={styles.techLink}>JavaScript</a>
              <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Node.js</a>
              <a href="https://www.python.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Python</a>
              <a href="https://go.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Go</a>
              <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Tailwind CSS</a>
              <a href="https://www.postgresql.org" target="_blank" rel="noopener noreferrer" className={styles.techLink}>PostgreSQL</a>
              <a href="https://www.prisma.io" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Prisma</a>
              <a href="https://www.radix-ui.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Radix UI</a>
              <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Framer Motion</a>
              <a href="https://zod.dev" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Zod</a>
              <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Clerk</a>
              <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Cloudinary</a>
              <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Resend</a>
              <a href="https://onesignal.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>OneSignal</a>
              <a href="https://developer.safaricom.co.ke/" target="_blank" rel="noopener noreferrer" className={styles.techLink}>M-Pesa Daraja</a>
              <a href="https://www.pesapal.com/" target="_blank" rel="noopener noreferrer" className={styles.techLink}>PesaPal</a>
              <a href="https://africastalking.com/" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Africa&apos;s Talking</a>
              <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>OpenAI</a>
              <a href="https://www.anthropic.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Anthropic</a>
              <a href="https://ai.google/" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Google AI</a>
              <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>AWS</a>
              <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Google Cloud</a>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className={styles.techLink}>Vercel</a>
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
