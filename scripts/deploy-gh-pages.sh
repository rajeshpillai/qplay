#!/bin/bash
# Deploy to GitHub Pages
# Usage: ./scripts/deploy-gh-pages.sh

set -e

REPO="https://github.com/rajeshpillai/qplay.git"
DIST_DIR="dist/public"

echo "=== Building static site for GitHub Pages ==="
npx vite build --config vite.gh-pages.config.ts

echo "=== Preparing deployment ==="
cd "$DIST_DIR"

# GitHub Pages SPA hack: copy index.html to 404.html
# so client-side routing works for all paths
cp index.html 404.html

# Add .nojekyll to prevent GitHub from processing with Jekyll
touch .nojekyll

git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy to GitHub Pages"

echo "=== Pushing to gh-pages branch ==="
git push -f "$REPO" gh-pages

cd ../..
rm -rf "$DIST_DIR/.git"

echo ""
echo "=== Deployed! ==="
echo "1. Go to https://github.com/rajeshpillai/qplay/settings/pages"
echo "2. Set Source: Deploy from a branch → gh-pages → / (root)"
echo "3. Site will be live at: https://rajeshpillai.github.io/qplay/"
