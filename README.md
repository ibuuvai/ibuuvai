Development

- npm run dev — start local server
- npm run build — static export to build/ via adapter-static

Content

- Edit content in src/content/profile.ts, src/content/stories.ts, src/content/journal.ts
- Add a new story by pushing an object to stories[] with slug/title/tagline/acts

Routing

- Home uses query param ?room=me|stories|journal|cvv to open modal rooms
- Direct routes: /me, /stories, /stories/[slug], /journal, /cvv

Design tokens

- Colors: --bg #0b0810, --ink #f6f2f8, --rose #ff6ab9, --violet #8b7cff, --amber #ffc878
- Fonts: Space Grotesk 600 (headings), IBM Plex Mono (body), self-host woff2

Deploy (Railway)

- Build locally: npm run build → upload build/ as static or serve with a minimal static server
- Ensure canonical URL is https://ibuuvai.me/
