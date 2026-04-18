# oliflix.tv

Personal media hub — a single-page synthwave landing page linking to the oliflix.tv self-hosted services (Plex, Seerr, Radarr, Sonarr, NZBGet, Tautulli).

## Stack

- **HTML** — hand-written `src/index.html`
- **CSS** — [Tailwind CSS v4](https://tailwindcss.com) (`@tailwindcss/cli` via npm), custom synthwave theme
- **Hosting** — [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- **Deploy** — GitHub Actions on push to `main`

## Local development

### Prerequisites

```bash
npm install
```

### Build

```bash
npm run build
```

Produces `dist/` with `index.html`, `app.css`, and all assets.

### Preview locally

```bash
npm run dev
```

Serves the site at `http://localhost:8787` via Wrangler.

## Deploy

Push to `main` — GitHub Actions builds and deploys automatically via `cloudflare/wrangler-action`.

### Required GitHub secrets

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | CF API token with *Edit Cloudflare Workers* permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

## DNS cutover (one-time)

### Step 1 — Verify at workers.dev
After the first successful GitHub Actions deploy, check the site at:
```
https://oliflix-tv.<your-account-id>.workers.dev
```
Verify: all six cards render, icons load, hover effects work, looks correct on mobile.

### Step 2 — Add custom domain
Uncomment the `[[routes]]` block in `wrangler.toml`:
```toml
[[routes]]
pattern = "oliflix.tv"
custom_domain = true
```
Push to `main`. GitHub Actions will redeploy and CF will bind `oliflix.tv` to the Worker.
DNS propagation is near-instant (domain is already on Cloudflare).

### Step 3 — Pause Vercel
In the Vercel dashboard, **pause** (do not delete) the project.
Leave paused for 7 days as a rollback option, then delete.

### Rollback
Re-enable the Vercel project and remove the `[[routes]]` block from `wrangler.toml`.

---

## Project structure

```
src/
  index.html        # single page
  input.css         # Tailwind entry + synthwave theme
scripts/
  build.sh          # build pipeline
public/             # static assets (icons, favicon) — copied to dist/
dist/               # build output (gitignored)
.github/workflows/
  deploy.yml        # CI/CD
wrangler.toml       # Cloudflare Workers config
```
