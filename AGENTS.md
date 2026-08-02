<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack quick-reference (so you don't reach for the wrong tool)

- **Framework**: Next.js 16 App Router, React 19. Plain JavaScript - **no TypeScript**. React Compiler is **disabled** (`reactCompiler: false` in `next.config.mjs`) because it crashes Payload's admin UI; do not flip it back on without a scoped workaround.
- **CMS**: [Payload CMS 3](https://payloadcms.com/) embedded under the `(payload)` route group at `/admin`. Collections live in `src/collections/`; reusable blocks in `src/collections/blocks.js`; the entry config is `src/payload.config.js`. Use the `payload` CLI via `npm run payload -- <command>` (e.g. `generate:types`).
- **Databases**: One Neon project hosts everything, reached over a single `DATABASE_URI` connection string via `pg`. Payload's `postgresAdapter` uses it for `users`/`media`/`case_studies*`/`payload_*`; `src/lib/db.js` uses the same string for the form-submission and OTP tables.
- **Storage**: Vercel Blob for Payload Media uploads, configured via the `@payloadcms/storage-vercel-blob` plugin and `BLOB_READ_WRITE_TOKEN`.
- **Styling**: CSS Modules co-located with components (`Foo.js` + `Foo.module.css`) plus `globals.css`. No Tailwind, no styled-components.
- **Forms**: server actions in `src/app/actions/` (files start with `"use server";`). Not API routes.
- **Email**: ZeptoMail via the `zeptomail` package. **Do not** reach for nodemailer / resend / SES.
- **Analytics**: `@next/third-parties` for GTM and GA4, both gated by `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA_ID` in `src/app/(frontend)/layout.js`.
- **Path alias**: `@/*` -> `./src/*` (`jsconfig.json`).

## Where things live

The `src/app/` tree is split into two Next.js route groups (parens don't appear in URLs):

- `src/app/(frontend)/` — the public marketing site
  - `page.js` (home `/`), `case-studies/[slug]/page.js`, `digital-score/page.js`, `submissions/page.js`, `privacy-policy/`, `terms-and-conditions/`
  - `layout.js` — site chrome, fonts, GTM/GA, JSON-LD for Organization + WebSite
- `src/app/(payload)/` — Payload CMS
  - `admin/...` (auto-generated, including `importMap.js`) → mounted at `/admin`
  - `api/...` (auto-generated) → mounted at `/api/*` (Payload REST + GraphQL + media file routes)
  - `layout.js` — wraps Payload's `RootLayout`; imports `@payloadcms/next/css` then `./custom.scss`

Other top-level routes (not in a group):

- `src/app/sitemap.js`, `src/app/robots.js`, `src/app/llms.txt/route.js`, `src/app/llms-full.txt/route.js`

Server-side code:

- `src/collections/` — Payload collection configs (`Users.js`, `Media.js`, `CaseStudies.js`, `blocks.js` exports the 7 block types used by `CaseStudies.body`)
- `src/lib/` — server-only helpers (`caseStudies.js`, `otp.js`, `db.js`, `adminAuth.js`)
- `src/app/components/` — React components (flat folder)
- `src/app/actions/`
  - `sendDemoEmail.js` — exports `sendDemoEmail`, `sendQuizEmail`, `sendBookingEmail`. Writes to `form_*_submissions` tables via `src/lib/db.js`, then sends via ZeptoMail.
  - `otp.js` — exports `requestOtp`, `verifyOtp`. Writes to `form_otp_codes`.

## Domains

- Production site: `sme.searchmadarth.com`
- Email domain: `@madarth.com`

These are different on purpose - don't conflate them when writing copy, env values, or contact links.

## Environment variables

The README is the source of truth for the env var contract. See the **Environment variables** section in `README.md`. Summary:

- Server-only: `ZEPTO_*`, `EMAIL_DISABLED`, `OTP_PEPPER`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `PAYLOAD_SECRET`, `DATABASE_URI`, `BLOB_READ_WRITE_TOKEN`
- Public (`NEXT_PUBLIC_*`, ships to the browser): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`

When adding a new env var, document it in `README.md` and follow the existing pattern in `.env.local` (key + a one-line comment). Mirror it in Vercel (Production + Preview) — see the deployment section of the README.

## Adding a new page

For a public marketing page:

1. Create `src/app/(frontend)/<slug>/page.js` (inside the `(frontend)` route group).
2. Add the URL to `src/app/sitemap.js`.
3. If it's a meaningful public page, add it to the `Pages` section in `src/app/llms.txt/route.js`.
4. Use the shared `legal.module.css` for legal-style content; otherwise add a co-located `*.module.css`.

For new Payload content types: add a collection under `src/collections/`, register it in `src/payload.config.js`. Schema is kept in sync against the live Postgres directly — there is no committed schema history in the repo.

## Database changes

- **Payload-owned tables** (`users`, `media`, `case_studies*`, `payload_*`) — modify via Payload collection configs; the schema is reconciled against the live Postgres directly.
- **Form-submission and OTP tables** (`sme_submissions` — all 3 form types in one table, discriminated by `form_type`, with type-specific fields in a `details` JSONB column — plus `form_otp_codes`) — change via `psql` against the Neon connection string, or the Neon console's SQL editor. No RLS: access is server-only via one connection string, so there's no anon/browser surface for RLS to protect.
