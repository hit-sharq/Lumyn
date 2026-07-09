/**
 * Seed script: creates professional example templates in the database.
 * Run with: npx tsx scripts/seed-studio-template.ts
 * Requires DATABASE_URL to be set.
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const templates = [
  {
    title: "Lumyn Creator Portfolio",
    description:
      "A sleek, dark-mode-first portfolio template built for digital creators, developers, and designers. Includes sections for hero, work showcase, testimonials, contact form, and blog. Fully responsive and ready to deploy.",
    category: "Portfolio",
    previewImage:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    ],
    tags: ["Next.js", "Tailwind CSS", "Dark Mode", "TypeScript", "Responsive"],
    isFree: false,
    price: 1499,
    featured: true,
    isPublished: true,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creator Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
  <header class="border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold tracking-tight">Creator Name</h1>
      <nav class="hidden md:flex gap-8 text-sm text-gray-400">
        <a href="#work" class="hover:text-white transition">Work</a>
        <a href="#about" class="hover:text-white transition">About</a>
        <a href="#contact" class="hover:text-white transition">Contact</a>
      </nav>
    </div>
  </header>
  <section class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-sm uppercase tracking-widest text-gray-500 mb-4">Digital Creator</p>
      <h2 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">Building digital experiences that matter</h2>
      <p class="text-gray-400 text-lg max-w-2xl mx-auto">I design and build accessible, pixel-perfect interfaces for forward-thinking brands.</p>
    </div>
  </section>
  <section id="work" class="py-24 px-6 bg-gray-950">
    <div class="max-w-6xl mx-auto">
      <h3 class="text-3xl font-bold mb-12">Selected Work</h3>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="aspect-video bg-gray-800 rounded-xl"></div>
        <div class="aspect-video bg-gray-800 rounded-xl"></div>
        <div class="aspect-video bg-gray-800 rounded-xl"></div>
        <div class="aspect-video bg-gray-800 rounded-xl"></div>
      </div>
    </div>
  </section>
  <footer class="py-12 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
    &copy; 2025 Creator Name. All rights reserved.
  </footer>
</body>
</html>`,
    cssContent: "",
    jsContent: "",
    downloadUrl: "https://example.com/templates/creator-portfolio.zip",
  },
  {
    title: "SaaS Starter Kit",
    description:
      "A production-ready SaaS landing page template with pricing tables, feature grids, testimonials, FAQ accordion, and a dark/light toggle. Optimised for conversion and built with clean semantic HTML.",
    category: "SaaS",
    previewImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    ],
    tags: ["HTML", "CSS", "JavaScript", "SaaS", "Landing Page"],
    isFree: true,
    price: 0,
    featured: true,
    isPublished: true,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Starter Kit</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-gray-900">
  <header class="border-b">
    <div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
      <h1 class="text-xl font-bold">SaaSKit</h1>
      <a href="#pricing" class="text-sm font-medium bg-gray-900 text-white px-5 py-2 rounded-full">Get Started</a>
    </div>
  </header>
  <section class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-5xl font-bold mb-6 tracking-tight">Ship your SaaS faster</h2>
      <p class="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">Everything you need to launch a beautiful, high-converting SaaS website.</p>
      <div class="flex justify-center gap-4">
        <a href="#pricing" class="bg-gray-900 text-white px-8 py-3 rounded-full font-medium">Start free trial</a>
        <a href="#features" class="border border-gray-300 px-8 py-3 rounded-full font-medium">See features</a>
      </div>
    </div>
  </section>
  <section id="features" class="py-24 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div>
        <h3 class="font-bold text-lg mb-2">Analytics</h3>
        <p class="text-gray-500">Understand your users with built-in dashboards.</p>
      </div>
      <div>
        <h3 class="font-bold text-lg mb-2">Automation</h3>
        <p class="text-gray-500">Save time with workflows that run themselves.</p>
      </div>
      <div>
        <h3 class="font-bold text-lg mb-2">Integrations</h3>
        <p class="text-gray-500">Connect the tools your team already uses.</p>
      </div>
    </div>
  </section>
  <footer class="py-12 px-6 border-t text-center text-gray-500 text-sm">
    &copy; 2025 SaaSKit Inc.
  </footer>
</body>
</html>`,
    cssContent: "",
    jsContent: "",
    downloadUrl: "https://example.com/templates/saas-starter.zip",
  },
  {
    title: "Minimal Blog Theme",
    description:
      "A typography-focused blog template designed for readability. Features a clean reading experience, category filters, author bio section, and a newsletter signup form.",
    category: "Blog",
    previewImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
      "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&q=80",
    ],
    tags: ["Blog", "Typography", "Minimal", "Responsive"],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minimal Blog</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-gray-900">
  <header class="border-b">
    <div class="max-w-3xl mx-auto px-6 py-10 text-center">
      <h1 class="text-3xl font-bold mb-2">The Minimal Blog</h1>
      <p class="text-gray-500">Thoughts on design, code, and the web.</p>
    </div>
  </header>
  <main class="max-w-3xl mx-auto px-6 py-12">
    <article class="mb-16">
      <h2 class="text-2xl font-bold mb-3">Designing for readability</h2>
      <p class="text-gray-500 text-sm mb-4">June 12, 2025 · 5 min read</p>
      <p class="text-gray-700 leading-relaxed">Good typography is invisible. It guides the reader through content without drawing attention to itself. In this post we explore line length, measure, and the golden ratio for comfortable reading on screens.</p>
    </article>
    <article class="mb-16">
      <h2 class="text-2xl font-bold mb-3">The case for static sites</h2>
      <p class="text-gray-500 text-sm mb-4">May 28, 2025 · 4 min read</p>
      <p class="text-gray-700 leading-relaxed">Static sites are fast, secure, and cheap to host. With the rise of edge rendering, there has never been a better time to go static.</p>
    </article>
  </main>
  <footer class="py-12 px-6 border-t text-center text-gray-500 text-sm">
    &copy; 2025 Minimal Blog
  </footer>
</body>
</html>`,
    cssContent: "",
    jsContent: "",
    downloadUrl: "https://example.com/templates/minimal-blog.zip",
  },
  {
    title: "E-Commerce Storefront",
    description:
      "A complete e-commerce frontend template with product grids, quick view modals, cart drawer, checkout flow, and responsive mobile navigation. Ready for Stripe integration.",
    category: "E-Commerce",
    previewImage:
      "https://images.unsplash.com/photo-1556742049-0cf9c42b60c2?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1556742049-0cf9c42b60c2?w=1200&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    ],
    tags: ["E-Commerce", "Cart", "Checkout", "Responsive"],
    isFree: false,
    price: 2499,
    featured: true,
    isPublished: true,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shop Minimal</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-gray-900">
  <header class="border-b sticky top-0 bg-white/80 backdrop-blur">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Shop Minimal</h1>
      <nav class="hidden md:flex gap-8 text-sm text-gray-600">
        <a href="#" class="hover:text-black">New Arrivals</a>
        <a href="#" class="hover:text-black">Shop</a>
        <a href="#" class="hover:text-black">About</a>
      </nav>
      <button class="text-sm font-medium border rounded-full px-4 py-2">Cart (0)</button>
    </div>
  </header>
  <section class="py-24 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-10">New Arrivals</h2>
      <div class="grid md:grid-cols-4 gap-8">
        <div class="group">
          <div class="aspect-square bg-gray-200 rounded-xl mb-4"></div>
          <h3 class="font-medium">Product One</h3>
          <p class="text-gray-500 text-sm">KES 2,499</p>
        </div>
        <div class="group">
          <div class="aspect-square bg-gray-200 rounded-xl mb-4"></div>
          <h3 class="font-medium">Product Two</h3>
          <p class="text-gray-500 text-sm">KES 3,999</p>
        </div>
        <div class="group">
          <div class="aspect-square bg-gray-200 rounded-xl mb-4"></div>
          <h3 class="font-medium">Product Three</h3>
          <p class="text-gray-500 text-sm">KES 1,299</p>
        </div>
        <div class="group">
          <div class="aspect-square bg-gray-200 rounded-xl mb-4"></div>
          <h3 class="font-medium">Product Four</h3>
          <p class="text-gray-500 text-sm">KES 4,499</p>
        </div>
      </div>
    </div>
  </section>
  <footer class="py-12 px-6 border-t text-center text-gray-500 text-sm">
    &copy; 2025 Shop Minimal
  </footer>
</body>
</html>`,
    cssContent: "",
    jsContent: "",
    downloadUrl: "https://example.com/templates/ecommerce-storefront.zip",
  },
  {
    title: "Freelancer Portfolio",
    description:
      "A clean, professional portfolio for freelancers and agencies. Includes case study layouts, service packages, client logos, and a project enquiry form.",
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
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Freelancer Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-gray-900">
  <header class="border-b">
    <div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Jane Doe</h1>
      <a href="#contact" class="text-sm font-medium border rounded-full px-5 py-2">Hire me</a>
    </div>
  </header>
  <section class="py-24 px-6">
    <div class="max-w-3xl">
      <p class="text-sm uppercase tracking-widest text-gray-500 mb-4">Freelance Designer</p>
      <h2 class="text-4xl font-bold mb-6">I help brands stand out through thoughtful design.</h2>
      <p class="text-gray-600 text-lg leading-relaxed">Based in Nairobi. Working with startups and established brands across Africa and beyond.</p>
    </div>
  </section>
  <section class="py-24 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h3 class="text-2xl font-bold mb-12">Selected Projects</h3>
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <div class="aspect-video bg-gray-200 rounded-xl mb-4"></div>
          <h4 class="font-bold text-lg">Brand Identity for FinTech Startup</h4>
          <p class="text-gray-500 text-sm">Branding, UI Kit</p>
        </div>
        <div>
          <div class="aspect-video bg-gray-200 rounded-xl mb-4"></div>
          <h4 class="font-bold text-lg">E-Commerce Redesign</h4>
          <p class="text-gray-500 text-sm">UX, Frontend</p>
        </div>
      </div>
    </div>
  </section>
  <footer class="py-12 px-6 border-t text-center text-gray-500 text-sm">
    &copy; 2025 Jane Doe
  </footer>
</body>
</html>`,
    cssContent: "",
    jsContent: "",
    downloadUrl: "https://example.com/templates/freelancer-portfolio.zip",
  },
  {
    title: "Agency Landing Page",
    description:
      "A bold agency landing page with hero animations, service cards, team grid, and a contact section. Built to impress and convert high-value clients.",
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
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studio Agency</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white">
  <header class="border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Studio Agency</h1>
      <a href="#contact" class="text-sm font-medium bg-white text-black px-5 py-2 rounded-full">Start a project</a>
    </div>
  </header>
  <section class="py-32 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-5xl md:text-6xl font-bold mb-8 leading-tight">We design products that people love.</h2>
      <p class="text-gray-400 text-xl max-w-2xl">A full-service digital agency specialising in brand, product, and experience design.</p>
    </div>
  </section>
  <section class="py-24 px-6">
    <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div>
        <h3 class="font-bold text-lg mb-2">Brand</h3>
        <p class="text-gray-400">Identity, strategy, and guidelines that set you apart.</p>
      </div>
      <div>
        <h3 class="font-bold text-lg mb-2">Product</h3>
        <p class="text-gray-400">UX, UI, and prototyping for web and mobile.</p>
      </div>
      <div>
        <h3 class="font-bold text-lg mb-2">Development</h3>
        <p class="text-gray-400">Frontend and backend engineering with modern stacks.</p>
      </div>
    </div>
  </section>
  <footer class="py-12 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
    &copy; 2025 Studio Agency
  </footer>
</body>
</html>`,
    cssContent: "",
    jsContent: "",
    downloadUrl: "https://example.com/templates/agency-landing.zip",
  },
]

async function main() {
  console.log("🌱 Seeding studio templates…")

  for (const tpl of templates) {
    const existing = await prisma.studioTemplate.findFirst({
      where: { title: tpl.title },
    })

    if (existing) {
      console.log(`  ✓ "${tpl.title}" already exists, skipping.`)
      continue
    }

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
        htmlContent: tpl.htmlContent,
        cssContent: tpl.cssContent,
        jsContent: tpl.jsContent,
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
