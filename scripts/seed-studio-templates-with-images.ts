/**
 * Seed script: creates a full catalog of production-ready templates from the templates/ folder.
 * Reads HTML from templates/<name>/index.html and uploads preview images to Cloudinary.
 * Run with: npx tsx scripts/seed-studio-templates-with-images.ts
 * Requires DATABASE_URL + Cloudinary credentials to be set.
 */
import { PrismaClient } from "@prisma/client"
import { readFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { v2 as cloudinary } from "cloudinary"

const __dirname = dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dtkadempd",
  api_key: process.env.CLOUDINARY_API_KEY || "364618325885778",
  api_secret: process.env.CLOUDINARY_API_SECRET || "NoD6maJhkktT59FKMAlD7ofq5_s",
})

const templates = [
  {
    title: "Lumyn Creator Portfolio",
    description:
      "A dark-mode-first portfolio for developers and designers. Features hero, project grid, skills, testimonials, and contact form. Built with clean semantic HTML and modern CSS.",
    category: "Portfolio",
    tags: ["Portfolio", "Developer", "Dark Mode", "Responsive"],
    isFree: false,
    price: 1499,
    featured: true,
    isPublished: true,
    htmlFile: "creator-portfolio",
  },
  {
    title: "SaaS Landing Kit",
    description:
      "A conversion-focused SaaS landing page with hero, features, pricing, testimonials, FAQ, and CTA sections. Optimized for signups and built with clean HTML/CSS.",
    category: "SaaS",
    tags: ["SaaS", "Landing Page", "Pricing", "Responsive"],
    isFree: true,
    price: 0,
    featured: true,
    isPublished: true,
    htmlFile: "saas-landing",
  },
  {
    title: "Minimal Blog Theme",
    description:
      "A typography-focused blog template designed for readability. Features a clean reading experience, category filters, author bio, and newsletter signup.",
    category: "Blog",
    tags: ["Blog", "Typography", "Minimal", "Reading"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "minimal-blog",
  },
  {
    title: "Shop Minimal E-Commerce",
    description:
      "A complete e-commerce storefront with product grid, category filters, cart sidebar, checkout flow, and mobile navigation. Ready for Stripe or M-Pesa integration.",
    category: "E-Commerce",
    tags: ["E-Commerce", "Shop", "Cart", "Checkout"],
    isFree: false,
    price: 2499,
    featured: true,
    isPublished: true,
    htmlFile: "ecommerce-storefront",
  },
  {
    title: "Freelancer Portfolio",
    description:
      "A clean, professional portfolio for freelancers and agencies. Includes case study layouts, service packages, client logos, and project enquiry form.",
    category: "Portfolio",
    tags: ["Portfolio", "Freelancer", "Agency", "Case Study"],
    isFree: false,
    price: 999,
    featured: false,
    isPublished: true,
    htmlFile: "freelancer-portfolio",
  },
  {
    title: "Agency Landing Page",
    description:
      "A bold agency landing page with hero animations, service cards, team grid, and contact section. Built to impress and convert high-value clients.",
    category: "Business",
    tags: ["Agency", "Business", "Landing Page", "Animation"],
    isFree: false,
    price: 1999,
    featured: false,
    isPublished: true,
    htmlFile: "agency-landing",
  },
  {
    title: "Savour Restaurant & Bistro",
    description:
      "An elegant restaurant template with menu sections, reservation form, gallery, chef bio, and location map. Designed to make mouths water and reservations easy.",
    category: "Restaurant",
    tags: ["Restaurant", "Menu", "Reservation", "Food"],
    isFree: false,
    price: 1999,
    featured: true,
    isPublished: true,
    htmlFile: "restaurant-bistro",
  },
  {
    title: "Wedding & Event",
    description:
      "A romantic wedding template with RSVP form, countdown timer, couple story, gallery, venue map, and gift registry links. Perfect for engagements and special events.",
    category: "Event",
    tags: ["Wedding", "Event", "RSVP", "Countdown"],
    isFree: false,
    price: 1499,
    featured: false,
    isPublished: true,
    htmlFile: "wedding-event",
  },
  {
    title: "Grace Church & Ministry",
    description:
      "A welcoming church website template with service times, sermon archive, event calendar, pastor bio, and giving section. Clean and accessible for all ages.",
    category: "Church",
    tags: ["Church", "Ministry", "Sermons", "Events"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "church-ministry",
  },
  {
    title: "Sunrise School & Academy",
    description:
      "A bright, trustworthy school template with class listings, admissions form, academic calendar, teacher profiles, and parent portal link.",
    category: "School",
    tags: ["School", "Education", "Academy", "Admissions"],
    isFree: false,
    price: 2499,
    featured: false,
    isPublished: true,
    htmlFile: "school-academy",
  },
  {
    title: "Pillar Real Estate",
    description:
      "A premium real estate template with property listings grid, search filters, agent profiles, neighbourhood guides, and a mortgage calculator.",
    category: "Real Estate",
    tags: ["Real Estate", "Property", "Listings", "Agent"],
    isFree: false,
    price: 2999,
    featured: true,
    isPublished: true,
    htmlFile: "real-estate",
  },
  {
    title: "MediCare Health Clinic",
    description:
      "A clean, calming medical template with service list, doctor profiles, appointment booking, patient resources, and insurance information.",
    category: "Medical",
    tags: ["Medical", "Health", "Clinic", "Appointment"],
    isFree: false,
    price: 2499,
    featured: false,
    isPublished: true,
    htmlFile: "medical-clinic",
  },
  {
    title: "Hope Foundation NGO",
    description:
      "A compelling nonprofit template with impact metrics, donation form, campaign sections, volunteer recruitment, and annual report highlights.",
    category: "Nonprofit",
    tags: ["Nonprofit", "NGO", "Donation", "Impact"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "nonprofit-ngo",
  },
  {
    title: "Artist & Musician",
    description:
      "A creative portfolio for musicians and artists with audio embeds, tour dates, gallery, merch store links, and press kit section.",
    category: "Musician",
    tags: ["Musician", "Artist", "Portfolio", "Tour"],
    isFree: false,
    price: 1499,
    featured: false,
    isPublished: true,
    htmlFile: "musician-artist",
  },
  {
    title: "Startup Launch Page",
    description:
      "A high-converting startup launch page with email capture, countdown timer, feature highlights, team section, and press mentions. Built for product launches.",
    category: "Landing Page",
    tags: ["Startup", "Launch", "Email Capture", "Countdown"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "startup-launch",
  },
]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function readTemplateHtml(htmlFile: string): string {
  const path = join(process.cwd(), "templates", htmlFile, "index.html")
  if (!existsSync(path)) {
    throw new Error(`Template file not found: ${path}`)
  }
  return readFileSync(path, "utf-8")
}

async function uploadPreviewImage(slug: string, title: string, bg: string, fg: string): Promise<string> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="${fg}" stop-opacity="0.35" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <rect x="60" y="60" width="1080" height="510" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="1"/>
    <text x="600" y="315" font-family="ui-sans-serif, system-ui, sans-serif" font-size="42" font-weight="600" fill="${fg}" text-anchor="middle" dominant-baseline="middle" opacity="0.95">${title}</text>
    <text x="600" y="375" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="400" fill="${fg}" text-anchor="middle" dominant-baseline="middle" opacity="0.65">Lumyn Studio Template</text>
  </svg>`

  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "lumyn/templates",
      public_id: slug,
      overwrite: true,
      resource_type: "image",
    })
    return result.secure_url
  } catch (err) {
    console.error(`  ⚠️ Cloudinary upload failed for "${title}" (${slug}):`, (err as Error).message)
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || "dtkadempd"}/image/upload/lumyn/templates/${slug}`
  }
}

async function main() {
  console.log("🌱 Seeding studio templates with Cloudinary previews…\n")

  for (const tpl of templates) {
    const existing = await prisma.studioTemplate.findFirst({
      where: { title: tpl.title },
    })

    if (existing) {
      console.log(`  ± "${tpl.title}" already exists, skipping.`)
      continue
    }

    const htmlContent = readTemplateHtml(tpl.htmlFile)
    const slug = slugify(tpl.title)

    let previewImage = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || "dtkadempd"}/image/upload/lumyn/templates/${slug}`

    console.log(`  🖼 Uploading preview for "${tpl.title}" (${tpl.category})…`)
    try {
      previewImage = await uploadPreviewImage(
        slug,
        tpl.title,
        "#0b0d14",
        "#e7e1d1"
      )
    } catch (err) {
      console.warn(`  ⚠️ Falling back to inferred Cloudinary URL for "${tpl.title}".`)
    }

    await prisma.studioTemplate.create({
      data: {
        title: tpl.title,
        description: tpl.description,
        category: tpl.category,
        previewImage,
        previewImages: [previewImage],
        tags: tpl.tags,
        isFree: tpl.isFree,
        price: tpl.price,
        featured: tpl.featured,
        isPublished: tpl.isPublished,
        htmlContent,
        cssContent: "",
        jsContent: "",
        downloadUrl: `https://www.lumyn.co.ke/studio`,
      },
    })

    console.log(`  ✅ Created: "${tpl.title}" (KES ${tpl.price})`)
  }

  console.log("\nDone! Visit /studio to see templates.")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
