#!/usr/bin/env bash
set -euo pipefail

# oliflix.tv build script
# Requires: Tailwind v4 standalone CLI binary on PATH or in repo root

TAILWIND_BIN="${TAILWIND_BIN:-./tailwindcss}"

# Locate tailwindcss binary
if ! command -v "$TAILWIND_BIN" &>/dev/null; then
  if [ -f "./tailwindcss" ]; then
    TAILWIND_BIN="./tailwindcss"
  else
    echo "Error: tailwindcss binary not found."
    echo "Download from: https://github.com/tailwindlabs/tailwindcss/releases/download/v4.2.2/tailwindcss-macos-arm64"
    echo "Make executable: chmod +x tailwindcss"
    exit 1
  fi
fi

echo "→ Cleaning dist/"
rm -rf dist
mkdir -p dist

echo "→ Compiling CSS (Tailwind v4)"
"$TAILWIND_BIN" -i src/input.css -o dist/app.css --minify

echo "→ Copying HTML"
cp src/index.html dist/index.html

echo "→ Copying public assets"
cp -r public/. dist/

echo "✓ Build complete — dist/ ready"
