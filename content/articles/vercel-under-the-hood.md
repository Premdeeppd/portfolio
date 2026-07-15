---
title: "
Vercel Under the Hood: Why Framework Auto-Detection Breaks Production Apps"
slug: "vercel-under-the-hood"
description: "A technical deep dive into Vercel's request pipeline, vercel.json configurations, and fixing silent build overrides, page refresh 404s, and broken social cards."
featured: true
---


Deploying a modern frontend web application to Vercel is often advertised as zero-config: push to GitHub, and Vercel handles the rest. But when custom build pipelines, pre-rendering, or single-page application (SPA) routing enters the picture, edge cases quickly emerge.


You might encounter two notoriously frustrating issues:
1. **The 404 Page Refresh Error**: Navigating through your site works smoothly via client-side routing, but hitting browser refresh on deep links triggers Vercel’s default `404: NOT_FOUND` page.
2. **Blank Social Preview (OG) Cards**: Your site looks complete in the browser, but previewing shared links on platforms like X (Twitter), LinkedIn, or OpenGraph debuggers reveals empty metadata and blank preview cards.


This guide explores **how Vercel processes deployments and requests under the hood**, demystifies the **`vercel.json`** configuration file, and breaks down the exact mechanics behind these deployment issues.


# 1. What is `vercel.json` and How Does Vercel Use It?


The `vercel.json` file is a configuration file placed at the root of your project. It acts as an explicit set of instructions to override or extend Vercel’s default deployment, build, and routing behaviors.


## When does Vercel read `vercel.json`?

1. **At Build & Package Time**: When Vercel receives a build trigger (via git push or CLI), it inspects `vercel.json` to determine:
    - What command to execute (`buildCommand`)
    - Which directory holds the compiled static files (`outputDirectory`)
    - What framework preset settings to apply (`framework`)
2. **At Edge Request Time**: When HTTP requests hit Vercel’s Global Edge Network, Vercel evaluates rules defined in `vercel.json` (such as `rewrites`, `redirects`, `headers`, and `cleanUrls`) to determine how to route each request.

# 2. Vercel’s Internal Request Resolution Pipeline


To fix routing issues or prevent unexpected 404s, you must understand the exact sequence Vercel follows when a user or web crawler requests a URL (e.g., `GET /blog/getting-started`).


```plain text
Incoming Request: GET /blog/getting-started
    │
    ▼
┌─────────────────────────┐
│  1. Filesystem Lookup   │  Check static output directory (e.g., dist/)
│                         │  • /blog/getting-started
│                         │  • /blog/getting-started.html
│                         │  • /blog/getting-started/index.html
└────────────┬────────────┘
             │ (If matching physical file exists → Serve immediately)
             │ (If NO file exists)
             ▼
┌─────────────────────────┐
│  2. Evaluation Rules    │  Evaluate "rewrites" in vercel.json sequentially.
│                         │  First matching rule modifies request destination.
└────────────┬────────────┘
             │ (If no rewrite matches OR destination file missing)
             ▼
┌─────────────────────────┐
│  3. 404 Handler         │  Return default 404 NOT_FOUND page
└─────────────────────────┘
```


## Key Rules of the Pipeline

- **Filesystem First**: Vercel always checks your output directory for a physical file **before** evaluating `rewrites` or `redirects`. If a file exists at the path (e.g., static assets, pre-rendered HTML files, images), it is served directly.
- **First Matching Rewrite Wins**: If a path triggers a match in the `rewrites` array, Vercel executes that rewrite. If the destination target doesn’t exist, it does not fallback down the chain by default.

# 3. Demystifying the Issues & Architecture Traps


## Issue A: Page Refresh 404s (The SPA Routing Trap)


### The Cause


In a Single-Page Application (React, Vue), page transitions happen client-side using JavaScript history APIs. When a user lands directly on a sub-route or refreshes `/blog/getting-started`, the browser requests that path directly from Vercel’s server.


If your build output does not contain a pre-rendered static `index.html` file inside `/blog/getting-started/`, Vercel attempts a filesystem lookup, fails, and returns a `404: NOT_FOUND`.


### The Catch-All Solution (and Regex Pitfalls)


To support client-side routing, non-existent file paths must fall back to the root `/index.html` so the client-side router can handle the URL.


A common pitfall is over-engineering the catch-all rule with regexes trying to exclude static assets or specific directories:


```json
/* AVOID: Over-complicated and fragile catch-all */
{
  "rewrites": [
    {
      "source": "/((?!assets|images|.*\\\\.).*)",
      "destination": "/index.html"
    }
  ]
}
```


**Why this fails:**
1. **Unnecessary Exclusions**: Because Vercel does a filesystem check **first**, static files (like `/assets/app.js` or `/images/hero.png`) will **always** be served from the filesystem directly and will **never** trigger the rewrite rule.
2. **JSON Regex Escaping Trap**: Writing regular expressions inside JSON requires escaping backslashes. Standard regex `\.` must be written as `\\\\.` in JSON strings to parse properly. Misinterpreting this can cause silent failure where valid routes bypass fallback handling completely.


### The Elegant Fix


A clean, universal catch-all rule is all that’s required:


```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```


Since physical assets and pre-rendered pages match in Step 1 (Filesystem Check), only unhandled client-side paths fall through to Step 2 and serve `/index.html`.


## Issue B: Blank Social Cards & Silent Framework Overrides


### The Cause


Social media platforms (X/Twitter, LinkedIn, Discord, OpenGraph debuggers) scrape your pages using simple HTTP clients that **do not execute JavaScript**.


If your server returns an unrendered shell like:


```html
<div id="root"></div>
```


The social crawler sees zero meta tags, zero OpenGraph properties, and renders a blank preview card.


Even if you configure pre-rendering or custom build tools in your `package.json`:


```json
"scripts": {
  "build": "node custom-generator.js && vite build --custom-ssg"
}
```


Vercel’s **Framework Auto-Detection** feature might silently override your build settings.


When Vercel detects a standard framework file (like `vite.config.js`), its build system automatically injects default framework presets, executing standard commands like `vite build` instead of running your explicit `npm run build` script.


### How to Diagnose Silent Overrides


Run a quick diagnostic via terminal using `curl`:


```bash
# Check raw server response for OpenGraph tags
curl -s https://yourdomain.com/blog/getting-started | grep "og:image"
```


If `curl` returns nothing, your server is returning an unrendered client-side shell.


You can also inspect compiled bundle names in `curl` output:
- Standard Vite build default entry: `index-[hash].js`
- Custom pre-rendered or SSG bundle entry: `app-[hash].js` (or custom script outputs)


# 4. The Production-Grade `vercel.json` Solution


To guarantee that Vercel respects your exact build pipeline, bypasses incorrect framework presets, and routes all SPA client-side requests correctly, use the following configuration in your project root:


```json
{
  "buildCommand": "npm run build",
  "framework": null,
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```


## Breakdown of the Configuration


| Property          | Value                                                     | Purpose                                                                                                                    |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `buildCommand`    | `"npm run build"`                                         | Explicitly overrides any default Vercel build command, forcing Vercel to execute the exact build script in `package.json`. |
| `framework`       | `null`                                                    | **Disables framework auto-detection**. Prevents Vercel from applying default framework build overrides.                    |
| `outputDirectory` | `"dist"`                                                  | Explicitly specifies where compiled static assets, pre-rendered HTML, and public media are output.                         |
| `rewrites`        | `[ { "source": "/(.*)", "destination": "/index.html" } ]` | Catch-all fallback routing for single-page applications. Sends non-filesystem paths to the root `/index.html`.             |

> **Dashboard Note**: If your Vercel Project Settings in the web UI explicitly force a specific framework preset (e.g. “Vite”), navigate to **Project Settings → General → Framework Preset** and switch it to **“Other”** to let `vercel.json` take full priority.

# 5. Summary Checklist for Vercel Deployments

1. **Understand Filesystem First**: Physical files in your output directory take precedence over all rewrite rules in `vercel.json`.
2. **Keep Rewrites Simple**: Use `"source": "/(.*)"` to map SPA routes to `/index.html` without convoluted regex lookaheads.
3. **Control Your Build**: Explicitly set `"framework": null` and `"buildCommand": "npm run build"` when using custom build pipelines or pre-rendering scripts to avoid silent framework overrides.
4. **Inspect with** **`curl`**: Always verify pre-rendered HTML and OpenGraph tags using command-line tools that ignore JavaScript execution.
