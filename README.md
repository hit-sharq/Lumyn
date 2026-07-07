# Lumyn Technologies – Premium Enterprise Website

**A world-class, premium digital experience** inspired by the world's leading technology companies.

> "Redefining digital innovation with enterprise-grade design and cinematic experiences."

![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8?logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-ff00ff?logo=framer)

---

## ✨ Features

### 🎨 Premium Design System
- **Dark Modern Theme**: Enterprise-grade dark interface with subtle gradients
- **Glassmorphism**: Frosted glass effects with backdrop blur and transparency
- **Smooth Animations**: Framer Motion-powered spring physics throughout
- **Cinematic Hero**: Fullscreen hero with animated gradient orbs and floating elements
- **Responsive Layout**: Mobile-first, optimized for all screen sizes

### 🏢 Enterprise-Ready
- **TypeScript**: Fully typed for reliability
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Performance**: Optimized images, code splitting, lazy loading
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Clerk Auth**: Seamless authentication integration

### 🎯 Interactive Elements
- **Animated Stats Counter**: Smooth counting animation when scrolled into view
- **Parallax Scrolling**: Depth perception with scroll-linked transforms
- **Hover Effects**: Sophisticated lift, glow, and scale interactions
- **Magnetic Buttons**:PremiumClick feedback with transform effects
- **Scroll Reveal**: Section-by-section fade-in animations

---

## 📸 Preview

### Homepage Hero
```
┌─────────────────────────────────────────────┐
│                                             │
│    Building Tomorrow's                     │
│    Technology ← Gradient text              │
│                                             │
│    Lumyn is a global technology company    │
│    crafting enterprise-grade solutions...  │
│                                             │
│    [Start Building →] [View Our Work ←]   │
│                                             │
│    · Animated gradient orbs in background  │
│    · Floating UI elements                  │
│    · Subtle parallax motion                │
└─────────────────────────────────────────────┘
```

### Stats Section
```
┌─────────────────────────────────────────────┐
│  Projects Delivered ──→ 50+                │
│  Team Members ────────→ 2000+               │
│  Events Hosted ───────→ 10+                 │
│  Years of Innovation → 1+                   │
│    ↑ Animated counters                      │
│    ↑ Glassmorphism cards                    │
└─────────────────────────────────────────────┘
```

### Premium Cards
```
┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐  │
│  │  [Hero Image with zoom on hover]      │  │
│  │                                       │  │
│  │  [Category Badge]                     │  │
│  │      Title                            │  │
│  │      Description...                   │  │
│  │                                       │  │
│  │  [Tags]  [Tags]  [Tags]               │  │
│  │                                       │  │
│  │  View Project →                       │  │
│  └───────────────────────────────────────┘  │
│    ↑ Hover: lift + shadow glow              │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js | 14.2.35 (App Router) |
| **Runtime** | React | 18 |
| **Styling** | Tailwind CSS | 4.1.9 |
| **Animations** | Framer Motion | latest |
| **Language** | TypeScript | 5 |
| **Auth** | Clerk | latest |
| **Fonts** | Geist (Vercel) | built-in |
| **UI Components** | Radix UI Shadcn | latest |
| **Icons** | Lucide React | 0.454.0 |
| **Database** | Prisma | 6.16.3 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/lumyn/lumyn.git
cd lumyn
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
ADMIN_IDS=your-clerk-user-id
DATABASE_URL="postgresql://..."
```

4. **Set up database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:5000](http://localhost:5000)

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod
```

---

## 📁 Project Structure

```
lumyn/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage (premium hero)
│   ├── layout.tsx         # Root layout + Header/Footer
│   ├── globals.css        # Global styles + theme vars
│   ├── about/             # About page
│   ├── projects/          # Projects showcase
│   ├── blog/              # Blog/News
│   ├── events/            # Events page
│   ├── contact/           # Contact form
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── header.tsx         # Glassmorphism nav
│   ├── footer.tsx         # Premium footer
│   ├── PremiumButton.tsx  # Animated button
│   ├── AnimatedSection.tsx# Scroll animation wrapper
│   ├── search.tsx         # Search component
│   ├── theme-provider.tsx # Theme context
│   └── ui/                # Shadcn components
├── lib/                   # Utilities
│   ├── db/               # Prisma database
│   ├── utils.ts          # Helper functions
│   └── logger.ts         # Logger
├── public/                # Static assets
│   ├── images/
│   ├── favicon.ico
│   └── og-image.png
├── styles/                # Legacy styles
├── DESIGN_SYSTEM.md       # Complete design documentation
├── COMPONENTS.md          # Component API reference
└── package.json
```

---

## 🎨 Design System

### Core Principles

1. **Dark First**: Primary theme is deep black (#0a0a0a)
2. **Contrast**: Cream text (#f5f5f5) on dark backgrounds
3. **Accent**: Slate blue primary (#6d8196)
4. **Motion**: Every interaction animates (0.3-0.5s)
5. **Depth**: Layering with blur, shadows, and translucency

### Color Variables (CSS Custom Properties)

```css
:root {
  --background: #0a0a0a;
  --foreground: #f5f5f5;
  --card: rgba(20, 20, 20, 0.8);
  --primary: #6d8196;
  --primary-foreground: #0a0a0a;
  --secondary: rgba(255, 255, 227, 0.1);
  --muted: rgba(255, 255, 227, 0.08);
  --muted-foreground: rgba(245, 245, 245, 0.6);
  --border: rgba(255, 255, 227, 0.12);
}
```

### Typography

- **Font**: Geist (Vercel's design system font) – already loaded
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extra-bold)
- **Fluid Type**: Clamp-based responsive font sizes
- **Line Height**: 1.6–1.8 for readability

**Example:**
```css
.heroTitle {
  font-size: clamp(3rem, 10vw, 5rem);  /* Scales with viewport */
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
```

### Spacing

8px base unit → all spacing multiples of 4 or 8:

```css
spacing-xs  = 8px
spacing-sm  = 12px
spacing-md  = 16px
spacing-lg  = 24px
spacing-xl  = 32px
spacing-2xl  = 48px
spacing-3xl  = 64px
spacing-4xl = 80px
```

---

## 🎬 Animation System

### Duration Scale
```css
/* Fast (micro-interactions) */
--duration-fast: 150ms;

/* Standard (buttons, cards) */
--duration-normal: 300ms;

/* Smooth (page transitions) */
--duration-smooth: 500ms;

/* Cinematic (hero reveal) */
--duration-slow: 800ms;
```

### Easing Curve (Default)
```css
cubic-bezier(0.16, 1, 0.3, 1)  /* Fast start, smooth end */
```

Used everywhere for premium feel.

### Pre-built Animations

**Framer Motion variants** (export from `lib/animations.ts`):

```tsx
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
}
```

---

## 🧩 Component Architecture

```
App Layout
├── Header (fixed, glassmorphism)
│   ├── Logo (gradient text)
│   ├── Navigation (desktop + mobile menu)
│   ├── Search
│   └── Auth (Clerk)
│
├── Main Content
│   ├── Hero Section
│   │   ├── Background gradients
│   │   ├── Floating elements
│   │   └── CTA buttons
│   │
│   ├── Stats Section
│   │   └── Animated counters
│   │
│   ├── Features/About
│   │   └── Card grid
│   │
│   ├── Services
│   │   └── Service cards with glow
│   │
│   ├── Projects
│   │   └── Bento-style grid
│   │
│   ├── Events
│   │   └── Card carousel
│   │
│   └── CTA Section
│       └── Gradient background
│
└── Footer
    ├── Brand info
    ├── Navigation columns
    ├── Social links
    └── Badge (online status)
```

---

## 📱 Mobile Responsiveness

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile-specific behaviors:**
- Hamburger menu appears ≤ 768px
- Grids collapse to 1 column ≤ 768px
- Hero text scales down
- Touch-friendly button sizes (48px min)
- Modal full-screen ≤ 768px

---

## 🔧 Development Scripts

```bash
# Development
npm run dev           # Start dev server on port 5000
npm run dev -- -H 0.0.0.0  # Allow external access

# Build
npm run build         # Create production build
npm run start         # Start production server

# Code Quality
npm run lint          # Run ESLint

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio

# Utilities
npm run seed:studio   # Seed studio templates
```

---

## 🗄️ Database Schema

### Key Models
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  projects  Project[]
  events    Event[]
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String
  image       String
  featured    Boolean  @default(false)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  date        DateTime
  location    String
  image       String
  isStaple    Boolean  @default(false)
}
```

---

## 🔐 Authentication & Authorization

**Provider:** [Clerk](https://clerk.com/)

- **Sign In/Sign Up**: Modal-based auth
- **Protected Routes**: Middleware checks
- **Admin Access**: Configure via `ADMIN_IDS` (server-only)
- **User Button**: Avatar dropdown with profile management

**Client usage:** Call the server endpoint `/api/auth/is-admin` to determine admin status. Do not expose admin IDs in client-side environment variables.

---

## 🌐 SEO & Metadata

Every page has SEO metadata:

```tsx
export const metadata: Metadata = {
  title: {
    default: 'Lumyn - The Complete Creative Platform',
    template: '%s | Lumyn',
  },
  description: '...',
  keywords: ['...'],
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@lumyn',
  },
}
```

---

## 📊 Analytics

Integration with [Vercel Analytics](https://vercel.com/analytics):

```tsx
// Already in layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🚀 Performance Optimizations

### 1. Images
- `next/image` with `fill` prop for responsive images
- `loading="lazy"` for below-fold content
- Proper `sizes` attribute for art direction

### 2. Code Splitting
```tsx
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton /> }
)
```

### 3. Font Optimization
- Geist font loaded via `next/font` (automatic optimization)
- `font-display: swap` for immediate text visibility

### 4. Bundle Analysis
```bash
# Install
npm install -D @next/bundle-analyzer

# Analyze
ANALYZE=true npm run build
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind classes not working
1. Ensure `app/globals.css` imports Tailwind
2. Restart dev server
3. Check class spelling

### Framer Motion animation glitches
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `height`, `width`, `margin`
- Use `will-change:` sparingly

### Type errors with components
```bash
# If you see "Cannot find module" for components:
npm run dev  # Restarts TypeScript server
# Or in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📚 Documentation

- **Design System**: `DESIGN_SYSTEM.md` – Complete theming & customization guide
- **Components**: `COMPONENTS.md` – Component API reference with examples
- **This README**: Project setup & architecture overview

---

## 🤝 Contributing

We follow strict design system guidelines. Keep the premium aesthetic:

1. **Use existing components** – `PremiumButton`, `AnimatedSection`
2. **Follow color scheme** – Dark background, cream text
3. **Add hover states** to all interactive elements
4. **Animate everything** – Even subtle scale/opacity changes
5. **Test mobile** – Responsive from 320px to 1920px

### Commit Convention
```
feat: add animated stats counter
fix: resolve header mobile menu bug
style: update button gradient colors
refactor: extract animation variants to utils
```

---

## 📄 License

© 2026 Lumyn Technologies. All rights reserved.

**Internal Use Only** – Not open for external distribution.

---

## 🙋 Support

- **Design Questions**: Refer to `DESIGN_SYSTEM.md`
- **Component API**: See `COMPONENTS.md`
- **Technical Issues**: Check troubleshooting section above
- **Team Contact**: Reach out to @jlee in Slack

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** May 12, 2026  

---

## 🎯 Quick Links

| Resource | Link |
|----------|------|
| Design System | `/DESIGN_SYSTEM.md` |
| Components Guide | `/COMPONENTS.md` |
| Project Board | [Linear → Lumyn](https://linear.app/lumyn) |
| Figma Mockups | [Lumyn – Figma](https://figma.com/@lumyn) |
| Deploy Preview | [Vercel → Lumyn](https://lumyn.vercel.app) |
| Analytics Dashboard | [Vercel Analytics](https://vercel.com/lumyn) |

---

*Built with ❤️ by the Lumyn Engineering Team*
