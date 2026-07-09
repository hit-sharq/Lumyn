/**
 * Seed script: creates sample Launch portfolios using the portfolio templates.
 * Run with: npx tsx scripts/seed-launch-portfolios.ts
 * Requires DATABASE_URL to be set.
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const portfolios = [
  {
    userId: "demo-user-1",
    userEmail: "alex@example.com",
    username: "alex",
    displayName: "Alex",
    templateId: "minimal-dev",
    isPublished: true,
    title: "Full-stack developer specializing in building exceptional digital experiences.",
    about: "With over 7 years of experience, I've worked at startups, agencies, and enterprise companies. My main focus these days is building inclusive products and digital experiences.",
    avatarUrl: "",
    skills: ["TypeScript", "React", "Node.js", "Next.js", "PostgreSQL", "GraphQL", "Docker", "AWS"],
    socialLinks: {
      github: "https://github.com/alex",
      linkedin: "https://linkedin.com/in/alex",
      twitter: "https://twitter.com/alex",
    },
    projects: [
      {
        title: "DevMetrics Dashboard",
        description: "Real-time analytics platform for engineering teams to track sprint velocity, code review time, and deployment frequency.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-436666de90b4?w=800&q=80",
        liveUrl: "https://example.com/devmetrics",
        githubUrl: "https://github.com/alex/devmetrics",
        tags: ["React", "D3.js", "Node"],
        order: 0,
      },
      {
        title: "OpenAPI Studio",
        description: "Browser-based API design tool with collaborative editing, spec validation, and instant mock server generation.",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
        liveUrl: "https://example.com/openapi-studio",
        githubUrl: "https://github.com/alex/openapi-studio",
        tags: ["TypeScript", "Monaco", "WebSocket"],
        order: 1,
      },
      {
        title: "Cloud Deploy CLI",
        description: "Zero-config deployment CLI for containerized apps. One command to build, push, and deploy to any cloud provider.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        liveUrl: "https://example.com/cloud-deploy",
        githubUrl: "https://github.com/alex/cloud-deploy",
        tags: ["Go", "Docker", "AWS"],
        order: 2,
      },
    ],
  },
  {
    userId: "demo-user-2",
    userEmail: "sarah@example.com",
    username: "sarah",
    displayName: "Sarah",
    templateId: "creative-designer",
    isPublished: true,
    title: "Brand & Product Designer based in Nairobi. I help startups and brands create visual identities that resonate and convert.",
    about: "I'm Sarah, a multidisciplinary designer with 8+ years of experience crafting brands, products, and digital experiences. I believe great design sits at the intersection of aesthetics and purpose.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
    skills: ["Brand Strategy", "UI/UX Design", "Figma", "Adobe Creative Suite", "Motion Graphics", "Prototyping", "Design Systems", "Illustration", "Art Direction", "User Research"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarah",
      twitter: "https://twitter.com/sarah",
      website: "https://sarah.design",
    },
    projects: [
      {
        title: "Lumina Wellness",
        description: "Complete rebrand for a wellness startup including logo, typography, color system, and packaging design.",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        liveUrl: "https://example.com/lumina",
        tags: ["Branding", "Packaging", "Art Direction"],
        order: 0,
      },
      {
        title: "NeoBank Mobile",
        description: "End-to-end mobile banking experience design focusing on simplicity, trust, and financial empowerment.",
        imageUrl: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80",
        liveUrl: "https://example.com/neobank",
        tags: ["Figma", "Prototyping", "Design System"],
        order: 1,
      },
    ],
  },
  {
    userId: "demo-user-3",
    userEmail: "james@example.com",
    username: "james",
    displayName: "James",
    templateId: "professional",
    isPublished: true,
    title: "Senior Product Designer & Strategist",
    about: "I'm James, a senior product designer with 10+ years leading design at high-growth startups and consultancies. My work spans end-to-end product design, design systems, and design strategy.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    skills: ["Product Strategy", "Design Systems", "User Research", "Prototyping", "Interaction Design", "Web / Mobile", "Design Tokens", "Workshops"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/james",
      twitter: "https://twitter.com/james",
      website: "https://james.design",
    },
    projects: [
      {
        title: "Payments Platform Redesign",
        description: "Led end-to-end redesign of a B2B payments dashboard used by 2,000+ businesses, improving task completion by 34%.",
        imageUrl: "",
        liveUrl: "https://example.com/payments-platform",
        tags: ["Figma", "Design System", "User Research"],
        order: 0,
      },
      {
        title: "HealthTech Scale-up",
        description: "Established design org practices, hiring roadmap, and a component library adopted across 4 squads.",
        imageUrl: "",
        liveUrl: "https://example.com/healthtech",
        tags: ["Org Design", "Systems", "Tokens"],
        order: 1,
      },
      {
        title: "Marketplace iOS",
        description: "Designed a peer-to-peer marketplace flow from onboarding to transaction, lifting retention by 21%.",
        imageUrl: "",
        liveUrl: "https://example.com/marketplace-ios",
        tags: ["iOS", "Prototyping", "Analytics"],
        order: 2,
      },
    ],
  },
]

async function main() {
  console.log("🌱 Seeding Launch portfolios…\n")

  for (const p of portfolios) {
    const existing = await prisma.launchPortfolio.findFirst({
      where: { username: p.username },
    })

    if (existing) {
      console.log(`  ± "@${p.username}" already exists, skipping.`)
      continue
    }

    const portfolio = await prisma.launchPortfolio.create({
      data: {
        userId: p.userId,
        userEmail: p.userEmail,
        username: p.username,
        displayName: p.displayName,
        templateId: p.templateId,
        isPublished: p.isPublished,
        title: p.title,
        about: p.about,
        avatarUrl: p.avatarUrl,
        skills: p.skills,
        socialLinks: p.socialLinks,
        projects: {
          create: p.projects.map((project) => ({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            tags: project.tags,
            order: project.order,
          })),
        },
      },
    })

    console.log(`  ✅ Created portfolio: "@${portfolio.username}" (${portfolio.templateId})`)
    console.log(`     → View at: /portfolio/${portfolio.username}`)
  }

  console.log("\nDone!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
