<!-- # Phase 2 Subscriptions Implementation Plan

## Information Gathered
- Subscription model exists in schema.prisma (userId, plan, status, currentPeriodEnd, paymentOrderId etc.).
- No existing `/api/subscriptions` endpoints (created now: GET/POST/PATCH route.ts, PATCH [id]).
- middleware.ts handles auth but no subscription checks.
- Plans: "creator_pro", "job_unlimited" per schema comment.
- Earnings API exists but can be enhanced for creator-specific netPayout sum.
- Dashboards use local calcs; Phase 1 earnings view ready.

## Plan
**File-level updates:**
1. **middleware.ts**: Add `requireSubscription(plan)` matcher/helper for pro routes (e.g., /market/dashboard, /studio for creator_pro).
2. **app/api/market/creator/earnings/route.ts**: Enhance to sum creator's netPayout from products' purchases (join MarketPurchase -> PaymentOrder).
3. **TODO-Monetization.md**: Mark Phase 2 [x] complete.

**New files:** `/api/subscriptions/*` created (create/cancel/list).

## Dependent Files to Edit
- middleware.ts
- app/api/market/creator/earnings/route.ts
- TODO-Monetization.md

## Followup steps
1. `npx prisma generate`
2. Test: POST /api/payments {type:"subscription", plan:"creator_pro"} -> IPN -> GET /api/subscriptions -> middleware protect.
3. Add pro UI gates (e.g., unlimited products for creator_pro).
4. Proceed to Phase 3.

Pro features to gate: unlimited product listings/boosts (limit 3 free products without creator_pro).

Confirm plan before edits?
 -->
