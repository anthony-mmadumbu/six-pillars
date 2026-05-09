# Six Pillars — Habit Tracker PWA

A daily habit tracker built as a Progressive Web App. Designed for installation on iPhone home screens via "Add to Home Screen" in Safari.

## Files in this package

- `index.html` — The full app (React + Babel standalone, no build step)
- `manifest.json` — PWA metadata for home screen install
- `sw.js` — Service worker for offline support
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png` — App icons

## Hosting

This is a static site that is hosted at any static host like GitHub Pages, but can be moved to Netlify, Cloudflare Pages, Vercel, etc.

## Data storage

All data is stored in the browser's `localStorage`. Data persists across sessions and survives the device being restarted, but is lost if you clear the browser cache, website data or uninstall the home-screen app.

There is an in-app Export/Import feature to keep backups of data input in the app.

## Updating

When you push changes:
1. Bump the `CACHE_NAME` in `sw.js` (e.g. `six-pillars-v1` → `six-pillars-v2`)
2. The service worker will detect the new version on the next load and clear the old cache

## Tech

- React 18 (UMD build, loaded from unpkg CDN)
- Babel Standalone (in-browser JSX transpilation)
- No build step, no npm, no bundler
- ~67 KB index.html, plus React/Babel from CDN (cached by service worker after first load)
