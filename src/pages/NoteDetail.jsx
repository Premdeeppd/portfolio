import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import contentIndex from "../../content/index.json";
import MarkdownRenderer from "../components/MarkdownRenderer";
import DocumentOutline from "../components/DocumentOutline";
import NotFound from "./NotFound";
import authorImg from "../assets/images/image.png";


// Eager load markdown modules for SSG pre-rendering
const noteModules = import.meta.glob("/content/notes/*.md", { query: "?raw", import: "default", eager: true });

function parseMarkdown(rawText) {
  if (!rawText) return { metadata: {}, body: "" };
  const match = rawText.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { metadata: {}, body: rawText };
  const [, yamlText, body] = match;
  const metadata = {};
  yamlText.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(":").trim().replace(/^['"]|['"]$/g, "");
      metadata[key] = val;
    }
  });
  return { metadata, body };
}

const CUSTOM_ORDER_KEYS = [
  "git",
  "javascript",
  "typescript",
  "node",
  "express",
  "jwt",
  "react",
  "recoil",
  "next",
  "mongodb",
  "sql",
  "postgresql",
  "prisma",
  "docker",
  "aws"
];

function getCustomOrderIndex(note) {
  const title = (note.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const slug = (note.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const checkTarget = (target) => {
    if (target.includes("github") || target.includes("git")) return "git";
    if (target.includes("javascript")) return "javascript";
    if (target.includes("typescript")) return "typescript";
    if (target.includes("nodejs") || target.includes("node")) return "node";
    if (target.includes("express")) return "express";
    if (target.includes("jwt") || target.includes("jsonwebtoken") || target.includes("token")) return "jwt";
    if (target.includes("react")) return "react";
    if (target.includes("recoil")) return "recoil";
    if (target.includes("nextjs") || target.includes("next")) return "next";
    if (target.includes("mongodb") || target.includes("mongo")) return "mongodb";
    if (target.includes("postgresql") || target.includes("postgres")) return "postgresql";
    if (target.includes("sql")) return "sql";
    if (target.includes("prisma")) return "prisma";
    if (target.includes("docker")) return "docker";
    if (target.includes("aws")) return "aws";
    return null;
  };

  const key = checkTarget(title) || checkTarget(slug);
  if (!key) return Infinity;
  
  const index = CUSTOM_ORDER_KEYS.indexOf(key);
  return index === -1 ? Infinity : index;
}

function sortNotes(notesList) {
  return [...notesList].sort((a, b) => {
    const idxA = getCustomOrderIndex(a);
    const idxB = getCustomOrderIndex(b);
    if (idxA !== idxB) {
      return idxA - idxB;
    }
    return a.title.localeCompare(b.title);
  });
}

function NoteDetail() {
  const { slug } = useParams();

  const notes = sortNotes(contentIndex?.notes || []);
  const currentNoteMeta = notes.find((n) => n.slug === slug);

  // Synchronous initial markdown load for SSG pre-rendering
  const fileKey = `/content/notes/${slug}.md`;
  const rawText = noteModules[fileKey] || "";
  const initialBody = parseMarkdown(rawText).body;

  const [content, setContent] = useState(initialBody);
  const [loading, setLoading] = useState(!rawText);
  const [notFound, setNotFound] = useState(!currentNoteMeta || !rawText);

  // Pagination: prev/next notes based on order
  const currentIndex = notes.findIndex((n) => n.slug === slug);
  const prevNote = currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null;
  const nextNote = currentIndex > 0 ? notes[currentIndex - 1] : null;

  useEffect(() => {
    const key = `/content/notes/${slug}.md`;
    if (noteModules[key]) {
      const { body } = parseMarkdown(noteModules[key]);
      setContent(body);
      setNotFound(false);
      setLoading(false);
    } else {
      setNotFound(true);
      setLoading(false);
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-0 sm:mx-4 flex items-center justify-center min-h-[400px] bg-brand-blue text-white rounded-none">
        <div className="text-center">
          <div className="animate-spin rounded-none h-10 w-10 border-t-2 border-b-2 border-brand-peach mx-auto mb-4"></div>
          <p className="text-brand-peach font-semibold">Loading note...</p>
        </div>
      </div>
    );
  }

  if (notFound || !currentNoteMeta) {
    return <NotFound />;
  }

  const ogImageUrl = `https://www.premdeep.co.in/og/notes/${slug}.png`;

  const noteUrl = `https://www.premdeep.co.in/notes/${slug}`;

  return (
    <div className="flex flex-col bg-brand-blue text-white min-h-screen">
      <Head>
        <title>{currentNoteMeta.title} | Prem</title>
        <meta name="description" content={currentNoteMeta.description} />
        <meta name="author" content="Prem Deep" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={noteUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={noteUrl} />
        <meta property="og:title" content={`${currentNoteMeta.title} | Prem`} />
        <meta property="og:description" content={currentNoteMeta.description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${currentNoteMeta.title} | Prem`} />
        <meta name="twitter:description" content={currentNoteMeta.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "TechArticle",
                "@id": `${noteUrl}#article`,
                "headline": currentNoteMeta.title,
                "description": currentNoteMeta.description,
                "url": noteUrl,
                "image": ogImageUrl,
                "author": {
                  "@type": "Person",
                  "name": "Prem Deep",
                  "url": "https://www.premdeep.co.in"
                },
                "publisher": {
                  "@type": "Person",
                  "name": "Prem Deep",
                  "url": "https://www.premdeep.co.in"
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": noteUrl
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.premdeep.co.in/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Learn with Me",
                    "item": "https://www.premdeep.co.in/read-with-me"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": currentNoteMeta.title,
                    "item": noteUrl
                  }
                ]
              }
            ]
          })}
        </script>
      </Head>
      <DocumentOutline content={content} />

      {/* Unified Brand Peach Block */}
      <div className="mx-0 sm:mx-4 mb-16 bg-brand-peach text-slate-800 rounded-none shadow-md flex-grow flex flex-col">
        {/* Top Header Section */}
        <header className="pt-30 pb-10 px-6 sm:px-10 text-brand-blue">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex text-xs font-bold uppercase tracking-wider text-brand-blue/70 mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-1 md:gap-x-2 gap-y-1.5 list-none p-0 m-0">
                <li className="inline-flex items-center">
                  <Link to="/read-with-me" className="hover:text-blue-700 whitespace-nowrap">Learn with Me</Link>
                </li>
                <li className="inline-flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="whitespace-nowrap">Notes</span>
                </li>
                <li aria-current="page" className="inline-flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="truncate max-w-[150px] sm:max-w-xs whitespace-nowrap">{currentNoteMeta.title}</span>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl leading-tight text-brand-blue">
              {currentNoteMeta.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              {currentNoteMeta.description}
            </p>

            {/* Author Profile */}
            <div className="mt-6 flex items-center gap-4">
              <img
                src={authorImg}
                alt="Prem Deep"
                className="w-12 h-12 object-cover border border-brand-blue"
              />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-brand-blue">Prem Deep</span>
                <span className="text-xs font-semibold text-slate-600">ROXC | Turing | IIT Roorkee</span>
              </div>
            </div>
          </div>
        </header>

        {/* Thick Divider */}
        <div className="max-w-4xl mx-auto w-full px-6 sm:px-10">
          <hr className="border-t-[3px] border-brand-blue" />
        </div>

        {/* Main Content Layout */}
        <div className="py-10 px-6 sm:px-10 flex-grow">
          <div className="max-w-4xl mx-auto">
            <MarkdownRenderer content={content} />
          </div>
        </div>

        {/* Thick Divider */}
        <div className="max-w-4xl mx-auto w-full px-6 sm:px-10">
          <hr className="border-t-[3px] border-brand-blue" />
        </div>

        {/* Bottom Section: Previous/Next Navigation */}
        <footer className="py-10 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevNote ? (
              <Link
                to={`/notes/${prevNote.slug}`}
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-none p-5 border border-brand-blue/10 transition-colors text-left"
              >
                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider block mb-1">
                  &larr; Previous Note
                </span>
                <span className="text-base font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight block">
                  {prevNote.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextNote ? (
              <Link
                to={`/notes/${nextNote.slug}`}
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-none p-5 border border-brand-blue/10 transition-colors text-right"
              >
                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider block mb-1">
                  Next Note &rarr;
                </span>
                <span className="text-base font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight block">
                  {nextNote.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default NoteDetail;
