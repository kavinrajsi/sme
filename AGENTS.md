<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack quick-reference (so you don't reach for the wrong tool)

- **Framework**: Next.js 16 App Router, React 19, React Compiler enabled. Plain JavaScript - **no TypeScript**.
- **Styling**: CSS Modules co-located with components (`Foo.js` + `Foo.module.css`) plus `globals.css`. No Tailwind, no styled-components.
- **Forms**: server actions in `src/app/actions/` (files start with `"use server";`). Not API routes.
- **Email**: ZeptoMail via the `zeptomail` package. **Do not** reach for nodemailer / resend / SES.
- **Analytics**: `@next/third-parties` for GTM and GA4, both gated by `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA_ID` in `src/app/layout.js`.
- **Path alias**: `@/*` -> `./src/*` (`jsconfig.json`).

## Where things live

- Pages: `src/app/page.js` (home), `src/app/privacy-policy/`, `src/app/terms-and-conditions/`
- Generated routes: `src/app/sitemap.js`, `src/app/robots.js`, `src/app/llms.txt/route.js`
- Components: `src/app/components/` (one folder, flat)
- Server actions: `src/app/actions/sendDemoEmail.js` exports `sendDemoEmail` and `sendQuizEmail`
- Root layout: `src/app/layout.js` (metadata, JSON-LD for Organization + WebSite, GTM, GA, fonts)

## Domains

- Production site: `sme.searchmadarth.com`
- Email domain: `@madarth.com`

These are different on purpose - don't conflate them when writing copy, env values, or contact links.

## Environment variables

The README is the source of truth for the env var contract. See the **Environment variables** section in `README.md`. Summary:

- Server-only: `ZEPTO_API_KEY`, `ZEPTO_FROM_NO_REPLY`, `ZEPTO_FROM_ADMIN`, `ZEPTO_TO_BUSINESS`, `ZEPTO_CC`, `ZEPTO_BCC`, `EMAIL_DISABLED`
- Public (`NEXT_PUBLIC_*`, ships to the browser): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`

When adding a new env var, document it in `README.md` and follow the existing pattern in `.env.local` (key + a one-line comment).

## Adding a new page

1. Create `src/app/<slug>/page.js`.
2. Add the URL to `src/app/sitemap.js`.
3. If it's a meaningful public page, add it to the `Pages` section in `src/app/llms.txt/route.js`.
4. Use the shared `legal.module.css` for legal-style content; otherwise add a co-located `*.module.css`.
