# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

`node_modules/` may be absent in a fresh checkout. Run `npm install` before reading `node_modules/next/dist/docs/`.

## Commands

- `npm run dev`: dev server. It runs with `--webpack` on purpose, opting out of Turbopack, the Next 16 default.
- `npm run build` / `npm run start`
- `npm run lint`: ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript).
- `npm run sync`: pulls content from Notion. Needs `NOTION_TOKEN`, `NOTION_NOTES_PARENT_ID` and `NOTION_ARTICLES_PARENT_ID` in `.env`. It is incremental, using `content/.sync-cache.json` (gitignored). `npm run sync -- --force` ignores the cache.
- There is no test suite. Verify changes with `npm run lint` and `npm run build`.

Path alias: `@/*` → `src/*`.

## Architecture

This is a portfolio plus a notes and articles site at https://www.premdeep.co.in, built with Next.js 16 App Router, React 19 and Tailwind v4 and deployed on Vercel.

### Content pipeline (Notion → committed files)

Notion is the CMS, but neither the build nor the running app talks to Notion. You run `scripts/notion-sync.js` locally and commit what it writes:

- `content/{notes,articles}/<slug>.md`: markdown with front matter
- `content/index.json`: `{ notes, articles }` arrays of `{ title, slug, description, featured }`
- `public/content-images/{notes,articles}/<slug>-N.<ext>`: images downloaded from Notion, with the markdown URLs rewritten to these local paths

Vercel runs only `next build`, so content changes go live only after they are committed.

**`content/index.json` is the source of truth.** `/notes/[slug]` and `/articles/[slug]` look the slug up in the index first and return 404 if it is missing, even when the `.md` file exists. Titles and descriptions on pages, in metadata and on OG images come from the index, not the markdown front matter. If you add or edit content by hand, update `index.json` as well. Every sync regenerates `index.json` from Notion.

Sync details:
- A slug comes from the Notion `slug`/`Slug` property, or from the slugified title.
- A missing description falls back to the first paragraph.
- Pages removed from Notion, or whose slug changed, have their old `.md` file and images deleted.
- A parent ID can be a data source, a page that contains an inline database, or a page of child pages. The script tries each in that order.

### Routes

- `src/app/page.tsx`: the home page, made from the section components `src/components/*Div.tsx`. The projects list comes from `src/data/projects.ts`.
- `src/app/read-with-me/page.tsx`: lists all notes and articles.
- `src/app/{notes,articles}/[slug]/page.tsx`: reads markdown from `content/` with `fs` + `gray-matter`. There is no `generateStaticParams`. Each page renders `MarkdownRenderer`, `DocumentOutline` (floating heading nav) and prev/next links in index order.
- `src/app/og/`: OG images from `next/og` `ImageResponse` route handlers on the Node runtime.
  - `[category]/route.tsx` serves `/og/home.png` and `/og/read-with-me.png`.
  - `[category]/[slug]/route.tsx` serves `/og/{notes|articles}/<slug>.png`.
  - `og-generator.tsx` holds the shared card. It reads Outfit fonts from `node_modules/@fontsource/outfit` and the avatar from `src/assets/images/image.png`.
- `src/app/sitemap.ts`: built from `content/index.json`.

Each page defines its own JSON-LD and OG/Twitter metadata. The domain `https://www.premdeep.co.in` is hard-coded throughout.

### Markdown rendering

`src/components/MarkdownRenderer.tsx` is a client component built on react-markdown + remark-gfm. It highlights code with highlight.js, and fenced ` ```mermaid ` blocks render client-side through mermaid, themed with the brand colors.

### Duplicated logic that must stay in sync

- **Heading IDs**: `renderHeading` in `MarkdownRenderer.tsx` and `src/utils/parseHeadings.ts` (used by `DocumentOutline`) slug headings separately. If the two drift, outline links break.
- **Note ordering**: `CUSTOM_ORDER_KEYS` / `getCustomOrderIndex` is copied into `scripts/notion-sync.js`, `src/app/read-with-me/page.tsx` and `src/app/notes/[slug]/page.tsx`. The pages re-sort when they render, so the two page copies decide what users see. The sync script's copy has no `docker` entry.

### Styling

Tailwind v4 is configured CSS-first in `src/app/globals.css` under `@theme`. There is no `tailwind.config`. Brand tokens are `brand-blue` (#0262de), `brand-peach` (#ffe3d0) and `spacing-30`. The visual style alternates blue and peach blocks with sharp corners (`rounded-none` everywhere). The Outfit font loads through `next/font/google` as `--font-outfit`.

`@vercel/analytics` is always on. Google Analytics loads only in production when `NEXT_PUBLIC_GA_ID` is set.

### Leftovers from the earlier Vite site

- `dist/`: the old Vite build output. It is gitignored and ESLint ignores it.
- `scripts/generate-og-images.js` and `scripts/generate-sitemap.js`: no npm script runs them, and `src/app/og/` and `src/app/sitemap.ts` replace them. The OG script imports `satori` / `@resvg/resvg-js`, which are not in `package.json`.
- `public/sitemap.xml`: a static sitemap that sits alongside `src/app/sitemap.ts`.
- `src/components/TableOfContents.tsx`: unused, because pages render `DocumentOutline`.
- The README says images go to `public/images/notion/`. That is out of date: the sync writes them to `public/content-images/`.
