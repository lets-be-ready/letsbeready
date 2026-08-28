# Let's Be Ready

A static site + headless CMS for [Let's Be Ready](https://www.letsbeready.org), a 501(c)(3) nonprofit that runs preschool classrooms in rural Guatemala. Built for MIS 4374 (Information Technology Project Management) at UH, donated to the org.

> **Live site:** https://letsbeready.org
>
> **CMS:** https://letsbeready.sanity.studio
>
> **Editor training docs:** https://letsbeready.org/training

## What this is

A complete rebuild of the org's website and content workflow. The old site lived on Wix, was slow, looked dated, and was a pain to update. This replaces it with:

- A custom static site (no framework, vanilla JS, hand-rolled template engine, builds to flat HTML)
- A headless CMS where non-technical board members and staff edit content from any browser
- Real donation processing through GiveLively (Stripe-backed, free for nonprofits)
- A working newsletter signup form that writes to the CMS
- An auto-rebuild pipeline so publishing in the CMS pushes changes live in about 30 seconds with zero developer involvement
- A training guide written for editors who have never touched a CMS before

The whole thing is designed so the org can run it without me. I handed them the keys and bailed.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | Zero framework overhead, loads in under a second, no hydration cost, works without JS |
| Build | Custom Node.js script | About 750 lines, reads Sanity, processes templates, writes static files. No webpack, no vite, no plugins |
| Templates | Mustache-style with custom engine | Supports `{{key}}`, `{{#each}}`, `{{#if}}`, partials. About 50 lines of regex |
| CMS | [Sanity](https://sanity.io) | Real editor UX, free tier, hosted Studio, image CDN with on-the-fly resizing, generous nonprofit-friendly pricing |
| Hosting | [Vercel](https://vercel.com) | Free, fast global CDN, deploy hooks, serverless functions for the form API |
| Donations | [GiveLively](https://givelively.org) | Free for verified nonprofits, Stripe under the hood, takes Apple Pay / Google Pay / Venmo |
| Forms backend | Vercel serverless function + Sanity API | One file, about 80 lines, writes form submissions as Sanity documents |
| Map | Leaflet + OpenStreetMap | Free, no API key, lightweight |
| Studio plugin | sanity-plugin-media | Drag-and-drop bulk image library editors actually use |

No build tooling beyond Node and the Sanity CLI. No framework, no SSR, no rehydration. Just files.

## The story (Wix to custom Sheets to Sanity)

The interesting part of this project was the journey, not the tech. Full version is in [`docs/migration.md`](docs/migration.md). Short version below.

### Iteration 1: Stuck on Wix
The org was on Wix Studio. The site loaded slow, looked dated, and updating anything required dragging widgets around in Wix's editor. The board could barely change a phone number without breaking the layout. I rebuilt the marketing pages from scratch in plain HTML/CSS/JS so they would actually load fast and look modern.

### Iteration 2: Google Sheets as a CMS
With a static site I needed somewhere for editors to put copy, classroom data, team bios, and donation info without me touching code every time. I tried Google Sheets first. The thinking was that everyone on the board already used Google Workspace, the Sheets editor was familiar, and the Sheets API was free.

I built it. One spreadsheet with tabs for Site Content, Classrooms, Team Members, Donation Amounts, Partners, Expenses. The build script read the sheet via the Google API and rendered the templates. A Google Apps Script webhook fired on edit to trigger Vercel rebuilds.

It worked, but it was rough. The board found Sheets confusing for anything beyond a flat list. Adding a new team member meant remembering exactly which row format to use. There was no image picker, no validation, no preview. Photos lived in a separate Google Drive folder and had to be manually URL-pasted into cells. Two board members tried it once and gave up.

### Iteration 3: Sanity
I migrated everything to Sanity. Big upgrade for the editors:

- Real form fields with labels, validation, and inline help text
- Drag-and-drop image upload with auto-cropping and a hotspot tool
- Field groups and tabs so each page has its own clean editing UI
- A media library where every photo lives in one searchable grid
- Field history and revert
- Hosted at letsbeready.sanity.studio so editors can log in from anywhere on any device

The migration script (in `scripts/migrate-to-sanity.js`) was a one-shot import. About 80 lines. Pulled the existing fallback data plus the classrooms.json file, mapped each field to a Sanity document, and pushed in batches. Took about 30 seconds to populate the entire CMS.

After that I hand-imported 11 historical newsletter subscribers from the old Wix form, wired up the new form to a Vercel serverless function that writes to Sanity, dropped the GiveLively donation widget into the donate page, and finished by writing a training doc the editors actually read.

### Lessons
1. **The fanciest tech doesn't matter if editors won't use it.** I picked Sheets first because the API was free and the tool was familiar. Familiar tool, wrong shape. Editors needed structure and image handling, not a spreadsheet.
2. **Migrations get easier the more you do them.** Sheets to Sanity was much faster than HTML to Sheets because I had already separated content from presentation. The template engine didn't change, only the data source did.
3. **Write the training doc.** Most CMS handoffs fail because the developer disappears and the editors get stuck. Spending an afternoon on a real walkthrough doc saves 50 emails later.

## Architecture

```
                         ┌────────────────────────┐
                         │  Editors (board, staff)│
                         └───────────┬────────────┘
                                     │
                                     │ edit + publish
                                     ▼
        ┌────────────────────────────────────────────────┐
        │  Sanity Studio  (letsbeready.sanity.studio)    │
        │  Hosted by Sanity, free tier                   │
        └───────────────────────┬────────────────────────┘
                                │ webhook on publish
                                ▼
        ┌────────────────────────────────────────────────┐
        │  Vercel deploy hook                            │
        │  Triggers `node build.js` on each publish      │
        └───────────────────────┬────────────────────────┘
                                │
                                ▼
        ┌────────────────────────────────────────────────┐
        │  build.js                                      │
        │   1. Fetch all docs from Sanity HTTP API       │
        │   2. Render Mustache-style templates           │
        │   3. Generate pie chart SVG                    │
        │   4. Write static HTML + JSON to dist/         │
        └───────────────────────┬────────────────────────┘
                                │
                                ▼
        ┌────────────────────────────────────────────────┐
        │  Vercel CDN  (letsbeready.org)                 │
        │  Static HTML, vanilla JS, no SSR               │
        └────────────────────────────────────────────────┘

           ┌──────────────────┐         ┌──────────────────┐
           │  GiveLively      │         │  Netlify Forms   │
           │  (donate widget) │         │  (Vercel func)   │
           │  Stripe payments │         │  Writes form     │
           │  → org dashboard │         │  → Sanity docs   │
           └──────────────────┘         └──────────────────┘
```

The whole pipeline is decoupled. The Studio doesn't know about Vercel. Vercel doesn't know about Sanity at runtime, only at build time. The serverless form function is the only piece that talks to Sanity from production.

## Local development

You need Node 18+ and Python 3 (for the dev server). That's it.

```bash
# Install
git clone https://github.com/sibtk/letsbeready.git
cd letsbeready/new-site
npm install

# Build (uses static fallback data, no Sanity needed)
npm run build

# Serve dist/ on http://localhost:8080
npm run dev
```

To build against the live Sanity dataset instead of the static fallback:

```bash
SANITY_PROJECT_ID=juhmq0dg SANITY_DATASET=production npm run build
```

To run the Sanity Studio locally on http://localhost:3333:

```bash
cd studio
npm install
cd ..
npm run studio
```

## Repository layout

```
new-site/
├── assets/                 # Static images, favicon, training screenshots
├── docs/                   # Architecture, decisions, migration, process writeups
│   ├── architecture.md
│   ├── decisions.md
│   ├── migration.md
│   └── process.md
├── scripts/                # One-off tooling
│   ├── migrate-to-sanity.js   # One-shot static→Sanity importer
│   ├── scrape-wix-photos.js   # Pulls full-res photos out of old Wix HTML scrapes
│   └── upload-gdoc-photos.js  # Bulk-uploads local photo folders to Sanity
├── studio/                 # Sanity Studio (separate npm project, deploys to sanity.studio)
│   ├── schemas/            # Document type definitions
│   ├── deskStructure.ts    # Custom sidebar layout
│   └── sanity.config.ts
├── templates/              # Mustache-style HTML templates
│   ├── _footer.html        # Shared footer partial (referenced as {{footer_html}})
│   ├── index.html
│   ├── donate.html
│   ├── curriculum.html
│   ├── nutrition.html
│   ├── partners.html
│   └── staff.html
├── .well-known/            # Apple Pay domain verification file
├── build.js                # The build script
├── main.js                 # Frontend JS (nav, scroll, form submit)
├── map.js                  # Leaflet classroom map setup
├── styles.css              # All site CSS
├── training.html           # Standalone editor training guide
├── classrooms.json         # Generated by build.js, served to the map
└── vercel.json             # Vercel rewrites + headers config
```

## What I'm proud of

- **Holding the line on simplicity.** The temptation on a project like this is to add. Add another framework, another dashboard, another integration, another nice-to-have. Every addition would have made the project look more impressive but harder for the actual users to maintain. I kept the surface area small on purpose: no framework, no third-party form service, no analytics platform, no plugins beyond the one media library, no database besides the CMS itself. Constraining yourself like that is harder than it sounds, especially when "just add Postgres" is always sitting there as an option. Every feature on this site exists because the org needs it, not because it would look good on a resume.
- **Zero framework, fast as hell.** Lighthouse scores in the high 90s across the board. The homepage HTML is around 30 KB before gzip. No client-side rendering, no waterfalls.
- **Editors can run it without me.** The training doc, the field groups in Sanity, the auto-rebuild webhook, the cleaned-up sidebar. Handoff was painless.
- **The migration story.** Three iterations of CMS architecture before landing on the right one. The PM lessons are documented in [`docs/migration.md`](docs/migration.md).
- **The form pipeline.** Sanity isn't designed to be a form backend, but the serverless function approach works beautifully and gives editors a familiar inbox view of submissions.
- **Honest dead-code policy.** Every removed feature took its CSS, JS, schema, and Sanity docs with it. No orphan styles.

## What I'd do differently next time

- **Start with Sanity, not Sheets.** The Sheets detour cost about a week of build + migration time. Should have just gone to a real CMS first.
- **User-test in week 2, not week 6.** The Sheets-to-Sanity pivot would have happened in Sprint 2 instead of Sprint 3 if we'd put real editors in front of the prototype earlier. Cheapest lesson with the most expensive consequence.
- **Schemas in JS, not TS.** The Studio schemas are TypeScript because the Sanity docs default to it, but a vanilla-JS project doesn't really benefit. Adds a small mental overhead.
- **Component partials earlier.** Footer extraction into a shared partial happened late. The pattern works great and I would have used it from day one for headers and nav too.
- **Real CMS-driven nav.** The top nav is hardcoded in each template. Should be a Sanity field so editors can reorder it.

## Project management notes

This was a 14-week project for MIS 4374 (Information Technology Project Management) at UH. The class assignment was structured as a five-person team. In practice I owned the engineering, architecture, client relationship, and project management end to end. The class team handled the academic deliverables (final presentation, semester report). Solo build, single client, seven 2-week sprints, one major architecture pivot in the middle. The full PM writeup is in [`docs/process.md`](docs/process.md). Highlights:

- **Methodology:** Agile-ish, solo edition. Kept sprints, end-of-sprint reflections, and bi-weekly client demos. Dropped story points and burndown charts because they're overkill at N=1. Replaced standups with a 3-line daily working log written to myself.
- **Tools:** Linear for sprint planning and the project view. Figma for wireframes and design sign-off. Notion for the decision log and the original Gantt. GitHub for code and deployments. Loom for stakeholder walkthroughs. No Jira or Confluence; both would have been overkill.
- **The pivot:** Sprint 3, after a user-testing session with two board members, I threw out the Google Sheets CMS I'd built in Sprint 2 and rebuilt on Sanity. Cost a sprint of work, saved the entire project. The full story is in [`docs/migration.md`](docs/migration.md).
- **Stakeholder cadence:** weekly check-in with the executive director, bi-weekly demo to the full board, async Slack for everything else. One ED, one board chair, one channel. No internal coordination overhead because there was no internal team to coordinate with.
- **Risk register:** five risks tracked from day 1. The #1 risk was "the board can't or won't use the CMS I ship." The Sheets-to-Sanity pivot was that risk turning real, and the only reason I caught it in Sprint 3 instead of Sprint 7 was because I ran user tests early.
- **Why solo?** I cared more about the client outcome than the grade, and the project needed coherent end-to-end ownership. I'm not framing this as a complaint. Solo ownership of a real client project is one of the rarest experiences a student can get, and I learned ten times more by owning every layer than I would have learned in a perfectly distributed team experience.

## Documentation

For more depth, see the `docs/` folder:

- [`docs/architecture.md`](docs/architecture.md): system overview, data flow, where each piece lives
- [`docs/decisions.md`](docs/decisions.md): key technical and product decisions, with context
- [`docs/migration.md`](docs/migration.md): the full Wix to Sheets to Sanity story, with sprint context
- [`docs/process.md`](docs/process.md): project management methodology, team structure, sprint-by-sprint summary, retros, lessons
- [`SANITY_SETUP.md`](SANITY_SETUP.md): one-time Sanity setup walkthrough for cloning the project
- [`training.html`](training.html): the editor training doc that ships with the live site

## License

[MIT](LICENSE). Use it however you want.

## Built by

[@sibtk](https://github.com/sibtk). MIS 4374 class project for the Let's Be Ready board, donated for free. Built with Claude Code as an AI pair programmer; architecture, scope, decisions, and project management are mine.
