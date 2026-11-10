# BLDDB Offline Desktop (Tauri)

This wraps the Next.js site in a Tauri shell after a static export, producing a **fully offline, serverless** Windows / macOS / Linux desktop app. All data (`public/data`) and translation resources (`public/locales`) are bundled into the installer, so the app needs **no network at runtime** and is unaffected by Vercel Hobby's CPU-hour limits.

## How it works

- **`next.config.js`**: with `STATIC_EXPORT=1` it sets `output: 'export'` + `images.unoptimized` and exports the site to `out/`. Without that flag (the normal Vercel `next build`) behavior is unchanged.
- **`src/i18n/server.ts`**: a static export has no request context, so during export `getLocale()` returns `FALLBACK_LOCALE` (currently `en`). At runtime the browser-side i18n (LanguageDetector + `changeLanguage`) selects the language from local cache / system locale, and the user can manually switch to `zh-CN` / `ja`.
- **`src-tauri/`**: the Tauri v2 desktop shell. `frontendDist: "../out"` points at the static export, rendered with the system's built-in WebView2. **No Chromium is bundled, so the installer is small.**

## Data sync (desktop only)

The desktop installer bundles a frozen snapshot of `public/data` taken at build time. But those data files (the algorithm database and the source/url mappings) are regenerated weekly by the web repo's `actions.yml` workflow, so the offline app needs a way to stay current.

- **Source**: on every page load, when running inside the Tauri shell and online, the app fetches the latest JSON from GitHub Raw (`raw.githubusercontent.com/nbwzx/blddb/v2/public/data/...`), caches it in **IndexedDB**, and falls back to the bundled snapshot when offline or on the first run. The web build (`isDesktop()` returns `false`) always uses its own freshly-served data and is **completely unaffected** by this logic.
- **Manual sync**: a **Sync** button appears in the header (desktop only). Click it to force an immediate refresh of all data files.
- **Automatic sync**: on startup the app refreshes the whole data set once if the last successful sync was more than 24 hours ago.
- **Custom source**: set `NEXT_PUBLIC_DATA_BASE` at build time to point at a different host (e.g. your own CDN). It defaults to the GitHub Raw `v2` branch of the `nbwzx/blddb` repo, which already carries `Access-Control-Allow-Origin: *` so the WebView can fetch it directly.
- The synced data set is defined in `src/utils/syncData.ts` (`SYNC_PATHS`). The static `.ts` tables under `public/data/nightmare/` are intentionally excluded (they are fixed reference tables, not weekly-updated).

## Prerequisites (install once)

- **Node.js** (>= 18) and npm
- **Rust toolchain**: https://rustup.rs (install stable)
- **Windows additionally needs**:
  - WebView2 (built into Win11; download the runtime for Win10)
  - VS 2022 "Desktop development with C++" workload, or standalone VS Build Tools
  - See https://tauri.app/start/prerequisites/

## Development (desktop window with hot reload)

```bash
npm install
npm run tauri dev      # starts next dev (3000) then opens the desktop window; frontend edits refresh live
```

## Build & release (produce installer)

```bash
npm install
npm run tauri build    # = STATIC_EXPORT=1 next build (export out/) + compile Rust + package installer
```

Output locations:

- Windows: `src-tauri/target/release/bundle/nsis/*.exe`
- macOS: `src-tauri/target/release/bundle/dmg/*.dmg`
- Linux: `src-tauri/target/release/bundle/deb/*.deb` (or appimage)

> To export the static site only (without compiling Rust): `npm run build:desktop` → produces `out/`.

## Custom icon

`src-tauri/icons/` already holds the official logo (copied from the v1 repo `D:\Documents\GitHub\blddb`), so no placeholder is used. To swap in a different logo in one step:

```bash
npx @tauri-apps/cli icon path/to/logo.png   # regenerates all sizes into src-tauri/icons/
```

## Automatic GitHub release (tag-driven)

`.github/workflows/release.yml` reproduces the v1 repo's behavior: **pushing a version tag automatically builds the desktop app on Windows / macOS / Linux and creates a GitHub Release with the installers attached.**

To ship a new desktop version:

1. Make sure the desktop version is bumped in both places and committed:
   - `src-tauri/tauri.conf.json` → `"version"`
   - `src-tauri/Cargo.toml` → `version`
   (Keep these equal to the `vX.Y.Z` tag you are about to push.)
2. Commit the Tauri changes (the whole `src-tauri/` tree, `next.config.js`, `src/i18n/server.ts`, `package.json`, `scripts/`, `DESKTOP_BUILD.md`) so the workflow can check them out.
3. Tag and push:

```bash
git tag v2.0.0
git push origin v2.0.0
```

4. GitHub Actions builds all three platforms and opens a **draft** release named `blddb v2.0.0` with the `.exe` / `.dmg` / `.deb` (and `.app.tar.gz` / AppImage) assets attached. Review it, then click **Publish** on the GitHub Releases page.

Notes:
- The trigger is `on.push.tags: ['v*']` (plus manual `workflow_dispatch`).
- `releaseDraft: true` means the release is created as a draft; set it to `false` in `release.yml` if you want publishing to happen fully automatically with no review step.
- macOS builds are **unsigned** in this workflow, so users may need to right-click → Open (or `xattr -cr`) to bypass Gatekeeper. Add Apple signing secrets to the workflow if you want notarized macOS builds.
- `src-tauri/Cargo.lock` is recommended for reproducible Rust builds: generate it locally with `cargo generate-lockfile` (inside `src-tauri/`) and commit it. The workflow still builds if it is missing (cargo regenerates it).

## Relationship to the Vercel build

All desktop-only logic is gated behind `process.env.STATIC_EXPORT === "1"`:

- Without that flag (normal Vercel `npm run build`) the behavior is **exactly the same** as before; this change has zero impact on the live site.
- The static export build skips TypeScript / ESLint checks (some files under `test/` still carry type errors from the latest commutator API and are unrelated to runtime); the normal Vercel build keeps those checks strict.
