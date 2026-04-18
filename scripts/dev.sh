#!/usr/bin/env bash
set -euo pipefail

# oliflix.tv dev script
# Requires: npm install (installs @tailwindcss/cli + wrangler)
# Starts Tailwind in watch mode and wrangler dev concurrently.
# Ctrl-C cleanly kills all background processes.

trap 'kill 0' EXIT

echo "→ Ensuring dist/ exists"
mkdir -p dist

echo "→ Copying HTML"
cp src/index.html dist/index.html

echo "→ Copying public assets"
cp -r public/. dist/

echo "→ Starting Tailwind watch (src/input.css → dist/app.css)"
./node_modules/.bin/tailwindcss -i src/input.css -o dist/app.css --watch &

# Poll for HTML changes and sync to dist/
(
  while true; do
    sleep 1
    if [ src/index.html -nt dist/index.html ]; then
      cp src/index.html dist/index.html
      echo "↺ Synced src/index.html → dist/index.html"
    fi
  done
) &

echo "→ Starting wrangler dev"
./node_modules/.bin/wrangler dev
