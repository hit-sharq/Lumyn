import type { Metadata } from "next"
import { BASE_URL, pageMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo"

const faqs = [
  { question: "What is Lumyn Technologies?", answer: "Lumyn Technologies is a forward-thinking tech company specializing in modern digital solutions. We design and develop high-performance websites, web applications, and digital experiences that help businesses shine online." },
  { question: "What is Lumyn Technologies's mission?", answer: "Our mission is to empower businesses with elegant, efficient, and scalable digital solutions that drive growth and success in the modern digital landscape." },
  { question: "When was Lumyn Technologies founded?", answer: "Lumyn Technologies was founded by Joshua Mwendwa, a passionate software engineer dedicated to crafting seamless user experiences and innovative digital solutions." },
  { question: "What services does Lumyn Technologies offer?", answer: "We offer comprehensive digital solutions including web design and development, branding and digital strategy, full-stack application development, cloud integration and hosting, and ongoing maintenance and security." },
  { question: "Do you work with businesses of all sizes?", answer: "Yes! We work with startups, small businesses, and established companies. Our scalable solutions are designed to grow with your business needs." },
  { question: "How long does a typical project take?", answer: "Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while a full web application could take 8-12 weeks or more." },
  { question: "Do you provide ongoing support?", answer: "Absolutely! We offer maintenance packages for updates, security monitoring, performance optimization, and technical support to ensure your digital assets remain secure and up-to-date." },
  { question: "What is your development process?", answer: "Our process includes discovery and planning, design and prototyping, development and testing, deployment and launch, followed by ongoing maintenance and support." },
  { question: "How do you ensure project quality?", answer: "We follow industry best practices with thorough testing, code reviews, performance optimization, and security audits. We also provide regular updates and feedback sessions throughout the project." },
  { question: "How much do your services cost?", answer: "Our pricing depends on project scope, complexity, and timeline. We provide custom quotes after understanding your specific needs. Contact us for a free consultation and detailed proposal." },
  { question: "Do you offer payment plans?", answer: "Yes, we offer flexible payment terms for larger projects. We typically require a deposit to begin work, with milestone payments throughout the project lifecycle." },
  { question: "How do I contact Lumyn Technologies?", answer: "You can reach us through our contact form on the website or email us directly. We'll respond to all inquiries within 24 hours and schedule a free consultation to discuss your project needs." },
]

export const metadata: Metadata = pageMetadata({
  title: "FAQ | Lumyn Technologies",
  description:
    "Find answers to frequently asked questions about Lumyn Technologies — accounts, portfolios, Market, Hire, Studio, and more.",
  path: "/faq",
  keywords: ["FAQ", "help", "questions", "Lumyn Technologies support", "how does Lumyn Technologies work"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: BASE_URL },
        { name: "FAQ", url: `${BASE_URL}/faq` },
      ])}
      {faqJsonLd(faqs)}
      {children}
    </>
  )
}
