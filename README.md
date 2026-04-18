# oliflix.tv

Personal media hub — a single-page synthwave landing page linking to the oliflix.tv self-hosted services (Plex, Seerr, Radarr, Sonarr, NZBGet, Tautulli).

## Stack

- **HTML** — hand-written `src/index.html`
- **CSS** — [Tailwind CSS v4](https://tailwindcss.com) standalone CLI, custom synthwave theme
- **Hosting** — [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- **Deploy** — GitHub Actions on push to `main`

## Local development

### Prerequisites

Download the Tailwind v4 standalone CLI (macOS arm64):

```bash
curl -sLo tailwindcss https://github.com/tailwindlabs/tailwindcss/releases/download/v4.2.2/tailwindcss-macos-arm64
chmod +x tailwindcss
```

Or macOS x64:

```bash
curl -sLo tailwindcss https://github.com/tailwindlabs/tailwindcss/releases/download/v4.2.2/tailwindcss-macos-x64
chmod +x tailwindcss
```

Place the binary in the repo root (it is gitignored) or on your `$PATH`.

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
