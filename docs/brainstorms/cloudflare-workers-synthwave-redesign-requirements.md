# oliflix.tv — Cloudflare Workers migration + synthwave redesign

**Status:** Requirements captured, ready for planning
**Date:** 2026-04-18
**Type:** Platform migration + visual redesign
**Scope:** Standard

## 1. Summary

Replace the current Nuxt-on-Vercel site with a hand-written static page hosted on Cloudflare Workers Static Assets, and redesign it as a single-page synthwave / SignalNoise-inspired landing page. The site is a personal "hub of links" pointing at the services running on the oliflix.tv Plex setup (Plex, Seerr, Radarr, Sonarr, NZBGet, Tautulli). The blog is being removed; the site becomes a single composition.

## 2. Motivations

- **Consolidate on Cloudflare.** The domain and adjacent infra already live there; hosting should too.
- **Drop a framework the site never earns.** Nuxt's SSR, Nitro runtime, Vue hydration, and `@nuxt/content` are unused — the site has no dynamic data, no API calls, and (after this change) no multi-page content.
- **Remove Vercel as a dependency.** One fewer account and billing relationship.
- **Make the site feel like what it is.** A tiny, personal, fun page. The current look is a Tailwind starter; the redesign gives it identity.

## 3. Goals

- Serve the site from Cloudflare Workers with static assets, deployed from GitHub on push to `main`.
- Ship a redesigned single-page experience with a strong synthwave / SignalNoise visual identity.
- Keep the six service links (Plex, Seerr, Radarr, Sonarr, NZBGet, Tautulli) as the functional core of the page.
- Drop framework weight: no Nuxt, no Vue, no npm framework runtime shipped to the browser.

## 4. Non-goals

- RSS feed, sitemap, or any SEO surface (private site, no public discoverability required).
- R2 bucket (Workers Static Assets covers the hosting need; R2 adds complexity without benefit here).
- Preview deploys on PRs (solo project, not worth the CI complexity yet).
- Any server-side logic, auth, or dynamic data.
- Blog, posts, or long-form content of any kind.
- A design system or reusable component library (single page; YAGNI).
- Visual parity with the current site (full redesign is intentional).

## 5. Target experience

### 5.1 The page, top to bottom

1. **Hero** — A large SignalNoise-style "OLIFLIX" wordmark as the centerpiece. Chrome/gradient finish (magenta → orange → cyan sunset palette, horizon line inside the glyphs, metallic bevels, lens-flare sparkles). Rendered as a pre-made SVG or PNG — this is art, not CSS. Tagline "Lights, camera … binge!" underneath in a retro italic display font.
2. **Link grid** — Six "arcade cartridge / VHS case" cards, one per service. Each card has:
   - Service icon (reuse existing assets in `public/`)
   - Service name in display type
   - Short description
   - Chrome bevel edge, colored side stripe (per-service accent), subtle inner glow
   - Hover state: glow pulse + slight scale or tilt
3. **Footer** — Minimal. A small colophon line or synthwave flourish. No nav.

No separate top header. The hero wordmark *is* the header.

### 5.2 Background / atmosphere

- Base color: `#1B0137` (deep indigo, as specified).
- Layered background effects:
  - Subtle starfield (static or very gently animated)
  - CRT scanlines overlay at low opacity
  - Film grain texture
- Optional accent: a handful of placed lens-flare sprites near the hero.
- No retro sunset grid / perspective floor — starfield is the primary motif.

### 5.3 Typography

- **Display (hero, section titles, card names):** retro chrome treatment. Candidate fonts: Monoton, Bungee, Audiowide, or a custom SVG for the main wordmark. Used sparingly.
- **Body (descriptions, tagline, footer):** italic geometric sans — Eurostile / Orbitron / similar — for the Miami-Vice nod while staying readable.
- Hero wordmark ships as SVG/PNG art, not web font, to match the painted/beveled look of the reference images.

### 5.4 Color palette

- Background: `#1B0137`
- Accent sunset gradient: magenta → orange → cyan (specific stops to be pinned during implementation)
- Chrome: silver / cool white highlights for beveled surfaces
- Text: off-white body, chrome-gradient display

### 5.5 Design references

See `design-ideas/` in repo root — seven SignalNoise / James White illustrations establishing the vocabulary: chrome display type, horizon lines in glyphs, hard bevels, sunset gradients, lens flares, grain, deep indigo-black grounds.

## 6. Content scope

### 6.1 Service links (preserved)

| Service     | URL                              | Type      | Description                        |
|-------------|----------------------------------|-----------|------------------------------------|
| Plex        | `https://app.plex.tv/desktop`    | User App  | Where you watch stuff              |
| Seerr       | `https://seerr.oliflix.tv`       | User App  | Where you request stuff            |
| Radarr      | `https://radarr.oliflix.tv`      | Admin App | Manages movie stuff                |
| Sonarr      | `https://sonarr.oliflix.tv`      | Admin App | Manages series / TV / anime stuff  |
| NZBGet      | `https://nzbget.oliflix.tv`      | Admin App | For downloading stuff              |
| Tautulli    | `https://tautulli.oliflix.tv`    | Admin App | Monitoring Plex server stuff       |

Copy tone stays playful — "stuff" voice is intentional. Descriptions may be lightly tightened during implementation, not rewritten.

### 6.2 Assets preserved

- Service icons in `public/`: `plex-icon.svg`, `radarr-icon.svg`, `sonarr-icon.svg`, `nzbget-icon.png`, `tautulli-icon.png`. The current `public/overseerr-icon.svg` needs to be replaced with a Seerr icon (source during implementation).
- `public/favicon.ico`

### 6.3 Removed

- `content/posts/` (both markdown files)
- `pages/posts/[...slug].vue`
- Posts list section from homepage
- `components/AppHeader.vue`
- `components/LinkCard.vue` (replaced with new card design)
- `components/content/` and `components/ui/` (shadcn-nuxt components)
- `assets/images/oliflix-text.svg` (replaced by new hero wordmark)
- `@nuxt/content`, `shadcn-nuxt`, `nuxt-svgo`, `@neondatabase/serverless` and all other framework deps

## 7. Platform & deployment

### 7.1 Stack

- **Content:** single hand-written `index.html`
- **Styling:** Tailwind CSS via the Tailwind CLI build step (produces a static CSS bundle; no runtime). Custom CSS for the retro effects (CRT scanlines, grain, glow, bevel) lives alongside.
- **Framework:** none.
- **Assets:** service icons, favicon, hero wordmark art, any texture images.

### 7.2 Hosting

- Cloudflare Workers with Static Assets binding (`assets = { directory = "./dist" }` in `wrangler.toml`).
- No R2. No Pages. No separate Worker logic — the assets binding serves the site directly.

### 7.3 Deployment flow

- Source lives in this repo; push to `main` triggers a GitHub Actions workflow.
- Workflow: install deps → build Tailwind CSS → run `wrangler deploy`.
- Cloudflare API token + account ID stored as GitHub Actions secrets.
- No preview deploys. No per-PR environments.

### 7.4 Domain

- `oliflix.tv` cuts over to the Worker. DNS already on Cloudflare, so this is a route binding swap.
- Cutover should be switchable (ability to roll back to Vercel if needed during transition).

## 8. Success criteria

- `oliflix.tv` loads the new design from Cloudflare Workers. No Vercel involvement.
- Pushing to `main` on GitHub deploys the new version end-to-end without manual steps.
- Homepage is a single page: hero wordmark + six-card link grid + minimal footer. No blog, no post route, no header nav.
- Visual identity reads unmistakably as synthwave / SignalNoise-inspired: deep indigo ground, chrome display type, retro italic body, starfield + scanlines + grain atmosphere.
- All Nuxt/Vue framework dependencies are gone from `package.json` (`nuxt`, `@nuxt/content`, `@nuxt/devtools`, `@nuxtjs/tailwindcss`, `shadcn-nuxt`, `nuxt-svgo`, `radix-vue`, `lucide-vue-next`, `@vueuse/core`, `@neondatabase/serverless`, and anything else Vue-ecosystem).
- Zero runtime JavaScript shipped to the browser by default. The only permitted exception is a small script for the starfield background effect, if a CSS-only version doesn't land well. Hover states, transitions, and card animations must be CSS.

## 9. Open questions (for planning)

These are implementation-level and belong in the planning phase, but flagging so they aren't forgotten:

- Exact display font choice for the hero wordmark (commissioned SVG vs. free font like Monoton styled with CSS gradients/strokes). Reference images look painted — a static SVG/PNG is likely the only way to match them.
- How to source or generate the hero art — hand-crafted, AI-generated, or sourced illustration with license.
- Whether to pin specific hex stops for the sunset gradient or let it emerge during visual iteration.
- CRT scanlines + grain — pure CSS (repeating-linear-gradient + SVG noise) vs. a PNG overlay. CSS is lighter; PNG is more controllable.
- Tailwind version and whether to use any plugins (animate, typography is no longer needed).
- Whether a handful of `<link rel="preload">` hints make sense for the hero art.
- Exact rollback strategy during cutover (keep Vercel deployment live until Worker is verified, then flip DNS route).

## 10. Risks & mitigations

- **Risk: the synthwave look lands as "AI slop" / cheap rather than considered.** The reference aesthetic depends on real illustration craft (painted chrome, controlled grain, purposeful flares). Plain CSS gradients and default Google Fonts will look cheap.
  - *Mitigation:* commit to a proper hero wordmark asset (SVG or PNG art), not a CSS-styled webfont. Treat the visual as art direction, not a theme. Iterate on screenshots during build.
- **Risk: the starfield + scanlines + grain combination looks busy on small screens.**
  - *Mitigation:* tune opacity per viewport; consider disabling grain or scanlines below a breakpoint.
- **Risk: the hand-written approach becomes annoying if a second page is ever added.**
  - *Mitigation:* accept this trade-off consciously. If a second surface emerges later, revisit — Astro remains a cheap upgrade path.
- **Risk: DNS cutover breaks the site briefly.**
  - *Mitigation:* verify the Worker at a `*.workers.dev` URL first; swap the route binding on `oliflix.tv` only once verified.
