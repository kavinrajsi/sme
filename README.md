# SearchMadarth - SME Landing Site

Marketing site for **SearchMadarth**, a digital marketing partner for Indian SMEs. Single-page landing experience with a quiz-driven lead capture, a demo request modal, two legal pages, and machine-readable surfaces (sitemap, robots, llms.txt) for SEO/AEO/AIO.

Production: https://sme.searchmadarth.com

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | [Next.js 16](https://nextjs.org/docs) (App Router) | Read `node_modules/next/dist/docs/` before assuming API shape - 16 has breaking changes from older Next.js |
| Runtime | React 19 | React Compiler enabled (`reactCompiler: true` in `next.config.mjs`) |
| Language | JavaScript (no TypeScript) | Path alias `@/*` -> `./src/*` (see `jsconfig.json`) |
| Styling | CSS Modules + a single `globals.css` | One `*.module.css` co-located per component |
| Fonts | `next/font` - Geist Sans + Geist Mono | Loaded in `src/app/layout.js` |
| Animation on scroll | [`aos`](https://github.com/michalsnik/aos) | Initialized client-side via `components/AosInit.js` |
| Carousels | [`swiper`](https://swiperjs.com/) | Used in client stories / case study sections |
| Email | [`zeptomail`](https://www.npmjs.com/package/zeptomail) | Server actions only - never call from the client |
| Analytics | `@next/third-parties` | GTM and GA4, each independently gated by env var |
| Lint | `eslint` + `eslint-config-next` core-web-vitals | `npm run lint` |

---

## Project structure

```
src/app/
  layout.js                  # Root layout: metadata, JSON-LD (Organization, WebSite), GTM, GA, fonts
  page.js                    # Home (/) - composes all sections + ProfessionalService & FAQ JSON-LD
  globals.css                # Global styles
  legal.module.css           # Shared styles for /privacy-policy and /terms-and-conditions
  sitemap.js                 # Generates /sitemap.xml (requires NEXT_PUBLIC_SITE_URL)
  robots.js                  # Generates /robots.txt (sitemap reference if NEXT_PUBLIC_SITE_URL is set)
  llms.txt/route.js          # /llms.txt - markdown summary for LLM crawlers (AEO/AIO)
  privacy-policy/page.js     # /privacy-policy
  terms-and-conditions/page.js  # /terms-and-conditions
  actions/
    sendDemoEmail.js         # "use server" - sendDemoEmail() and sendQuizEmail() via ZeptoMail
  components/
    AosInit.js               # Client-only AOS initializer
    Header.js                # Sticky top nav, demo CTA
    Hero.js                  # Above-the-fold pitch
    Trust.js                 # Client logos / trust badges
    RevenueImpact.js         # Outcome stats
    DigitalQuiz.js           # Multi-step quiz, posts to sendQuizEmail server action
    OurServices.js           # Six-service grid
    CaseStudy.js             # Featured case study
    OurProcess.js            # 5-step engagement process
    ClientStories.js         # Testimonials carousel (Swiper)
    FAQ.js                   # Exports faqs[] (consumed by page.js for FAQPage JSON-LD)
    Footer.js                # Footer + legal links
    DemoModal.js             # Global demo request modal, posts to sendDemoEmail server action
```

---

## Routes

| Path | Source | Purpose |
|---|---|---|
| `/` | `src/app/page.js` | Home page |
| `/privacy-policy` | `src/app/privacy-policy/page.js` | Legal |
| `/terms-and-conditions` | `src/app/terms-and-conditions/page.js` | Legal |
| `/sitemap.xml` | `src/app/sitemap.js` | Auto-generated. Throws at build/render if `NEXT_PUBLIC_SITE_URL` is unset |
| `/robots.txt` | `src/app/robots.js` | Auto-generated. Sitemap reference omitted if `NEXT_PUBLIC_SITE_URL` is unset |
| `/llms.txt` | `src/app/llms.txt/route.js` | Plain-text summary for LLM crawlers; cached `s-maxage=86400` |

---

## Forms and email

Both forms post to **server actions** in `src/app/actions/sendDemoEmail.js`. They share a common `sendViaZepto()` helper.

| Form | Action | Trigger |
|---|---|---|
| Demo request modal | `sendDemoEmail()` | `DemoModal.js` |
| Digital Quiz | `sendQuizEmail()` | `DigitalQuiz.js` |

Behavior:

- **Mail provider is ZeptoMail** (not nodemailer / resend / SES). All sends go through `SendMailClient` from the `zeptomail` package against `https://api.zeptomail.com/v1.1/email`.
- The email subject prefix includes the site URL so submissions from staging vs. production are distinguishable in the inbox.
- If `EMAIL_DISABLED=true`, sends are skipped (subject is logged) and the action returns `{ success: true, skipped: true }`. Useful for local dev.
- If any of `ZEPTO_API_KEY`, `ZEPTO_FROM_NO_REPLY`, or `ZEPTO_TO_BUSINESS` are missing, the action returns a generic failure to the client and logs the missing keys server-side.

---

## Environment variables

`.env.local` for local development. Set the same values in your hosting environment for deploys.

### Server-only (never prefixed with `NEXT_PUBLIC_`)

| Variable | Required | Purpose |
|---|---|---|
| `ZEPTO_API_KEY` | yes (unless `EMAIL_DISABLED=true`) | ZeptoMail API token, format `Zoho-enczapikey ...` |
| `ZEPTO_FROM_NO_REPLY` | yes | `From:` address for both forms |
| `ZEPTO_FROM_ADMIN` | no | Reserved for future admin notifications |
| `ZEPTO_TO_BUSINESS` | yes | Primary `To:` recipient for form submissions |
| `ZEPTO_CC` | no | Optional `Cc:` recipient |
| `ZEPTO_BCC` | no | Optional `Bcc:` recipient |
| `EMAIL_DISABLED` | no | `"true"` to skip all sends and log subjects only |

### Public (exposed to the browser - never put secrets here)

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes for prod | Used by `metadataBase` (absolute OG URLs), `sitemap.js`, `robots.js`, `llms.txt`, and the email subject prefix |
| `NEXT_PUBLIC_GTM_ID` | no | Google Tag Manager container ID, e.g. `GTM-XXXXXXX`. Empty -> GTM script is not rendered |
| `NEXT_PUBLIC_GA_ID` | no | Google Analytics 4 measurement ID, e.g. `G-XXXXXXXXXX`. Empty -> GA script is not rendered |

> **Double-count gotcha**: if your GTM container also contains a GA4 Configuration tag for the same property as `NEXT_PUBLIC_GA_ID`, every pageview will fire twice. Pick one path per property.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (see Environment variables above).
#    For local dev, the simplest setup is:
#       EMAIL_DISABLED=true
#       NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run build    # Production build
npm run start    # Run the production build locally (after npm run build)
npm run lint     # ESLint (Next core-web-vitals + project ignores)
```

> Next.js only reads `.env.local` at boot. Restart the dev server after editing it.

---

## Deployment

The repo deploys cleanly on Vercel.

Production env vars to set in your host:

- `ZEPTO_API_KEY`, `ZEPTO_FROM_NO_REPLY`, `ZEPTO_TO_BUSINESS` (and any optional `ZEPTO_*` you use)
- `NEXT_PUBLIC_SITE_URL=https://sme.searchmadarth.com` (or your environment's public URL)
- `NEXT_PUBLIC_GTM_ID` and/or `NEXT_PUBLIC_GA_ID` if you want analytics in that environment
- Leave `EMAIL_DISABLED` unset (or `false`) in production

After deploy, verify:

- `https://<host>/sitemap.xml` lists `/`, `/privacy-policy`, `/terms-and-conditions`
- `https://<host>/robots.txt` references the sitemap
- `https://<host>/llms.txt` renders the project summary
- The demo modal and quiz successfully send mail (check the inbox for the configured `ZEPTO_TO_BUSINESS`)

---

## SEO / AEO / AIO

The site ships with structured data and machine-readable surfaces designed for traditional SEO **and** answer-engine / AI-crawler discovery.

- **Metadata** in `src/app/layout.js`: title template, OpenGraph, Twitter card, robots directives, `metadataBase` derived from `NEXT_PUBLIC_SITE_URL`.
- **JSON-LD schemas**:
  - `Organization` and `WebSite` in `layout.js` (every page)
  - `ProfessionalService` (with `OfferCatalog` for the six services) and `FAQPage` in `page.js` (home only)
- **`/llms.txt`** at `src/app/llms.txt/route.js` - markdown summary tailored for LLM crawlers, cached `s-maxage=86400`.
- **`/sitemap.xml` and `/robots.txt`** generated from `NEXT_PUBLIC_SITE_URL`.

When adding a new public page, update `sitemap.js` and (if appropriate) the `Pages` section of `llms.txt`.

---

## Analytics

Both Google Tag Manager and Google Analytics 4 are wired up in `src/app/layout.js` via `@next/third-parties/google`. Each is independently gated by an env var, so any combination is valid: GTM only, GA only, both, or neither.

```jsx
{gtmId && <GoogleTagManager gtmId={gtmId} />}
{gaId && <GoogleAnalytics gaId={gaId} />}
```

To activate, set `NEXT_PUBLIC_GTM_ID` and/or `NEXT_PUBLIC_GA_ID` in your environment and restart / redeploy.

---

## Conventions and gotchas

- **Don't reach for nodemailer / resend / SES** - this project uses ZeptoMail. New mail flows should go through `sendViaZepto()` in `src/app/actions/sendDemoEmail.js`.
- **Server actions, not API routes**, for form submissions. Files start with `"use server";`.
- **Path alias**: `@/*` resolves to `./src/*` (configured in `jsconfig.json`).
- **No TypeScript** - the codebase is plain JS. Don't introduce `*.ts(x)` files without a clear reason.
- **CSS Modules** are co-located: `Foo.js` + `Foo.module.css`. There is no Tailwind, no styled-components.
- **Production domain is `sme.searchmadarth.com`. Email domain is `@madarth.com`.** Don't conflate the two.
- **Next.js 16 has breaking changes** from older versions. When in doubt, read the relevant guide in `node_modules/next/dist/docs/` before writing code based on memory of older Next.js APIs.

---

## License

Private / unpublished. All rights reserved by Madarth.
