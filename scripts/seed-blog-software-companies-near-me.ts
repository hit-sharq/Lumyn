/**
 * Seed script: publishes the local-intent article "Software Companies Near Me".
 *
 * Run with: npx tsx scripts/seed-blog-software-companies-near-me.ts
 * Requires DATABASE_URL to be set.
 *
 * Targets the query "software companies near me" (visible in Search Console for
 * this site). Idempotent: matches on title and updates in place, so re-running
 * does not create duplicates.
 */
import { PrismaClient } from "@prisma/client"
import sanitizeHtml from "sanitize-html"

const prisma = new PrismaClient()

const post = {
  title: "Software Companies Near Me: How to Choose One in Nairobi",
  excerpt:
    "How to compare software companies near you in Nairobi: the questions, pricing signals and red flags that show who will actually deliver the project.",
  category: "Software Development",
  author: "Lumyn Technologies",
  tags: [
    "software development",
    "Nairobi",
    "Kenya",
    "M-Pesa",
    "web development",
    "hiring developers",
  ],
  // Local asset: images.unsplash.com is blocked by next.config remotePatterns and
  // by the production CSP img-src list. Swap for a Cloudinary or local 1200x630
  // asset when a bespoke hero is ready.
  image: "/og-image.png",
  isPublished: true,
  featured: false,
  content: `<p>If you have typed "software companies near me" into Google, you are probably doing one of three things: pricing a project, replacing a vendor who disappeared, or trying to work out which of the twenty agencies in Nairobi is actually capable of building what you need. All three are legitimate. All three fail the same way — most buyers compare on price and portfolio photographs, then discover the difference between a website and a product when it is too late to change vendors cheaply.</p>

<p>Proximity is worth something. A team in your timezone, in your market, reachable when something breaks on a Friday afternoon, is genuinely easier to work with than one twelve hours away. But "near me" is the start of a search, not the finish line. The companies that survive contact with a real project are the ones that can explain scope, own their code, and tell you honestly what your budget will and will not buy.</p>

<p>This is the checklist we would hand you, whether you end up hiring us or not.</p>

<h2>What "software companies near me" actually returns</h2>

<p>Search results for this query are split three ways: a local map pack at the top, a set of directory and listing pages in the middle, and the websites themselves further down. The map pack is driven by your Google Business Profile, proximity, reviews, and your service-area settings — not by the quality of your code. That is worth knowing, because no amount of content on a blog post will put you in that box. It is won with a claimed profile, real reviews, and consistent address and phone data across the web.</p>

<p>Below the pack, Google ranks the sites themselves. That is where an article like this one belongs: not to rank for the query, but to give the person who found your site something worth reading and to earn the links and mentions that eventually move the rest.</p>

<h2>Nine questions to ask any software company near you</h2>

<ol>
<li><strong>Who exactly will work on my project?</strong> Ask for names and roles, and whether they are employees or subcontractors. The answer should be a small team, not a sales department.</li>
<li><strong>What do the first two weeks look like?</strong> Discovery, content, design, build. If week one is "we start designing", you are buying pixels rather than outcomes.</li>
<li><strong>Can I speak to a client with a project like mine?</strong> Not a logo wall — a reference who will describe what went wrong as well as what worked.</li>
<li><strong>How is content handled?</strong> Who writes it, who proofreads it, and what happens at launch if it is not ready?</li>
<li><strong>Which parts of this are custom code, and which can my team edit?</strong> A site you cannot change without a developer is a liability you will pay for every year.</li>
<li><strong>Who owns the code, the domain, and the accounts?</strong> Domain, hosting, analytics, CMS admin, design files — all of it should end up registered to your business.</li>
<li><strong>How will M-Pesa payments work?</strong> STK Push, redirect, or a till number? Who holds the Safaricom account? Sandbox testing is not go-live testing.</li>
<li><strong>What does support cost after launch?</strong> What is covered, for how long, at what response time, and at what rate afterwards. "Nothing at all" is an answer, and a warning.</li>
<li><strong>What will you hand over, and in what format?</strong> Source code with history, credentials, and a document that explains how to change a price without opening a ticket.</li>
</ol>

<h2>Red flags that should end the conversation</h2>

<ul>
<li>Quoting without asking a single question about your business or your customers.</li>
<li>A price with no scope attached — no page list, no feature list, no exclusions.</li>
<li>"Unlimited revisions" or "unlimited pages" in writing.</li>
<li>Registering your domain later, or in the agency's name, so the first version can launch this week.</li>
<li>Showing you other clients' projects but not a live URL you can open yourself.</li>
<li>100% payment before any design or build work exists. A normal structure is 30–40% to start, milestone payments against deliverables, and the balance on handover.</li>
<li>Vague answers about who does the work, dressed up as phrases like "our partner network".</li>
</ul>

<h2>How to verify a software company is real before you pay</h2>

<ul>
<li><strong>Visit.</strong> A physical address you can find on a map is worth more than any portfolio. If the only location offered is a residential estate or a PO box, ask why.</li>
<li><strong>Check registration.</strong> Ask for the certificate of registration and confirm the business name on your quotation matches it, and your bank account is in the same name.</li>
<li><strong>Inspect live work.</strong> Open three sites they built, on mobile, on a real network. Ask what each client asked for and what the team would do differently.</li>
<li><strong>Call two references</strong> without the agency present in the room. Ask specifically about delays and scope changes.</li>
<li><strong>Look at their own site's fundamentals.</strong> Load time, mobile layout, HTTPS, whether it ranks for anything, whether it was maintained in the last year. An agency that cannot run its own site will not run yours.</li>
</ul>

<h2>What software work should cost in Kenya</h2>

<p>Roughly, in the Kenyan market today: template or page-builder sites in the tens of thousands of shillings, a credible small-business website in the KES 80,000–400,000 range, an agency engagement in the KES 400,000–1,500,000 range, and product-grade custom software — dashboards, authentication, integrations, M-Pesa with reconciliation — from KES 1,500,000 upward. We broke the tiers down in detail on our blog, in <a href="https://blogs.lumyn.co.ke/articles/website-cost-kenya-2026">what a website costs in Kenya in 2026</a>.</p>

<p>Two things skew every quote. A brief that says "make it modern and professional" produces a design budget nobody can verify, and a scope that omits content quietly becomes half the build. Compare proposals on scope, never on headline price — a KES 180,000 proposal and a KES 900,000 proposal are frequently pricing different products.</p>

<h2>What working locally actually gives you</h2>

<ul>
<li><strong>Overlap hours.</strong> A team awake during your working day turns a two-day wait into a ten-minute one.</li>
<li><strong>In-person workshops.</strong> For anything involving staff training, retail rollout, or customer research, sitting in the same room is worth more than any video call.</li>
<li><strong>Market context.</strong> Local teams already know that M-Pesa is the financial operating system rather than a payment method, that most SMEs still run on cash and notebooks, and that a site has to work on a KES 15,000 handset over 3G.</li>
<li><strong>Compliance in the same jurisdiction.</strong> The Data Protection Act, ODPC enforcement, and CBK sandbox requirements are easier to handle with a vendor who deals with them daily.</li>
<li><strong>A reference network you can visit.</strong> You can drive to a client and see the software running.</li>
</ul>

<p>What proximity does not give you: seniority, or the specific skill your project needs. A local team can still be the wrong team, and an offshore team can still be excellent. Judge capability first, geography second.</p>

<h2>How to compare the quotes properly</h2>

<p>Ask every candidate for the same deliverable in the same format: a scope list, a line-item breakdown, a timeline with milestones, and a support proposal. Then score each on five things, ten points each — the quality of their questions about your business, the quality of relevant work verified on live URLs, the team who will actually do the work, the contract and ownership terms, and the three-year total cost rather than the build price. When two finish within a point of each other, choose the one who will still answer the phone in twelve months.</p>

<h2>Why we wrote this down</h2>

<p>We are a software company in Nairobi, so we are not a neutral source — but we would rather earn the work than win it with a listicle. What we have learned building products, M-Pesa integrations and platforms for Kenyan businesses is published on our <a href="/blog">blog</a>, our delivery approach is written up in the studio system, and the actual work sits in <a href="/projects">our projects</a>.</p>

<p>If you are still weighing options, our <a href="/services">services overview</a> will tell you what we build and what we deliberately do not, <a href="/get-started">get started</a> walks through engagement options, and the answers to the questions we get asked most often are on our <a href="/faq">FAQ</a>. Otherwise, tell us what you are building on <a href="/contact">the contact page</a> and we will tell you honestly whether we are the right team — and who else you should talk to if we are not.</p>

<h2>Frequently asked questions</h2>

<h3>How much does a software company near me cost?</h3>
<p>Most Kenyan businesses land between KES 80,000 and KES 400,000 for a business website, KES 400,000 to KES 1,500,000 for a larger agency engagement, and KES 1,500,000 and up for custom software with authentication, dashboards and integrations. Quote differences usually mean scope differences.</p>

<h3>Should I choose a company near me or an offshore team?</h3>
<p>Choose on capability first. If two teams are equally capable, proximity wins on timezone overlap, in-person access, local market context and the ability to visit a reference. It does not win on seniority or on every specialist skill.</p>

<h3>How long does it take to find and hire a software company?</h3>
<p>Two to six weeks for a standard build if you start with a written scope, longer if you are still working out what you want. The projects that run late are almost always the ones that began without a decision about scope.</p>

<h3>What should a software company hand over at the end?</h3>
<p>Source code with history, design files, and the domain, hosting, CMS, analytics and Search Console accounts registered to your business. Plus a document explaining how to publish a page, change a price, and add a service without a developer.</p>

<h3>Do I need a local company to get a Google Business Profile ranking?</h3>
<p>You need a claimed and completed Google Business Profile, consistent name, address and phone number across the web, real reviews, and accurate service areas. Proximity is one factor among several, and none of them are replaced by content.</p>`,
}

async function main() {
  const sanitizedContent = sanitizeHtml(post.content)
  const sanitizedExcerpt = sanitizeHtml(post.excerpt)

  const data = {
    title: post.title,
    excerpt: sanitizedExcerpt,
    content: sanitizedContent,
    category: post.category,
    author: post.author,
    tags: post.tags,
    image: post.image,
    isPublished: post.isPublished,
    featured: post.featured,
  }

  const existing = await prisma.blog.findFirst({ where: { title: post.title } })

  const saved = existing
    ? await prisma.blog.update({ where: { id: existing.id }, data })
    : await prisma.blog.create({ data })

  console.log(`${existing ? "Updated" : "Created"} blog post ${saved.id}`)
  console.log(`URL: ${process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"}/blog/${saved.id}`)
}

main()
  .catch((error) => {
    console.error("Failed to seed blog post:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })