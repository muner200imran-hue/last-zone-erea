# Project Architecture

- Keep the website's pages as the original static HTML files in public/ (home page served from root index.html by src/routes/index.tsx) because the content is plain HTML, not React.
- Run server-side logic (the AI chat) in TanStack Start server routes under src/routes/api/public/ because the platform blocks Edge Functions for this project.
- The chat bubble is a plain script (public/chat-widget.js) loaded by last-zone.js so it appears on every static page without editing each file.
- Chat history is keyed by a random per-browser conversation id and is only accessed server-side; the chat_messages table has no public access policies.
- Serve downloadable release archives through Lovable Assets so large binaries stay outside the repository.
- Translated pages are static copies under public/pt, public/es and public/ar, linked by hreflang tags, because the site is plain HTML with no translation system.
- Unknown paths go through the catch-all server route src/routes/$.ts: old addresses 301 to the closest page (map in that file), extension-less paths 301 to their .html file, everything else returns a real 404 — so Google never sees old links as soft-404 copies of the home page. Regenerate src/lib/static-pages.ts when pages in public/ are added or removed.
