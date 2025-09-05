# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project summary
- SvelteKit v2 SPA (SSR disabled) built with Vite 6 and Tailwind CSS v4
- Static export via @sveltejs/adapter-static to build/
- Primary package manager: Bun (bun.lock present). GitHub Actions deploys to GitHub Pages.

Common commands
Use Bun (preferred). Alternatives for npm/pnpm are shown where relevant.
- Install dependencies
  - bun install
  - npm install or pnpm install
- Start dev server (Vite):
  - bun run dev
  - npm run dev or pnpm dev
- Type-check (Svelte + TS):
  - bun run check
  - bun run check:watch (continuous)
- Format / Lint (Prettier):
  - bun run format  # write
  - bun run lint    # check only
- Build (static export to build/):
  - bun run build
    - Notes: build includes copying CNAME to build/ for custom domain.
- Preview production build locally:
  - bun run preview
- SvelteKit project sync (when updating deps/kit):
  - bun run prepare
- Tests: none present in this repo.

Architecture overview
- Runtime and routing
  - SSR is disabled globally (src/routes/+layout.ts: export const ssr = false). The app is a single-page application; navigation within the home route is implemented as in-page tabs (about, stories, journal, book) rather than separate routes.
  - Static export is configured in svelte.config.js via @sveltejs/adapter-static with fallback: 'index.html'. Output dir: build/.
  - Template: src/app.html defines the base HTML head (icons, fonts, meta) and mounts %sveltekit.body%.
- Top-level layout and styling
  - src/routes/+layout.svelte imports global stylesheet (src/app.css) and renders children. It also defines global scrollbar styles.
  - Tailwind CSS v4 is integrated via @tailwindcss/vite (vite.config.ts). There is no tailwind.config.* file; Tailwind is configured in CSS using @import 'tailwindcss' and @layer blocks (see src/app.css).
  - Theme variables (colors, fonts, blur radii) are defined in :root within @layer theme, and custom utility classes (e.g., text-accent, bg-accent/10, custom scrollbar, animations) are declared under @layer utilities. These are used extensively in the page markup.
- Main page logic (src/routes/+page.svelte)
  - Uses Svelte 5 runes ($state, $derived, $effect) for state and reactivity.
  - Implements tabbed navigation, an animated hero section, and three content areas:
    - Stories: a collapsible featured story with transitions.
    - Journal: a list of entries; supports deep-linking via URL hash. On mount, if the hash matches an entry ID, it switches to the Journal tab and scrolls the entry into view.
    - Book: a multi-chapter reading view with top/bottom chapter navigation and a fixed, computed reading progress bar.
  - Interaction details:
    - IntersectionObserver wires up one-time reveal animations for elements marked with [data-reveal].
    - Mousemove updates CSS variables (--mx, --my, --cursor-x, --cursor-y) to drive parallax and a cursor aura; behavior respects prefers-reduced-motion.
    - Scroll/resize events update a derived reading progress fraction for the book view.
- Command palette (src/lib/components/CommandPalette.svelte)
  - Global keyboard shortcut: Cmd/Ctrl+K toggles an overlay.
  - Commands include tab navigation and opening specific journal entries. Filtering is client-side string matching; selection supports arrow keys and Enter.
- Tooling and configuration
  - svelte.config.js: adapter-static with pages/assets = build, fallback index.html, strict=true.
  - vite.config.ts: sveltekit() + tailwindcss() plugins.
  - tsconfig.json extends .svelte-kit/tsconfig.json, enables strict TS, bundler moduleResolution, allowJs/checkJs.
  - Prettier configured via .prettierrc (plugins: prettier-plugin-svelte, prettier-plugin-tailwindcss) and .prettierignore.

CI/CD and deployment
- .github/workflows/static.yml builds with Bun on pushes to main, runs bun install && bun run build, uploads build/ as the artifact, and deploys to GitHub Pages.
- A CNAME file at repo root is copied to build/ during the build step to preserve the custom domain.

Assets and static files
- Static assets are served from the static/ directory (e.g., static/favicon.png is referenced via %sveltekit.assets%).
- Code references images at /images/vai.webp and /images/ibuuvai.webp. Ensure these exist under static/images/ (i.e., static/images/vai.webp, static/images/ibuuvai.webp) for production builds.

Notes for future changes
- Because SSR is disabled, browser globals (window, document, IntersectionObserver, matchMedia) are safe in route components. If you later enable SSR, gate such usage with browser checks.
- Adding new pages: place route files under src/routes/. With the current SPA/tab model, consider whether additional routes or in-page tabs fit the UX better.

