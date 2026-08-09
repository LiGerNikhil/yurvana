# PROJECT_CONTEXT.md — YURVANA AGRO Platform

## What this is

B2B raw-material sourcing & catalog website for YURVANA AGRO SOLUTIONS PVT. LTD.
Buyers browse herbs/seeds/oils/extracts, submit RFQs (no online payment/checkout).
Admin manages item prices (volatile commodities) and RFQs.

## Stack (do not deviate)

Next.js 14+ App Router, TypeScript, MongoDB + Mongoose, Tailwind CSS, shadcn/ui,
Framer Motion, NextAuth (admin only, Credentials + JWT), Cloudinary (images),
React Hook Form + Zod, Resend/Nodemailer for email. Do not change db.ts connection method.

## Design tokens (use these exact values, do not invent new colors)

bg-base #FBF7F0, bg-alt #F3ECDD, surface #FFFFFF, primary #2F4F3A,
primary-dark #1E3327, accent-gold #C9A24B, accent-terracotta #B5583A,
text-primary #1F2A21, text-muted #5C6B5E, border #E4DCC8.
Headings font: Fraunces/Playfair Display. Body font: Inter/Manrope.

## Data models

Category, Item, RFQ, AdminUser — exact schemas are in FRD section 5.
114 seed items across 9 categories: Premium Herbs, Seeds, Fruits & Dry Materials,
Leaves, Flowers, Oils, Natural Ingredients, Herbal Extracts, Superfoods.

## Key rule

This is a QUOTE/LEAD-GEN system, NOT e-commerce. There is no cart checkout,
no payment gateway. "RFQ Cart" only collects items + quantities, then submits
a form (buyer details) that creates an RFQ document and sends email.

## Tooling notes (verified during Phase 0/1)

- Installed versions: Next.js 16.3.0, React 19, Tailwind CSS v4 (CSS-first —
  design tokens live in `app/globals.css` `@theme`/`:root`, NOT `tailwind.config.ts`),
  mongoose 9, next-auth 4.24 (App Router: use `getServerSession`), zod 4,
  shadcn/ui (radix-nova preset, baseColor neutral), framer-motion 13.
- Fonts: Fraunces → `--font-heading`, Inter → `--font-body` in `app/layout.tsx`.
- Phase 2: Mongoose models in `/models` (Category, Item, RFQ, AdminUser) — no FRD
  file present in repo, Item schema derived from `yurvana_seed_items.json`.
  Live MongoDB connection + JWT_SECRET configured in `.env` (gitignored).
  Connection verified (ping ok). `lib/db.ts` caches on `globalThis`.
- Production DB: `MONGODB_URI` in `.env` points to the Atlas cluster
  `cluster0.bkjqeu6.mongodb.net` (user `equilastyle_db_user`). URI has no DB
  path, so data lands in the default `test` database. This machine's Node DNS
  resolver (127.0.0.1) refuses lookups, so `lib/db.ts` calls `dns.setServers()`
  from `DNS_SERVERS` (default 8.8.8.8,1.1.1.1) — required for seed AND app builds.
- Next.js 16 note: middleware is now `proxy.ts`.
- Phase 3: `npm run seed` (`scripts/seed.ts` via `tsx`) — upserts 9 categories +
  114 items from `yurvana_seed_items.json`, links each item to its category by
  slug, sets `priceUpdatedAt`. Idempotent (upsert on unique `slug`). Source has
  a duplicate `amla` (Premium Herbs + Fruits & Dry Materials) → second slug
  `amla-2`; both exact `Amla` rows get featured, so featured count = 21.
- Phase 4: Homepage built (`app/page.tsx` server component + `components/site/*`).
  Navbar/Footer live in root layout; RFQ cart = client context + localStorage
  (`components/site/rfq-cart.tsx`), badge in navbar, Add-to-RFQ on item cards.
  Note: `lucide-react@1.x` removed brand icons (FB/IG/LinkedIn) → inline SVGs in
  Footer. Homepage prerenders statically with DB data at build time (try/catch
  fallback to empty sections if Mongo is unreachable).
- Phase 5: Catalog built. `/catalog` (all materials, `?category=<slug>` +
  `?q=` filters via `CatalogFilterBar` server component; category pills +
  search form, GET-based so no JS needed) and `/catalog/[slug]` (category
  landing, links from homepage cards) share `CatalogGrid` + `ItemCard`.
  Query builder in `lib/catalog.ts` (buildItemQuery, firstParam). Verified:
  lint/tsc clean, build green (homepage static against prod DB), browser QA
  clean, HTML asserts 114/13/4/9/0 counts.

## Build order (phases)

0 Setup → 1 Design system/Tailwind → 2 DB models+connection → 3 Seed data →
4 Homepage → 5 Catalog+filters → 6 Item detail → 7 RFQ system → 8 Static pages →
9 Admin auth → 10 Admin item CRUD+bulk price → 11 Admin RFQ management → 12 SEO/polish/deploy

## Status log (agent: append one line after each phase you complete)

- [x] Phase 0 done
- [x] Phase 1 done
- [x] Phase 2 done
- [x] Phase 3 done
- [x] Phase 4 done
- [x] Phase 5 done
- [x] Phase 6 done
- [ ] Phase 7 done
- [x] Phase 8 done
- [x] Phase 9 done
- [ ] Phase 10 done
- [ ] Phase 11 done
- [ ] Phase 12 done
