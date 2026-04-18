#!/usr/bin/env bash
set -euo pipefail

# oliflix.tv build script
# Requires: npm install (installs @tailwindcss/cli + wrangler)

echo "→ Cleaning dist/"
rm -rf dist
mkdir -p dist

echo "→ Compiling CSS (Tailwind v4)"
./node_modules/.bin/tailwindcss -i src/input.css -o dist/app.css --minify

echo "→ Copying HTML"
cp src/index.html dist/index.html

echo "→ Copying public assets"
cp -r public/. dist/

echo "✓ Build complete — dist/ ready"
