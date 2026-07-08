// Single source of truth for the public site URL.
// Uses the existing NEXT_PUBLIC_BASE_URL env var (same one layout.tsx /
// sitemap.ts use), defaulting to the production domain so server-generated
// links (emails, cron, notifications) are never "undefined/..." when unset.
export const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"
