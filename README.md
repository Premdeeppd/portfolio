# Prem Deep — Developer Portfolio & Technical Publishing Hub

Personal developer portfolio, technical notes database, and article publishing platform built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Notion CMS integration**.

Live Site: [premdeep.co.in](https://www.premdeep.co.in)

---

## Architecture & Data Flow

Content is authored directly in Notion databases and synchronized into local Markdown & JSON files during build time or via script automation.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                          Notion CMS Workspace                            │
│    [Notion Articles Database]        [Notion Notes Database]             │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ (Notion API Token)
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          Sync & Build Engine                             │
│  • scripts/notion-sync.js (Incremental Cache: .sync-cache.json)          │
│  ├── content/articles/ & content/notes/ (*.md)                           │
│  └── public/images/notion/ (Downloaded Assets)                           │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        Next.js 16 App Router                             │
│  ├── src/app/page.tsx                                                    │
│  ├── src/app/read-with-me/page.tsx                                       │
│  ├── src/app/articles/[slug]/page.tsx                                    │
│  ├── src/app/notes/[slug]/page.tsx                                       │
│  └── src/components/MarkdownRenderer.tsx                                │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           Vercel Platform                                │
│  • Vercel Edge Network                                                   │
│  • @vercel/analytics                                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

- **Automated Notion CMS Sync**: Custom incremental sync engine (`scripts/notion-sync.js`) converts Notion blocks into clean Markdown and downloads referenced images locally.
- **Modern Tech Stack**: Powered by Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.
- **Rich Markdown Engine**: Integrated support for code syntax highlighting (`highlight.js`), Mermaid diagrams, custom table of contents (`DocumentOutline.tsx`), and GFM tables (`remark-gfm`).
- **Interactive Portfolio UI**: Project showcases (`src/data/projects.ts`), animated skills matrix (`SkillDiv.tsx`), learning logs (`LearnWithMeDiv.tsx`), and social links.
- **SEO & OpenGraph Optimization**: Structured JSON-LD schema markup (`schema.org`), dynamic sitemap generator (`sitemap.ts`), and dynamic OpenGraph image generator.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework & Core** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Fonts** | [Tailwind CSS v4](https://tailwindcss.com/), `@fontsource/outfit` |
| **CMS & Content Engine** | [Notion API SDK](https://github.com/matsuikou/notion-to-md) (`@notionhq/client`), `notion-to-md`, `gray-matter` |
| **Markdown Rendering** | `react-markdown`, `remark-gfm`, `highlight.js`, `mermaid` |
| **Analytics & Deployment** | [Vercel](https://vercel.com/), `@vercel/analytics` |

---

## NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Builds the application for production deployment. |
| `npm run start` | Launches the built production server locally. |
| `npm run sync` | Runs `scripts/notion-sync.js` to sync content from Notion. |
| `npm run lint` | Executes ESLint to check for code quality issues. |

---

## Notion CMS Integration Guide

To connect your own Notion databases:

1. Create a Notion Integration at [notion.so/my-integrations](https://www.notion.so/my-integrations) and copy the Secret Token to `NOTION_TOKEN`.
2. Create Notion databases for **Articles** and **Notes**, and share both databases with your integration connection.
3. Set `NOTION_ARTICLES_PARENT_ID` and `NOTION_NOTES_PARENT_ID` to your respective Notion database IDs (found in the database page URL).
4. Run `npm run sync` to populate `content/articles` and `content/notes`.
