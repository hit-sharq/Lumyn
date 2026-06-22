# TODO

## Goal
Fix slow admin UI updates (minutes) after add/edit/delete by removing full-list refetches and adding efficient pagination.

## Steps
- [x] Update `app/admin/components/news-manager.tsx` to stop calling `fetchItems()` after POST/PUT/DELETE; instead update local `items` from returned API result.
- [x] Update `app/admin/components/blog-manager.tsx` similarly.
- [x] Update `app/admin/components/events-manager.tsx` similarly.

- [x] Add default `take`/pagination support to list endpoints if needed: `app/api/news/route.ts`, `app/api/blog/route.ts`, `app/api/events/route.ts`.
- [ ] (Optional if latency persists) Check Prisma schema/indexes for fields used in ordering (`publishedAt`, `date`, etc.).
- [ ] Run `npm run dev` and manually test admin add/edit/delete for News/Blog/Events.

