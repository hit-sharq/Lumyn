# Lumyn — Replit Environment

## Project Overview
Next.js 14 web application for the Lumyn organization. Features news, blog, events, gallery, projects, careers, partners, and an admin dashboard. Uses Clerk for authentication, Prisma + PostgreSQL for the database, Cloudinary for image hosting, and Nodemailer for email delivery.

## Architecture
- **Framework**: Next.js 14 (App Router)
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database**: PostgreSQL via Prisma ORM
- **Image hosting**: Cloudinary
- **Email**: Nodemailer (SMTP)
- **UI**: Radix UI + Tailwind CSS + shadcn/ui components
- **Logging**: Winston

## Running the App
The app runs via the "Start application" workflow on port 5000 (`npm run dev`).

## Required Environment Variables
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | e.g. `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | e.g. `/sign-up` |
| `NEXT_PUBLIC_ADMIN_IDS` | Comma-separated Clerk user IDs with admin access |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port (e.g. 587) |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password |
| `SMTP_SECURE` | `true` or `false` |
| `ADMIN_EMAIL` | Email address to receive contact/inquiry forms |

## Revenue Modules

### Lumyn Studio (`/studio`)
- Template marketplace — browse, download, and purchase portfolio templates
- Admin manages templates via `/admin` → "Lumyn Studio" tab
- API: `/api/studio/templates`, `/api/studio/purchases`, `/api/studio/reviews`
- DB models: `StudioTemplate`, `StudioPurchase`, `StudioReview`

### Lumyn Launch (`/launch`)
- Portfolio website builder — pick template, customize, publish with shareable URL
- Published portfolios live at `/portfolio/[username]`
- User dashboard at `/launch/dashboard`
- API: `/api/launch/portfolios`, `/api/launch/portfolios/[id]`, `/api/launch/portfolios/[id]/projects`
- DB models: `LaunchPortfolio`, `LaunchProject`

### Lumyn Market (`/market`)
- Digital products marketplace — creators sell, buyers download
- Creator dashboard at `/market/dashboard`
- Admin manages products via `/admin` → "Lumyn Market" tab
- API: `/api/market/products`, `/api/market/purchases`, `/api/market/creator`
- DB models: `MarketCreatorProfile`, `MarketProduct`, `MarketPurchase`

## Key Directories
- `app/` — Next.js App Router pages and API routes
- `components/` — Reusable React components
- `lib/` — Utility functions and server-side helpers
- `prisma/` — Prisma schema and migrations
- `public/` — Static assets
- `styles/` — Global CSS

## Database
Run `npm run prisma:migrate` to apply migrations and `npm run prisma:generate` to regenerate the Prisma client after schema changes.

## Replit-Specific Notes
- Dev server runs on port 5000 bound to `0.0.0.0` for Replit compatibility
- Package manager: npm (package-lock.json present)
