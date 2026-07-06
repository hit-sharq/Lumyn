- [ ] Confirm intended admin protection behavior (Clerk vs app-level check).
- [x] Patch middleware to exempt `/admin(.*)` from Clerk redirect.
- [ ] Run `npm run lint` and `npm run build`.
- [ ] Manually verify: signed-in non-admin should see Access Denied page (not redirect to /sign-in); signed-in admin should access /admin.

