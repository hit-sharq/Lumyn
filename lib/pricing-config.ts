// Thresholds that end the free-launch phase.
// Once BOTH are reached, pricing auto-switches to PAID (no manual action).
export const FREE_LAUNCH_THRESHOLDS = {
  jobPosts: 50,
  aiGenerations: 200,
} as const

// Payment `type` values that are free during the launch phase.
// (Hire job posts + AI Marketing Pro — Lumyn-owned monetization.)
// Market/Studio are intentionally excluded: they stay commission-based
// (free to list, Lumyn takes a cut on sale) and are never "free" to buyers.
export const FREE_PHASE_PAYMENT_TYPES: readonly string[] = [
  "job_post",
  "ai_marketing_subscription",
]
