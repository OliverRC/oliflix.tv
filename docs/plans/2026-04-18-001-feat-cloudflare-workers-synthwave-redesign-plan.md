---
title: "feat: Migrate oliflix.tv to Cloudflare Workers + Synthwave Redesign"
type: feat
status: active
date: 2026-04-18
origin: docs/brainstorms/cloudflare-workers-synthwave-redesign-requirements.md
---

# feat: Migrate oliflix.tv to Cloudflare Workers + Synthwave Redesign

## Overview

Replace the current Nuxt 3 / Vercel deployment with a hand-written static page hosted on Cloudflare Workers Static Assets, and redesign the visual identity to a SignalNoise-inspired neon synthwave aesthetic. The entire Nuxt/Vue framework is removed; the site becomes a single `index.html` with a Tailwind CSS build step and no browser-side JavaScript framework. Deployment moves to GitHub Actions on push to `main`.

The site is a private personal hub — six service links (Plex, Seerr, Radarr, Sonarr, NZBGet, Tautulli) — with no backend, no auth, no dynamic data, and no blog.

## Problem Frame

The current stack (Nuxt 3, Nitro, `@nuxt/content`, shadcn-nuxt, Vercel) earns none of its complexity: the site has zero server-side data, zero API routes, and one rendered page. The visual design is a default Tailwind starter with no personality. Moving to a frameworkless static page eliminates upgrade treadmill, ships zero JS runtime, and consolidates hosting onto Cloudflare where the domain already lives.

(see origin: `docs/brainstorms/cloudflare-workers-synthwave-redesign-requirements.md`)

## Requirements Trace

- R1. Site served from Cloudflare Workers Static Assets; Vercel is eliminated.
- R2. Deploy triggered automatically by push to `main` via GitHub Actions (`cloudflare/wrangler-action@v3`).
- R3. Single-page composition: hero wordmark + six arcade-cartridge link cards + minimal footer. No blog, no nav, no header component.
- R4. Visual identity: deep indigo `#1B0137` background, synthwave / SignalNoise aesthetic, chrome display typography, starfield + CRT scanlines + film grain atmosphere, arcade-cartridge card treatment.
- R5. All Nuxt/Vue framework dependencies removed from `package.json`.
- R6. Zero runtime JavaScript shipped to the browser. Starfield animation may use a small `<script>` if CSS-only doesn't land well; all hover/transition effects must be CSS.
- R7. Hero wordmark is pre-rendered SVG or PNG art (not a live CSS-styled webfont).

## Scope Boundaries

- No RSS, sitemap, or SEO surface.
- No R2 bucket. Workers Static Assets covers hosting without it.
- No per-PR preview deploys.
- No server-side logic, auth, or dynamic data.
- No blog or long-form content.
- No design system or reusable component library.
- `__old/` directory left untouched — pre-existing, out of scope.
- `design-ideas/` directory left in repo for reference; not deployed.

### Deferred to Separate Tasks

- Hero wordmark final art: sourcing (commissioned / AI-generated / hand-crafted) is a creative task handled outside this plan. A placeholder is shipped in Unit 3; the final asset swaps in later.
- Seerr icon: the `public/overseerr-icon.svg` needs replacing with a Seerr icon. A placeholder or the existing file is used for now; the correct asset is sourced separately.

## Context & Research

### Relevant Code and Patterns

- Current source to delete: `pages/`, `components/`, `content/`, `app.vue`, `nuxt.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `types/`, `lib/`, `assets/`, `components.json`, `.npmrc`, `package-lock.json`
- Assets to preserve: `public/favicon.ico`, `public/plex-icon.svg`, `public/radarr-icon.svg`, `public/sonarr-icon.svg`, `public/nzbget-icon.png`, `public/tautulli-icon.png`
- Design reference: `design-ideas/` — seven SignalNoise / James White illustrations. Key vocabulary: deep indigo-black grounds (`#1B0137`), chrome-gradient display type (metallic bevels, magenta→orange→cyan sunset fills), hard-edged geometry, lens-flare sparkles, film grain texture.

### External References

- Cloudflare Workers Static Assets: pure static site shape requires only `[assets]\ndirectory = "./dist"` in `wrangler.toml`. No `main` Worker file, no `binding` needed when there is no custom logic.
- GitHub Actions deployment: `cloudflare/wrangler-action@v3` with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. Reference: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- Tailwind v4 standalone CLI: single downloaded binary (`tailwindcss-linux-x64` from `https://github.com/tailwindlabs/tailwindcss/releases`), no npm dependency, fastest CI builds. Note: the npm equivalent in v4 is `@tailwindcss/cli` (not `tailwindcss`) — ensure the v4 binary is downloaded, not the v3 standalone.
- Custom domain on Workers: configured via `[[routes]]` in `wrangler.toml` or via the Cloudflare dashboard after the Worker is deployed.

## Key Technical Decisions

- **No Worker code file:** For a pure static site, Cloudflare does not require a `main` entry. Omitting it simplifies the config and removes a file that serves no purpose.
- **`not_found_handling` omitted:** The site is truly a single `index.html` with no sub-routes. Default behaviour (serve asset or return 404) is correct. SPA mode (`not_found_handling = "single-page-application"`) is unnecessary.
- **Tailwind v4 standalone CLI:** Eliminates npm as a build-time dependency for styling. `package.json` only needs `wrangler` as a devDependency. Faster CI cold starts. Binary is the v4 `tailwindcss-linux-x64` release (not the v3 standalone); version must be pinned. The npm equivalent changed to `@tailwindcss/cli` in v4.
- **CSS-only for scanlines and grain:** `repeating-linear-gradient` for scanlines; a small inline SVG `<feTurbulence>` filter or tiled SVG data-URI for grain. Zero extra network requests.
- **Starfield:** CSS-only preferred (layered `radial-gradient` stars or SVG). Permitted to use a minimal vanilla JS canvas fallback only if the CSS approach doesn't hold up visually.
- **Hero wordmark as pre-rendered art:** A placeholder SVG is shipped in Unit 3. Final art (painted/beveled chrome, horizon line inside glyphs) is sourced and swapped separately. `<link rel="preload" as="image">` added for it.
- **Repo cleanup is a single "nuke and pave" commit** in the same repository — all Nuxt files removed, new structure added. Git history preserves old code.
- **DNS cutover is two-step:** deploy to `*.workers.dev` → verify visually → add `oliflix.tv` as custom domain on the Worker → pause (not delete) Vercel project for ~1 week as rollback option.

## Open Questions

### Resolved During Planning

- **Tailwind install shape:** Standalone CLI binary — no npm dep for styling.
- **Repo cleanup strategy:** Nuke and pave in same repo in a single migration commit.
- **Scanlines/grain implementation:** Pure CSS, no PNG overlay assets.
- **`not_found_handling`:** Omitted — single page, default 404 behaviour is correct.
- **DNS cutover strategy:** Two-step: `*.workers.dev` verification first, then route binding; Vercel paused as rollback.
- **Hero preload:** Yes, `<link rel="preload" as="image">` for the wordmark.

### Deferred to Implementation

- Exact gradient colour stops for the sunset palette (magenta→orange→cyan): pinned during visual iteration.
- Final hero wordmark art source and format (SVG vs PNG, commissioned vs AI-generated).
- Whether CSS-only starfield is visually sufficient or needs the JS canvas fallback.
- Seerr icon final asset.
- Exact per-card accent colour per service (implemented and tuned visually).

## Output Structure

```
oliflix.tv/
├── src/
│   ├── index.html          # single page, hand-written
│   └── input.css           # Tailwind @import + custom layers
├── public/                 # preserved service icons + favicon (unchanged)
│   ├── favicon.ico
│   ├── plex-icon.svg
│   ├── radarr-icon.svg
│   ├── sonarr-icon.svg
│   ├── nzbget-icon.png
│   ├── tautulli-icon.png
│   └── overseerr-icon.svg  # placeholder until Seerr icon is sourced
├── dist/                   # build output (gitignored) — what Wrangler uploads
│   ├── index.html
│   ├── app.css
│   └── [icons, favicon]
├── design-ideas/           # reference images, not deployed
├── docs/
│   ├── brainstorms/
│   └── plans/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── wrangler.toml
├── package.json            # devDep: wrangler only
├── .gitignore
└── README.md
```

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

### Build pipeline

```
src/index.html   ──────────────────────────────────┐
src/input.css ──► tailwindcss CLI (standalone)      ├──► dist/  ──► wrangler deploy ──► Cloudflare edge
public/icons    ──► copy to dist/                   ┘
```

### Page composition (top → bottom)

```
┌─────────────────────────────────────────────────┐
│  [starfield + scanlines + grain bg]              │
│                                                  │
│     ╔═══════════════════════════╗                │
│     ║   OLIFLIX  (hero art)     ║  ← SVG/PNG    │
│     ╚═══════════════════════════╝                │
│     "Lights, camera … binge!"   ← Orbitron italic│
│                                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│  │Plex│ │Seer│ │Radr│ │Sonr│ │NZBg│ │Taut│     │  ← arcade cards
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘     │
│                                                  │
│  ── footer colophon ──────────────────────────── │
└─────────────────────────────────────────────────┘
```

### Wrangler config shape (no Worker code)

```toml
name = "oliflix-tv"
compatibility_date = "2026-04-18"

[assets]
directory = "./dist"
```

Custom domain added via dashboard or `routes` block after Worker is live and verified.

---

## Implementation Units

- [ ] **Unit 1: Repo cleanup — remove Nuxt, establish new structure**

**Goal:** Delete all Nuxt/Vue framework files and folders; create the new minimal directory structure with a skeleton `package.json` and `wrangler.toml`. The repo goes from a Nuxt project to a blank slate ready for the new site.

**Requirements:** R1, R5

**Dependencies:** None

**Files:**
- Delete: `pages/`, `components/`, `content/`, `app.vue`, `nuxt.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `types/`, `lib/`, `assets/`, `components.json`, `.npmrc`, `package-lock.json`
- Create: `wrangler.toml`
- Create: `package.json` (wrangler devDep only)
- Create: `src/` directory (empty, placeholder for Unit 2)
- Modify: `.gitignore` (add `dist/`, remove Nuxt-specific entries like `.nuxt`, `.nitro`, `.output`, `.data`)
- Modify: `README.md` (replace Nuxt starter boilerplate with brief description of the new stack)

**Approach:**
- `package.json` has one devDependency: `wrangler` (latest). Scripts: `build` (Tailwind CLI + copy assets), `deploy` (wrangler deploy), `dev` (serve dist locally with wrangler dev or a simple static server).
- `wrangler.toml`: `name = "oliflix-tv"`, `compatibility_date`, `[assets] directory = "./dist"`. No `main`. No `binding`. Note: some wrangler versions may warn about missing `main` — this is expected and safe to ignore for assets-only Workers.
- Preserve `public/` exactly as-is. Preserve `design-ideas/`. Preserve `docs/`.
- The `__old/` directory is left untouched.

**Test scenarios:**
- Test expectation: none — this is pure file deletion and config scaffolding with no behavioural surface. Verification is structural (file presence/absence).

**Verification:**
- `pages/`, `components/`, `content/`, `assets/`, `app.vue`, `nuxt.config.ts` do not exist.
- `wrangler.toml` is present and valid (`wrangler whoami` or `wrangler deploy --dry-run` passes).
- `package.json` lists only `wrangler` as a devDep and has no Nuxt/Vue packages.
- `.gitignore` includes `dist/`.

---

- [ ] **Unit 2: Tailwind CSS build pipeline**

**Goal:** Wire up the Tailwind v4 standalone CLI to compile `src/input.css` into `dist/app.css`, including the custom synthwave design tokens and effect layers (scanlines, grain, glow utilities).

**Requirements:** R4, R5, R6

**Dependencies:** Unit 1

**Files:**
- Create: `src/input.css` — Tailwind entry with `@import "tailwindcss"`, custom CSS layers for synthwave tokens, scanlines, grain, glow utilities, card bevel styles, and keyframe animations
- Create: `scripts/build.sh` (or npm build script) — runs Tailwind CLI, then copies `public/` assets into `dist/`
- Modify: `package.json` — wire `build` script

**Approach:**
- Tailwind v4 uses CSS-first config: design tokens declared as `@theme` CSS custom properties directly in `input.css`, not a `tailwind.config.ts`. No config file needed.
- Tailwind v4 uses CSS-first config: design tokens are declared as `@theme` custom properties directly in `input.css`; no `tailwind.config.ts` is needed.
- **v4 layer API note:** In Tailwind v4, `@layer utilities` and `@layer components` no longer register variant-aware classes (hover, focus, responsive). Use `@utility` for any custom class that needs variant support. `@layer base` remains correct for base resets and font-face declarations.
- Custom CSS structure:
  - `@layer base`: `html { background: #1B0137 }`, font-face declarations for Orbitron (Google Fonts or self-hosted).
  - `@utility card { … }`: card bevel/chrome border styles — use `@utility` not `@layer components` so hover/focus variants work.
  - `@utility hero-tagline { … }`, `@utility footer-colophon { … }`: same reason.
  - Scanlines: a `::before` pseudo-element on `body` using `repeating-linear-gradient` at ~2px intervals, ~5% opacity.
  - Grain: a `::after` pseudo-element on `body` using an inline SVG `<feTurbulence>` filter via `background-image: url("data:image/svg+xml,...")` tiled at small size, multiply blended, ~8-12% opacity.
  - Glow utilities: custom `--glow-*` CSS vars for card hover `box-shadow` pulse (CSS transition, no JS).
- **v4 utility rename hazard:** Several v3 utility names changed in v4. When writing card/glow/bevel styles, use v4 names: `shadow-xs`/`shadow-sm` (not v3's `shadow-sm`/`shadow`), `rounded-xs`/`rounded-sm`, `ring-3` (not `ring`). Verify against the [v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) if in doubt.
- Build script operations (all three must be explicit):
  1. Tailwind compile: `tailwindcss -i src/input.css -o dist/app.css --minify`
  2. Copy icons + favicon: `cp -r public/* dist/`
  3. Copy HTML: `cp src/index.html dist/index.html`
- Tailwind standalone binary downloaded in CI via a setup step (pinned version); locally, developer downloads it once.

**Test scenarios:**
- Test expectation: none — this is a build pipeline; verification is output-based.

**Verification:**
- Running the build script produces `dist/app.css` with no errors.
- `dist/app.css` contains synthwave colour variables and custom utility classes.
- `dist/` contains `index.html`, copied service icons, and favicon.
- The CSS file is minified (Tailwind CLI `--minify` flag).

---

- [ ] **Unit 3: `index.html` — page structure and hero section**

**Goal:** Write the single `src/index.html` with complete semantic structure: `<head>` (meta, preload, font, CSS link), hero section (wordmark + tagline), empty card grid container, and footer. Establish the page's visual skeleton.

**Requirements:** R3, R4, R6, R7

**Dependencies:** Unit 2 (CSS must exist to test the visual)

**Files:**
- Create: `src/index.html`
- Create: `src/oliflix-wordmark-placeholder.svg` — placeholder wordmark (flat text "OLIFLIX" in Bungee or similar, styled with a basic gradient fill) to hold space until final art is delivered

**Approach:**
- `<head>`: charset, viewport, `<title>oliflix.tv</title>`, `<link rel="icon" href="/favicon.ico">`, `<link rel="preload" as="image" href="/oliflix-wordmark.svg">` (or `.png`), `<link rel="stylesheet" href="/app.css">`, Google Fonts preconnect for Orbitron.
- No `<script>` tags in this unit. Starfield is handled in Unit 4.
- Hero section: a `<header>` element containing the wordmark `<img>` and the tagline `<p>` ("Lights, camera … binge!"). Full-viewport height with flexbox centering on desktop, reduced on mobile.
- Grid container: `<main>` with an empty `<div class="card-grid">` — cards populated in Unit 4.
- Footer: `<footer>` with a one-line colophon (e.g. "oliflix.tv — personal media hub").
- No inline styles. All presentation through `app.css` classes.
- `lang="en"` on `<html>`. Semantic elements throughout.

**Test scenarios:**
- Test expectation: none — this is hand-written HTML; verification is visual and structural.

**Verification:**
- Page renders in a browser with `#1B0137` background, scanlines overlay, grain texture visible.
- Hero wordmark placeholder is centred and readable.
- Tagline appears in Orbitron italic below the wordmark.
- Footer is present at bottom.
- No console errors.
- Page passes basic HTML validation (no stray tags, correct nesting).

---

- [ ] **Unit 4: Link cards and starfield background**

**Goal:** Implement the six arcade-cartridge / VHS-case service cards and the starfield background effect. This is the visual and functional centrepiece of the page.

**Requirements:** R3, R4, R6

**Dependencies:** Unit 3

**Files:**
- Modify: `src/index.html` — populate the `.card-grid` with six card elements; add starfield markup or `<script>` if CSS-only starfield is insufficient
- Modify: `src/input.css` — card bevel/chrome/glow styles, per-card accent colour custom properties, grid layout, hover transitions, starfield CSS if CSS-only approach is used

**Approach:**

**Cards:**
- Each card is an `<a href="...">` wrapping a structured inner layout:
  - Coloured left/top stripe (the "cartridge side" — per-service accent colour as a CSS custom property `--card-accent`).
  - Service icon (`<img>` from `/[service]-icon.svg|png`).
  - Service name in Orbitron/Bungee display style.
  - Short description in lighter body type.
  - Chrome bevel: `border`, layered `box-shadow` (inset highlights + outer glow) to simulate bevelled edge. No images — pure CSS.
- Hover state: CSS `transition` on `box-shadow` (glow pulse) + `transform: scale(1.02) rotate(-0.5deg)` — no JS.
- Grid: CSS Grid, `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`, 3-up on desktop, 2-up on tablet, 1-up on mobile.

**Per-service accent colours (initial suggestions, tuned during implementation):**
- Plex: gold/amber `#E5A00D`
- Seerr: teal `#00C2E0`
- Radarr: yellow `#FAC800`
- Sonarr: blue `#35C5F4`
- NZBGet: orange `#FF6B00`
- Tautulli: pink-red `#CC3333`

**Starfield:**
- Preferred: CSS-only layered `radial-gradient` dots on `body::before` pseudo, multiple gradient stops across a large background size, animated with a slow `background-position` drift.
- Fallback (only if CSS approach looks flat): minimal vanilla `<canvas>` script, ~30 lines, static stars with no animation loop (performance-first).
- Stars should be subtle — they set atmosphere, not dominate.

**Test scenarios:**
- Test expectation: none — this is a visual static page. Verification is visual/structural.

**Verification:**
- All six cards render with correct service names, icons, URLs, and descriptions matching the table in the requirements doc.
- Each card links to the correct URL.
- Hover produces visible glow pulse + slight scale — no JS errors, no layout shift.
- Grid is responsive: 3-up at ≥1024px, wraps gracefully below.
- Starfield is visible but not distracting.
- Background atmosphere (scanlines + grain + starfield) layers without fighting each other.
- Mobile: cards readable and tappable with adequate touch target size (≥44px).
- Icons load; missing Seerr icon uses placeholder gracefully (alt text, no broken image).

---

- [ ] **Unit 5: GitHub Actions deploy workflow**

**Goal:** Create the CI/CD pipeline that builds the site and deploys it to Cloudflare Workers on every push to `main`.

**Requirements:** R1, R2

**Dependencies:** Unit 1 (wrangler.toml must exist)

**Files:**
- Create: `.github/workflows/deploy.yml`

**Approach:**
- Trigger: `on: push: branches: [main]`
- Single job: `deploy`, runs on `ubuntu-latest`.
- Steps:
  1. `actions/checkout@v4`
  2. Download Tailwind v4 standalone CLI binary for Linux x64 from `https://github.com/tailwindlabs/tailwindcss/releases/download/v<TAILWIND_VERSION>/tailwindcss-linux-x64`. Pin `TAILWIND_VERSION` as a workflow env var (e.g. `4.x.x`). Cache the binary using `actions/cache` with key `tailwindcss-linux-x64-<TAILWIND_VERSION>` — include the version in the key so the cache correctly invalidates on version bumps.
  3. Run build script (three explicit operations in order): (a) `./tailwindcss -i src/input.css -o dist/app.css --minify`, (b) `cp -r public/* dist/`, (c) `cp src/index.html dist/index.html`.
  4. `cloudflare/wrangler-action@v3` with `apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}` and `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`.
- Secrets required (documented in README): `CLOUDFLARE_API_TOKEN` (Edit Cloudflare Workers template), `CLOUDFLARE_ACCOUNT_ID`.
- No Node.js setup step needed for Tailwind (standalone binary). Node setup is only needed for wrangler — `cloudflare/wrangler-action@v3` handles that internally.
- `dist/` is gitignored — it exists only in the CI runner and is uploaded directly by wrangler.

**Test scenarios:**
- Test expectation: none — workflow validation is behavioural (push to main triggers a deploy).

**Verification:**
- Pushing a trivial change to `main` triggers the workflow.
- Workflow completes without error and wrangler reports a successful deployment.
- The deployed Worker URL (`oliflix-tv.<account>.workers.dev`) serves the new site.
- No secrets appear in workflow logs.

---

- [ ] **Unit 6: DNS cutover and Vercel decommission**

**Goal:** Cut `oliflix.tv` over from Vercel to the Cloudflare Worker and cleanly decommission the Vercel deployment.

**Requirements:** R1

**Dependencies:** Unit 5 (Worker must be successfully deployed and verified at `*.workers.dev`)

**Files:**
- Modify: `wrangler.toml` — add custom domain / route binding for `oliflix.tv`
- Modify: `README.md` — update with final deployment notes and cutover record

**Approach:**

**Two-step cutover:**

1. **Verify at workers.dev first.** After Unit 5 is complete, manually confirm the full page renders correctly at the `oliflix-tv.<account>.workers.dev` URL. Check: all six cards, icons, links, hover states, background effects, mobile layout.

2. **Add custom domain.** In the Cloudflare dashboard → Workers → oliflix-tv → Settings → Domains & Routes → Add Custom Domain → `oliflix.tv`. Cloudflare takes over the DNS record automatically (domain is already on Cloudflare). Alternatively, add a `[[routes]]` block to `wrangler.toml` using the canonical TOML array-of-tables syntax (no `/*` wildcard needed for custom domains):
   ```toml
   [[routes]]
   pattern = "oliflix.tv"
   custom_domain = true
   ```
   Then `wrangler deploy` applies it.

3. **Pause Vercel project.** In the Vercel dashboard, pause (do not delete) the project. Leave it paused for ~7 days. If the Worker behaves correctly, delete the Vercel project afterwards.

4. **Remove Vercel config.** `.vercel/` directory (if it exists locally) can be deleted. Any Vercel environment variables or tokens are out of scope — personal account management.

**Test scenarios:**
- Test expectation: none — this is an operational cutover, not a code change.

**Verification:**
- `https://oliflix.tv` loads the synthwave page from Cloudflare Workers (verify via `curl -I oliflix.tv` — `cf-ray` header confirms CF origin, or browser DevTools).
- No redirect loop or certificate error.
- Vercel project is paused (not serving traffic).
- All six service links on the page are reachable (external URLs — spot-check one or two).

---

## System-Wide Impact

- **Interaction graph:** No callbacks, middleware, or observers. Static HTML — no runtime framework. The only "integration" surface is the Tailwind CLI build step and Wrangler deploy command.
- **Error propagation:** No runtime errors possible. Build failures surface in GitHub Actions logs. A failed Wrangler deploy leaves the previous deployment live (Workers is atomic).
- **State lifecycle risks:** None. No persistent state, no cache to invalidate beyond Cloudflare's automatic edge cache (asset hashes handle this).
- **API surface parity:** None. No API.
- **Integration coverage:** The `oliflix.tv` subdomains (overseerr, radarr, sonarr, etc.) are separate services not managed by this repo. The link cards point to them via hardcoded URLs — no integration dependency.
- **Unchanged invariants:** `public/favicon.ico` and all preserved service icons maintain their paths (`/plex-icon.svg` etc.) so existing bookmarks to the page work and icon paths in the new HTML match current paths.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Hero wordmark placeholder ships to production looking unfinished | Acceptable for a personal private site. Final art swapped in a follow-up commit. Placeholder should at minimum be styled with a gradient fill, not bare default text. |
| CSS-only starfield looks flat or too performance-heavy on mobile | Fallback canvas script is pre-planned (Unit 4). Alternatively, disable starfield animation on `prefers-reduced-motion`. |
| Synthwave aesthetic lands as cheap rather than considered | Lean on CSS bevel/glow craft for cards. Avoid generic gradient overlays. Reference images from `design-ideas/` during build and take screenshots frequently. |
| Scanlines + grain + starfield combination too busy on small screens | Reduce grain opacity and disable scanlines below a breakpoint (e.g., `@media (max-width: 640px) { body::before { display: none } }`). |
| Tailwind v4 standalone CLI download in CI fails or is slow | Pin `TAILWIND_VERSION` env var in the workflow; cache binary with key `tailwindcss-linux-x64-<version>`. |
| Accidentally downloading the v3 standalone Tailwind binary | The binary is at `tailwindlabs/tailwindcss/releases` but the v3 standalone binary has the same filename. Pin an explicit v4.x.x version tag in the workflow env var. |
| DNS cutover causes brief downtime | Two-step cutover (verify at workers.dev first) eliminates this. Cloudflare custom domain propagation is near-instant for zones already on Cloudflare. |
| Seerr icon not available | Use `overseerr-icon.svg` as placeholder. Update separately when icon is sourced. |
| Wrangler deploy credential misconfiguration blocks CI | Test `wrangler deploy --dry-run` locally before wiring GitHub Actions; confirm secrets are set in repo settings. |

## Documentation / Operational Notes

- After cutover, update `README.md` to describe the new stack: HTML + Tailwind CLI + Wrangler, deploy via GitHub Actions.
- Two secrets must be set in GitHub repo settings before Unit 5 can deploy: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- The Tailwind standalone binary version should be pinned in the workflow and in README for reproducibility.
- `dist/` is always ephemeral (gitignored). The built site lives only in CI and on Cloudflare's edge.
- Vercel project should be paused (not deleted) for at least 7 days post-cutover as a rollback option.

## Sources & References

- **Origin document:** [docs/brainstorms/cloudflare-workers-synthwave-redesign-requirements.md](docs/brainstorms/cloudflare-workers-synthwave-redesign-requirements.md)
- Cloudflare Workers Static Assets docs: https://developers.cloudflare.com/workers/static-assets/
- Wrangler config reference: https://developers.cloudflare.com/workers/static-assets/binding/
- GitHub Actions + Wrangler: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- Design references: `design-ideas/` (7 SignalNoise / James White illustrations)
