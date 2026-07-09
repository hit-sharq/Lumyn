import { readFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const TEMPLATE_MAP: Record<string, string> = {
  "minimal-dev": "minimal-dev",
  "creative-designer": "creative-designer",
  "professional": "professional",
  "minimal-blog": "minimal-blog",
  "saas": "saas-landing",
  "startup": "startup-launch",
  "restaurant": "restaurant-bistro",
  "wedding": "wedding-event",
  "church": "church-ministry",
  "medical": "medical-clinic",
  "school": "school-academy",
  "real-estate": "real-estate",
  "nonprofit": "nonprofit-ngo",
  "musician": "musician-artist",
  "ecommerce": "ecommerce-storefront",
}

const DEFAULT_TEMPLATE = "minimal-dev"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function buildAvatarHtml(avatarUrl?: string, displayName = ""): string {
  const initial = (displayName || "?").charAt(0).toUpperCase()
  if (avatarUrl) {
    return `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(displayName)}" loading="eager">`
  }
  return `<span>${escapeHtml(initial)}</span>`
}

function buildLinksHtml(socialLinks: Record<string, string>): string {
  const links: string[] = []
  if (socialLinks.github) links.push(`<a href="${escapeHtml(socialLinks.github)}" target="_blank" rel="noreferrer" class="social-link">GitHub</a>`)
  if (socialLinks.linkedin) links.push(`<a href="${escapeHtml(socialLinks.linkedin)}" target="_blank" rel="noreferrer" class="social-link">LinkedIn</a>`)
  if (socialLinks.twitter) links.push(`<a href="${escapeHtml(socialLinks.twitter)}" target="_blank" rel="noreferrer" class="social-link">Twitter</a>`)
  if (socialLinks.website) links.push(`<a href="${escapeHtml(socialLinks.website)}" target="_blank" rel="noreferrer" class="social-link">Website</a>`)
  return links.join("")
}

function buildContactLinksHtml(socialLinks: Record<string, string>): string {
  const links: string[] = []
  if (socialLinks.github) links.push(`<a href="${escapeHtml(socialLinks.github)}" target="_blank" rel="noreferrer" class="contact-social">GH</a>`)
  if (socialLinks.linkedin) links.push(`<a href="${escapeHtml(socialLinks.linkedin)}" target="_blank" rel="noreferrer" class="contact-social">LI</a>`)
  if (socialLinks.twitter) links.push(`<a href="${escapeHtml(socialLinks.twitter)}" target="_blank" rel="noreferrer" class="contact-social">TW</a>`)
  if (socialLinks.website) links.push(`<a href="${escapeHtml(socialLinks.website)}" target="_blank" rel="noreferrer" class="contact-social">WB</a>`)
  return links.join("")
}

function buildSkillsHtml(skills: string[]): string {
  if (!skills.length) return ""
  return skills
    .map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
    .join("")
}

function buildProjectsHtml(projects: any[]): string {
  if (!projects.length) return ""
  return projects
    .map((p) => {
      const tags = (p.tags || [])
        .map((t: string) => `<span class="project-tag">${escapeHtml(t)}</span>`)
        .join("")
      return `<div class="project-card reveal d1">
        <div class="project-img">
          ${p.imageUrl ? `<img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy">` : ""}
        </div>
        <div class="project-info">
          <div class="project-title">${escapeHtml(p.title)}</div>
          <p class="project-desc">${escapeHtml(p.description || "")}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-links">
            ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noreferrer" class="project-link">Live ↗</a>` : ""}
            ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noreferrer" class="project-link">GitHub ↗</a>` : ""}
          </div>
        </div>
      </div>`
    })
    .join("")
}

export function renderPortfolioTemplate(templateHtml: string, portfolio: any): string {
  const socialLinks = (portfolio.socialLinks || {}) as Record<string, string>
  const projects = (portfolio.projects || []) as any[]
  const skills = (portfolio.skills || []) as string[]

  const data: Record<string, string> = {
    displayName: portfolio.displayName || "",
    title: portfolio.title || "",
    about: portfolio.about || "",
    email: portfolio.userEmail || "",
    username: portfolio.username || "",
    years: "",
    projectsCount: String(projects.length),
  }

  const pageTitle = portfolio.displayName
    ? `${portfolio.displayName} | Portfolio`
    : "Portfolio"

  let html = templateHtml.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`)

  for (const [key, value] of Object.entries(data)) {
    html = html.split(`{{${key}}}`).join(escapeHtml(value))
  }

  html = html.replace("{{avatarHtml}}", buildAvatarHtml(portfolio.avatarUrl, portfolio.displayName))
  html = html.replace("{{skillsHtml}}", buildSkillsHtml(skills))
  html = html.replace("{{projectsHtml}}", buildProjectsHtml(projects))
  html = html.replace("{{linksHtml}}", buildLinksHtml(socialLinks))
  html = html.replace("{{contactLinksHtml}}", buildContactLinksHtml(socialLinks))
  html = html.replace(/class="reveal(?![\w-])/g, 'class="reveal in')
  html = html.replace(/(<style[^>]*>)/i, `$1.reveal{opacity:1!important;transform:none!important;transition:none!important;}`)

  return html
}

export function getPortfolioTemplatePath(templateId: string): string {
  const templateFile = TEMPLATE_MAP[templateId || ""] || DEFAULT_TEMPLATE
  return join(process.cwd(), "templates/portfolios", templateFile, "index.html")
}

export function loadPortfolioTemplate(templateId: string): string {
  const templatePath = getPortfolioTemplatePath(templateId)
  if (!existsSync(templatePath)) {
    return `<!DOCTYPE html><html><body><h1>Portfolio</h1><p>Preview template not found.</p></body></html>`
  }
  return readFileSync(templatePath, "utf-8")
}
