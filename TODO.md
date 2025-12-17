<!-- # Fix ESM/CommonJS Issue with HTML Sanitization

## Goal
Replace `isomorphic-dompurify` with `sanitize-html` to resolve ESM/CommonJS compatibility issues with jsdom and parse5.

## Steps Completed
- [x] Analyzed the codebase and identified the issue
- [x] Created implementation plan
## Steps Remaining
- [x] Add `sanitize-html` to dependencies
- [x] Update `/app/api/blog/route.ts`
- [x] Update `/app/api/news/route.ts`
- [x] Update `/app/api/events/route.ts`
- [x] Update `/app/api/projects/route.ts`
- [x] Update `/app/api/contact/route.tsx`
- [x] Update `/app/api/job-applications/route.ts`
- [x] Update `/app/api/gallery/route.ts`
- [x] Remove `isomorphic-dompurify` from dependencies
- [x] Test the changes locally

## Technical Details
- Issue: `isomorphic-dompurify` depends on `jsdom` which has ESM/CommonJS compatibility issues
- Solution: Use `sanitize-html` which is a pure server-side solution without DOM dependencies
- All routes sanitize HTML content before saving to database
 -->
