# Precision Retail Pro — Upgrades & Security Notes (June 2026)

## New features shipped (competitor parity, all free)

| Feature | Files |
|---|---|
| Reorder points + safety stock + EOQ order quantities | `lib/reorder.ts` |
| Lead-time-aware purchasing (interactive slider) | `components/ReorderPlan.tsx` (on the Inventory page) |
| What-if demand simulator (50%–200% slider) | `components/ReorderPlan.tsx` |
| Purchase-order PDF export | `lib/poGenerator.ts` (jspdf 4.2.1 added) |
| Low-stock email alerts | `app/api/alerts/route.ts` (Resend free tier; no-op until `RESEND_API_KEY` + `ALERT_TO_EMAIL` set) |

Type-checked in isolation (tsc strict, exit 0). `tsconfig.check.json` + `typecheck-stubs/` are scratch — safe to delete.

## Verify on your Mac
1. Open the folder so iCloud downloads evicted files (`tsconfig.json`, `next.config.ts`).
2. `npm install` → `npm run build` → `npm run dev`
3. Upload the test CSVs (`public/inventory_test.csv`, `public/sales_test.csv`), run analysis, open **Inventory** — the new "Reorder plan" panel sits above the table. Drag the sliders, export a PO PDF.

## Security notes
- `.env.local` holds a live Anthropic key — **rotate it** before this repo goes public, and confirm `.env*` is gitignored.
- The alerts route caps payloads at 100 items and never echoes the API key. Resend key is server-side only.
- Same next.config security-headers recommendation as BidCraft (file was iCloud-evicted; merge manually):
  `X-Content-Type-Options: nosniff · X-Frame-Options: DENY · Referrer-Policy: strict-origin-when-cross-origin`

## Still on the free roadmap
- Seasonality port from the v1 Prophet prototype (weekly/holiday patterns in the fallback forecaster).
