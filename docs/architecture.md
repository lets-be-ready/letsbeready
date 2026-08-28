# Architecture

How everything fits together. Read this if you want to understand the system at a glance.

## TL;DR

A static HTML site built from a headless CMS, deployed to a CDN, with one tiny serverless function for form submissions and a hosted third-party widget for donations. No framework, no SSR, no database (other than the CMS), no backend service to maintain.

## The pieces

### 1. Sanity (the CMS)
- Hosted at https://letsbeready.sanity.studio
- Editors log in with Google
- Stores all editable content as documents: pages, classrooms, team members, partners, expense items
- Two kinds of documents:
  - **Singletons** (one per type): siteSettings, homepage, donatePage, curriculumPage, nutritionPage, partnersPage, staffPage
  - **Collections** (many per type): classroom, teamMember, staffMember, partner, expenseItem
- Free tier handles everything we need (10K docs, 100K API requests, multi-user editing)

### 2. The build script (`build.js`)
- Plain Node.js, ~750 lines
- Fetches all documents from Sanity via raw HTTP API (no SDK, just `fetch`)
- Flattens singleton field maps into a single content key/value object
- Maps collection documents to template-friendly arrays
- Renders each template in `templates/` against the data
- Generates the SVG pie chart for the expense breakdown
- Writes everything to `dist/`
- Falls back to a static `getFallbackData()` blob if `SANITY_PROJECT_ID` is not set, so local dev works without credentials

### 3. The template engine (inside `build.js`)
A small Mustache-style processor. Supports:
- `{{key}}` for simple substitution
- `{{#each collection}}…{{/each}}` for arrays
- `{{#if key}}…{{/if}}` for conditionals (works at top level and inside `each` blocks)
- Partial injection via content key, e.g. `{{footer_html}}` (the footer file is read once at build time and injected as a content key)

The substitution loop runs until stable, so injected partials (like the footer) get their nested keys resolved in subsequent passes.

### 4. The templates (`templates/`)
Plain HTML files with `{{key}}` placeholders. Each one corresponds to a final page in `dist/`. The template files are checked into git as the source of truth for layout and structure. Content lives in Sanity. Layout lives in templates. The two never mix.

### 5. The static site (Vercel CDN)
- Hosted at https://letsbeready.org (and previewed at https://letsbeready.vercel.app)
- Vanilla HTML with a tiny amount of vanilla JS
- Loads in under a second on a cold cache
- No client-side rendering, no hydration, no React, no anything
- Lighthouse scores in the high 90s for Performance, Accessibility, Best Practices, SEO

### 6. The newsletter form (Netlify Forms)
- The footer form carries `data-netlify="true"`; Netlify registers it at deploy time and stores every submission privately in the site's dashboard (Forms → newsletter)
- `main.js` posts it as a normal form submission so the page never reloads; a honeypot field (`_hp`) filters bots
- No server code, no tokens, no public dataset — the subscriber list is only visible to whoever is logged in to the Netlify account
- Switched from a Sanity `subscriber` collection in August 2026, because Sanity's free plan only allows public datasets and the list was readable by anyone

### 7. The donation widget (GiveLively)
- Hosted at https://secure.givelively.org/donate/lets-be-ready
- We embed their official Simple Donation Widget via a `<script>` snippet stored in a Sanity field
- All payments go through GiveLively's Stripe account, donations land in their dashboard, tax receipts go out automatically
- We never touch credit card data, so no PCI compliance burden
- Editors can swap the embed code in Sanity without any code changes

### 8. The map (Leaflet + classrooms.json)
- The build script generates `classrooms.json` from Sanity's classroom documents
- The homepage loads `classrooms.json` at runtime via `map.js` and renders pins on a Leaflet map
- OpenStreetMap tiles, no API key needed, no Google Maps fees

## The publish-to-live data flow

```
1. Editor edits a field in Sanity Studio
2. Editor clicks Publish
3. Sanity fires a webhook to a Vercel deploy hook URL
4. Vercel starts a new deployment
5. Vercel runs `npm run build`, which runs `node build.js`
6. build.js fetches the latest content from Sanity's HTTP API
7. Templates are rendered, dist/ is regenerated
8. Vercel publishes dist/ to its global CDN
9. Total elapsed time: about 30 seconds
```

The webhook is configured in the Sanity dashboard under API → Webhooks. The deploy hook URL is configured in Vercel under Project → Settings → Git → Deploy Hooks.

## The local dev flow

```
1. Developer runs `npm run build` (with or without SANITY_PROJECT_ID)
2. build.js writes dist/
3. Developer runs `npm run dev`
4. Python's http.server serves dist/ on http://localhost:8080
5. Developer edits templates or styles, re-runs `npm run build`
6. Refresh the browser
```

No watch mode, no hot reload. The build is fast enough that you don't need it.

## Why no framework

The site has 7 pages, 3 dynamic data shapes, and one form. A framework would add hundreds of dependencies, a bundler, a hydration step, a runtime, and 10x the complexity for a site that doesn't need any of it.

The cost of "no framework" is that we hand-rolled a 50-line template engine. The benefit is that there's nothing to upgrade, nothing to break, and nothing for a future maintainer to learn before they can read the code.

## Where each piece lives in the repo

| Concern | File or directory |
|---|---|
| Marketing pages | `templates/` |
| Footer (shared partial) | `templates/_footer.html` |
| Build pipeline | `build.js` |
| CMS schemas | `studio/schemas/` |
| Studio config | `studio/sanity.config.ts` |
| Studio sidebar | `studio/deskStructure.ts` |
| Form backend | Netlify Forms (`templates/_footer.html`) |
| Frontend JS | `main.js`, `map.js` |
| Styles | `styles.css` |
| Migration tooling | `scripts/` |
| Production config | `vercel.json` |
| Editor docs | `training.html` |
| Project docs | `docs/`, `README.md`, `SANITY_SETUP.md` |

## Where the data lives

| Data | Source |
|---|---|
| Page copy (headlines, body, stats) | Sanity singletons |
| Classroom list (45 villages) | Sanity `classroom` collection |
| Leadership team | Sanity `teamMember` collection |
| Full staff | Sanity `staffMember` collection |
| Partners | Sanity `partner` collection |
| Expense pie chart | Sanity `expenseItem` collection |
| Newsletter signups | Netlify dashboard → Forms → newsletter |
| Donations | GiveLively dashboard (not in Sanity) |
| Photos | Sanity Media library (with sanity-plugin-media) |
| Site-wide settings (logo, contact, social, footer text) | Sanity `siteSettings` singleton |

## Things that are NOT in this codebase

- No database schema migrations (Sanity handles document storage)
- No authentication code (Sanity handles editor login)
- No file upload handler (Sanity handles image uploads and CDN delivery)
- No payment processing (GiveLively handles all of that)
- No transactional email sender (GiveLively handles donation receipts)
- No newsletter sender (the org will use Mailchimp or similar later, separate from this codebase)
- No analytics (the org can add Plausible or Google Analytics later via a snippet in the head)
