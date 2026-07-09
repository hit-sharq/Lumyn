/**
 * Seed script: creates a full catalog of production-ready templates from the templates/ folder.
 * Run with: npx tsx scripts/seed-studio-templates-full.ts
 * Requires DATABASE_URL to be set.
 */
import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

const templates = [
  {
    title: "Lumyn Creator Portfolio",
    description:
      "A dark-mode-first portfolio for developers and designers. Features hero, project grid, skills, testimonials, and contact form. Built with clean semantic HTML and modern CSS.",
    category: "Portfolio",
    previewImage:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80",
    ],
    tags: ["Portfolio", "Developer", "Dark Mode", "Responsive"],
    isFree: false,
    price: 1499,
    featured: true,
    isPublished: true,
    htmlFile: "creator-portfolio",
    downloadUrl: "https://example.com/templates/creator-portfolio.zip",
  },
  {
    title: "SaaS Landing Kit",
    description:
      "A conversion-focused SaaS landing page with hero, features, pricing, testimonials, FAQ, and CTA sections. Optimized for signups and built with clean HTML/CSS.",
    category: "SaaS",
    previewImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    ],
    tags: ["SaaS", "Landing Page", "Pricing", "Responsive"],
    isFree: true,
    price: 0,
    featured: true,
    isPublished: true,
    htmlFile: "saas-landing",
    downloadUrl: "https://example.com/templates/saas-landing.zip",
  },
  {
    title: "Minimal Blog Theme",
    description:
      "A typography-focused blog template designed for readability. Features a clean reading experience, category filters, author bio, and newsletter signup.",
    category: "Blog",
    previewImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
      "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&q=80",
    ],
    tags: ["Blog", "Typography", "Minimal", "Reading"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "minimal-blog",
    downloadUrl: "https://example.com/templates/minimal-blog.zip",
  },
  {
    title: "Shop Minimal E-Commerce",
    description:
      "A complete e-commerce storefront with product grid, category filters, cart sidebar, checkout flow, and mobile navigation. Ready for Stripe or M-Pesa integration.",
    category: "E-Commerce",
    previewImage:
      "https://images.unsplash.com/photo-1556742049-0cf9c42b60c2?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1556742049-0cf9c42b60c2?w=1200&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    ],
    tags: ["E-Commerce", "Shop", "Cart", "Checkout"],
    isFree: false,
    price: 2499,
    featured: true,
    isPublished: true,
    htmlFile: "ecommerce-storefront",
    downloadUrl: "https://example.com/templates/ecommerce-storefront.zip",
  },
  {
    title: "Freelancer Portfolio",
    description:
      "A clean, professional portfolio for freelancers and agencies. Includes case study layouts, service packages, client logos, and project enquiry form.",
    category: "Portfolio",
    previewImage:
      "https://images.unsplash.com/photo-1522071820081-009f012c7176?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1522071820081-009f012c7176?w=1200&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80",
    ],
    tags: ["Portfolio", "Freelancer", "Agency", "Case Study"],
    isFree: false,
    price: 999,
    featured: false,
    isPublished: true,
    htmlFile: "freelancer-portfolio",
    downloadUrl: "https://example.com/templates/freelancer-portfolio.zip",
  },
  {
    title: "Agency Landing Page",
    description:
      "A bold agency landing page with hero animations, service cards, team grid, and contact section. Built to impress and convert high-value clients.",
    category: "Business",
    previewImage:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
    ],
    tags: ["Agency", "Business", "Landing Page", "Animation"],
    isFree: false,
    price: 1999,
    featured: false,
    isPublished: true,
    htmlFile: "agency-landing",
    downloadUrl: "https://example.com/templates/agency-landing.zip",
  },
  {
    title: "Savour Restaurant & Bistro",
    description:
      "An elegant restaurant template with menu sections, reservation form, gallery, chef bio, and location map. Designed to make mouths water and reservations easy.",
    category: "Restaurant",
    previewImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    ],
    tags: ["Restaurant", "Menu", "Reservation", "Food"],
    isFree: false,
    price: 1999,
    featured: true,
    isPublished: true,
    htmlFile: "restaurant-bistro",
    downloadUrl: "https://example.com/templates/restaurant-bistro.zip",
  },
  {
    title: "Wedding & Event",
    description:
      "A romantic wedding template with RSVP form, countdown timer, couple story, gallery, venue map, and gift registry links. Perfect for engagements and special events.",
    category: "Event",
    previewImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
    ],
    tags: ["Wedding", "Event", "RSVP", "Countdown"],
    isFree: false,
    price: 1499,
    featured: false,
    isPublished: true,
    htmlFile: "wedding-event",
    downloadUrl: "https://example.com/templates/wedding-event.zip",
  },
  {
    title: "Grace Church & Ministry",
    description:
      "A welcoming church website template with service times, sermon archive, event calendar, pastor bio, and giving section. Clean and accessible for all ages.",
    category: "Church",
    previewImage:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&q=80",
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80",
    ],
    tags: ["Church", "Ministry", "Sermons", "Events"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "church-ministry",
    downloadUrl: "https://example.com/templates/church-ministry.zip",
  },
  {
    title: "Sunrise School & Academy",
    description:
      "A bright, trustworthy school template with class listings, admissions form, academic calendar, teacher profiles, and parent portal link.",
    category: "School",
    previewImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&q=80",
    ],
    tags: ["School", "Education", "Academy", "Admissions"],
    isFree: false,
    price: 2499,
    featured: false,
    isPublished: true,
    htmlFile: "school-academy",
    downloadUrl: "https://example.com/templates/school-academy.zip",
  },
  {
    title: "Pillar Real Estate",
    description:
      "A premium real estate template with property listings grid, search filters, agent profiles, neighbourhood guides, and a mortgage calculator.",
    category: "Real Estate",
    previewImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    ],
    tags: ["Real Estate", "Property", "Listings", "Agent"],
    isFree: false,
    price: 2999,
    featured: true,
    isPublished: true,
    htmlFile: "real-estate",
    downloadUrl: "https://example.com/templates/real-estate.zip",
  },
  {
    title: "MediCare Health Clinic",
    description:
      "A clean, calming medical template with service list, doctor profiles, appointment booking, patient resources, and insurance information.",
    category: "Medical",
    previewImage:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=80",
    ],
    tags: ["Medical", "Health", "Clinic", "Appointment"],
    isFree: false,
    price: 2499,
    featured: false,
    isPublished: true,
    htmlFile: "medical-clinic",
    downloadUrl: "https://example.com/templates/medical-clinic.zip",
  },
  {
    title: "Hope Foundation NGO",
    description:
      "A compelling nonprofit template with impact metrics, donation form, campaign sections, volunteer recruitment, and annual report highlights.",
    category: "Nonprofit",
    previewImage:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80",
    ],
    tags: ["Nonprofit", "NGO", "Donation", "Impact"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "nonprofit-ngo",
    downloadUrl: "https://example.com/templates/nonprofit-ngo.zip",
  },
  {
    title: "Artist & Musician",
    description:
      "A creative portfolio for musicians and artists with audio embeds, tour dates, gallery, merch store links, and press kit section.",
    category: "Musician",
    previewImage:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    ],
    tags: ["Musician", "Artist", "Portfolio", "Tour"],
    isFree: false,
    price: 1499,
    featured: false,
    isPublished: true,
    htmlFile: "musician-artist",
    downloadUrl: "https://example.com/templates/musician-artist.zip",
  },
  {
    title: "Startup Launch Page",
    description:
      "A high-converting startup launch page with email capture, countdown timer, feature highlights, team section, and press mentions. Built for product launches.",
    category: "Landing Page",
    previewImage:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    ],
    tags: ["Startup", "Launch", "Email Capture", "Countdown"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlFile: "startup-launch",
    downloadUrl: "https://example.com/templates/startup-launch.zip",
  },
  {
    title: "THE BIG SIX | Art Marketplace",
    description:
      "A premium art marketplace template for selling original artworks. Features gallery grid, artist profiles, artwork cards, pricing, and an 'Apply to Sell' CTA. Built for curators and collectors.",
    category: "Marketplace",
    previewImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
    ],
    tags: ["Art", "Marketplace", "Gallery", "Premium"],
    isFree: false,
    price: 3499,
    featured: true,
    isPublished: true,
    htmlFile: "art-marketplace",
    downloadUrl: "https://example.com/templates/art-marketplace.zip",
  },
]

function readTemplateHtml(htmlFile: string): string {
  const path = join(process.cwd(), "templates", htmlFile, "index.html")
  return readFileSync(path, "utf-8")
}

async function main() {
  console.log("🌱 Seeding studio templates from templates/ folder…")

  for (const tpl of templates) {
    const existing = await prisma.studioTemplate.findFirst({
      where: { title: tpl.title },
    })

    if (existing) {
      console.log(`  ✓ "${tpl.title}" already exists, skipping.`)
      continue
    }

    const htmlContent = readTemplateHtml(tpl.htmlFile)

    await prisma.studioTemplate.create({
      data: {
        title: tpl.title,
        description: tpl.description,
        category: tpl.category,
        previewImage: tpl.previewImage,
        previewImages: tpl.previewImages,
        tags: tpl.tags,
        isFree: tpl.isFree,
        price: tpl.price,
        featured: tpl.featured,
        isPublished: tpl.isPublished,
        htmlContent,
        cssContent: "",
        jsContent: "",
        downloadUrl: tpl.downloadUrl,
      },
    })

    console.log(`  ✅ Created: "${tpl.title}" (KES ${tpl.price})`)
  }

  console.log("\nDone! Visit /studio to see templates.")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
