# Lumyn — Digital Solutions Platform

## Overview
Lumyn is a Next.js 14 startup platform offering multiple revenue-generating products:
- **Lumyn Studio** — Template marketplace (buy/download premium templates)
- **Lumyn Market** — Digital goods marketplace
- **Lumyn Hire** — Paid job board
- **Lumyn Launch** — Portfolio builder for creators

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Clerk (`@clerk/nextjs`)
- **Payments**: Pesapal (KES, East African payment gateway)
- **Image uploads**: Cloudinary
- **AI**: Anthropic + OpenAI SDKs
- **Email**: Nodemailer (SMTP)
- **Styling**: Tailwind CSS + CSS Modules
- **UI**: Radix UI + shadcn components

## Architecture
- **Port**: 5000 (configured for Replit)
- **Dev command**: `npm run dev` → `next dev -p 5000 -H 0.0.0.0`
- **Database**: Prisma schema at `prisma/schema.prisma`

## Key Routes
- `/studio` — Template marketplace (server-rendered)
- `/studio/[id]` — Template detail + purchase flow
- `/studio/dashboard` — User's purchased templates
- `/studio/admin` — **Admin-only** template management page
- `/payment/callback` — Post-payment redirect handler
- `/api/payments` — Initiate Pesapal payment
- `/api/payments/ipn` — Pesapal IPN webhook handler
- `/api/payments/status` — Check payment status
- `/api/studio/templates` — CRUD for templates (admin-gated write)
- `/api/studio/purchases` — User purchase records

## Studio System
Templates have `isFree: boolean` and `price: Float` (in KES). Purchases are tracked in `StudioPurchase`. Payment flows through Pesapal, IPN confirms the payment and creates the `StudioPurchase` record automatically.

### Admin Access
Set `NEXT_PUBLIC_ADMIN_IDS` to a comma-separated list of Clerk user IDs. Those users can:
1. Visit `/studio/admin` to create, feature, and delete templates
2. Use the POST `/api/studio/templates` API

## Required Environment Variables
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (frontend) |
| `CLERK_SECRET_KEY` | Clerk auth (backend) |
| `ANTHROPIC_API_KEY` | AI features |
| `CLOUDINARY_CLOUD_NAME` | Image storage |
| `CLOUDINARY_API_KEY` | Image storage |
| `CLOUDINARY_API_SECRET` | Image storage |
| `SMTP_HOST` | Email sending |
| `SMTP_PORT` | Email sending |
| `SMTP_USER` | Email sending |
| `SMTP_PASS` | Email sending |
| `SMTP_SECURE` | Email sending (true/false) |
| `PESAPAL_CONSUMER_KEY` | Payment gateway |
| `PESAPAL_CONSUMER_SECRET` | Payment gateway |
| `PESAPAL_IPN_ID` | Payment IPN (register via API if blank) |
| `PESAPAL_ENVIRONMENT` | `sandbox` or `production` |
| `ADMIN_EMAIL` | Admin notifications |
| `NEXT_PUBLIC_ADMIN_IDS` | Comma-separated Clerk user IDs for admin access |
| `NEXT_PUBLIC_APP_URL` | Full public URL of the app (e.g. https://your-app.replit.app) |

## Database
Run `npx prisma db push` to sync schema changes to the database.
Run `npx tsx scripts/seed-studio-template.ts` to seed the example template.

## Commission Structure
- Studio templates: 20% platform fee
- Job posts: 100% platform fee (job board revenue)
