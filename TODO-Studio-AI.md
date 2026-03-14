<!-- # Studio AI Generator - Implementation Plan

## Information Gathered
**Current State:**
- 12 professional templates seeded ✅
- `/app/studio/page.tsx` lists templates from `/api/studio/templates` ✅
- StudioTemplate model has all fields (id, title, previewImages: string[], tags: string[])
- Prisma migrations complete

**Files to create/edit:**
1. `app/api/studio/ai/route.ts` - POST /api/studio/ai (prompt → custom template)
2. `app/studio/components/AIGeneratorModal.tsx` - UI modal with prompt input
3. `app/studio/page.tsx` - Add AI button/modal
4. `app/studio/[id]/page.tsx` - Preview iframe (bonus)

## Plan
**1. AI API (`app/api/studio/ai/route.ts`)** 
```
POST { prompt: string }
→ Analyze: 'portfolio + dark' → { category: 'portfolio', tags: ['dark'], previewImage: unsplash }
→ Create StudioTemplate + return ID
```
*Simple mixer (no OpenAI): keyword → template traits*

**2. UI Modal (`AIGeneratorModal.tsx`)**
- Button in studio page: "✨ Generate with AI"
- Modal: textarea prompt + "Generate" → POST → add to list

**3. Update studio/page.tsx**
- Add `<AIGeneratorModal />` + refresh templates list

## Dependent Files
- `app/api/studio/route.ts` (GET templates - already works)

## Followup Steps
1. `npm run dev`
2. /studio → see templates + AI button
3. Test: "developer portfolio dark theme" → new template created
4. Verify preview images, download flow

**Confirm before implementing?**
 -->
