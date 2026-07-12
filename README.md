# Asad Khan — Portfolio + Admin CMS

Personal portfolio for a full-stack developer with an integrated admin
dashboard: every piece of site content — projects, work experience, tech
stack, and page copy — is created, edited, and deleted through a UI. No code
changes are needed for content updates.

**Stack:** Next.js 14 (App Router, TypeScript) · Bootstrap 5 · MongoDB +
Mongoose · NextAuth (credentials, JWT) · zod · deployed on Vercel + MongoDB
Atlas.

---

## Quick start

```bash
git clone <this-repo> && cd portfolio
npm install
cp .env.example .env.local        # then fill in the values (see below)
npm run seed                      # idempotent — safe to run twice
npm run dev                       # http://localhost:3000
```

Admin dashboard: <http://localhost:3000/admin> (redirects to `/admin/login`
when signed out).

## Environment variables

All required variables are documented in [`.env.example`](.env.example):

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string, e.g. `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority` — keep the `/portfolio` db name in the path. Local MongoDB works too: `mongodb://localhost:27017/portfolio`. |
| `ADMIN_USERNAME` | Admin login username. |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password (see below). |
| `NEXTAUTH_SECRET` | Random secret for JWT signing: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXTAUTH_URL` | `http://localhost:3000` in dev; your production URL on Vercel. |
| `SITE_URL` | Absolute public URL used by SEO metadata, `sitemap.xml`, and `robots.txt`. |

### Generating the admin password hash

```bash
npm run hash-password -- "your-password-here"
```

The script prints **two** values:

1. an **escaped** line (`ADMIN_PASSWORD_HASH=\$2a\$12\$…`) to paste into
   `.env.local` — bcrypt hashes contain `$`, which Next.js env loading would
   otherwise expand as variable references and silently corrupt the hash;
2. the **raw** hash for the Vercel dashboard (no escaping there).

## Creating the MongoDB Atlas cluster (free tier)

1. Sign up / sign in at <https://cloud.mongodb.com> and create a project.
2. **Create a cluster** → choose the free **M0** tier and a region near you.
3. **Database Access** → *Add New Database User*: username + a strong
   password, role **Read and write to any database**.
4. **Network Access** → *Add IP Address*:
   - for local dev, add your current IP;
   - for Vercel, add `0.0.0.0/0` (allow from anywhere — Vercel's egress IPs
     are dynamic), or use Atlas's Vercel integration instead.
5. **Connect** → *Drivers* → copy the connection string, replace
   `<password>`, and append the database name: `…mongodb.net/portfolio?…`.
6. Put it in `.env.local` as `MONGODB_URI`, then run `npm run seed`.

## Using the admin dashboard

Sign in at `/admin/login`. Sections:

- **Dashboard** — content counts and quick links.
- **Projects** — add/edit/delete projects: title, slug (auto-generated from
  the title, editable), short + long description (markdown with **live
  preview**), tech stack, live/GitHub URLs, image upload, **featured** and
  **published** toggles (unpublished drafts stay editable but are hidden from
  every public page), sort order. Deleting asks for confirmation.
- **Experience** — timeline entries with markdown bullet descriptions (live
  preview); check "Current role" for an open-ended position ("Present").
- **Tech stack** — name, category, optional icon URL, sort order.
- **Site content** — every editable copy key (hero headline/subtext, about
  text, contact email, GitHub/LinkedIn/resume URLs) with a single **Save
  all** button. Values seeded with `TODO` still need your real details.
- **Reordering** — drag table rows to reorder projects, experience entries,
  or tech items; the order is saved immediately. (On touch devices, use the
  numeric sort-order field in the edit form instead.)

Login is rate-limited: 5 failed attempts lock that client out for 15 minutes
(in-memory — see `lib/rate-limit.ts` for the serverless caveat and the
Upstash/WAF upgrade path).

Every save is validated (zod) server-side and immediately revalidates the
affected public pages — no rebuild needed.

## Seeding

`npm run seed` connects through the same cached Mongoose helper the app uses
and inserts each document **only if its natural key (slug / key / name) is
missing**. Re-running never duplicates data and never overwrites content you
edited in the admin. To restore a seeded item to its original text, delete it
in the admin (or drop the document) and re-run the seed.

> The seeded experience dates are placeholders — set your real internship
> dates in **Admin → Experience**.

## Image storage in production

Local dev writes uploads to `public/uploads/` (git-ignored). **This does not
work on Vercel** — the serverless filesystem is ephemeral and read-only.

All storage goes through a single abstraction:
[`lib/storage.ts`](lib/storage.ts). To go to production, replace the body of
`saveUpload()` with [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
(`@vercel/blob` → `put(filename, buffer, { access: "public" })` → return
`blob.url`) or Cloudinary, and add the storage host to `images.remotePatterns`
in `next.config.mjs`. Nothing else changes.

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Set all env vars from `.env.example` in *Project Settings → Environment
   Variables* (`NEXTAUTH_URL` and `SITE_URL` = your production URL; paste the
   **raw** password hash).
3. Make sure Atlas network access allows Vercel (step 4 above). The build
   pre-renders pages, so the database must be reachable **at build time**.
4. Swap `lib/storage.ts` to Blob/Cloudinary (above) before uploading images.

## Architecture notes

- **Connection pooling** — [`lib/db.ts`](lib/db.ts) caches the Mongoose
  connection (and in-flight promise) on `globalThis`, so serverless
  invocations and dev hot-reloads share one pool instead of exhausting
  Atlas's connection limit. Every data access goes through it.
- **Server/client boundary** — pages fetch with `.lean()` and serialize to
  plain DTOs ([`lib/serialize.ts`](lib/serialize.ts)); raw Mongoose documents
  never cross into client components.
- **Freshness** — public pages are statically cached (`revalidate = 3600`
  safety net); every admin mutation calls `revalidatePath` so changes appear
  immediately.
- **Auth** — single admin from env vars; middleware redirects signed-out
  visitors to `/admin/login` and returns 401 JSON for `/api/admin/**`; every
  mutating handler re-checks the session.
- **Styling** — Bootstrap 5 via npm; all custom CSS lives in
  [`/styles`](styles), one file per page/module, imported only where used. No
  Bootstrap JS bundle — the navbar collapse and modals are small
  React-controlled components.
- **OG images** — each project page serves a generated 1200×630 social card
  (`app/(site)/projects/[slug]/opengraph-image.tsx`). It runs on the **edge
  runtime** because `@vercel/og`'s Node build crashes on Windows; since edge
  can't use Mongoose, the card fetches its data from the public
  `/api/og/[slug]` route. Other pages use the static `public/og-default.png`.
- **Analytics** — Vercel Analytics is mounted in the root layout; it no-ops
  locally and starts collecting once deployed on Vercel (enable Analytics in
  the project dashboard).
- **Known nuance** — `/projects/<unknown-slug>` renders the 404 page with a
  `noindex` meta tag but HTTP 200: an ancestor `loading.tsx` streams the
  response shell before `notFound()` runs (App Router limitation). Unknown
  top-level routes return a real 404.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server. |
| `npm run build` / `npm start` | Production build / serve. |
| `npm run lint` | ESLint (passes with zero errors). |
| `npm run seed` | Idempotent database seed. |
| `npm run hash-password -- "pw"` | Generate `ADMIN_PASSWORD_HASH`. |
