import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import contentIndex from "../../../content/index.json";

export const metadata: Metadata = {
  title: "Learn with Me - Notes & Articles | Prem",
  description: "A collection of structured notes, deep dives, and articles on full-stack development, cloud, and databases.",
  alternates: {
    canonical: "https://www.premdeep.co.in/read-with-me",
  },
  openGraph: {
    type: "website",
    url: "https://www.premdeep.co.in/read-with-me",
    title: "Learn with Me - Notes & Articles | Prem",
    description: "A collection of structured notes, deep dives, and articles on full-stack development, cloud, and databases.",
    images: ["https://www.premdeep.co.in/og/read-with-me.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn with Me - Notes & Articles | Prem",
    description: "A collection of structured notes, deep dives, and articles on full-stack development, cloud, and databases.",
    images: ["https://www.premdeep.co.in/og/read-with-me.png"],
  },
};

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

interface ContentItem {
  title: string;
  slug: string;
  description: string;
  featured: boolean;
}

function getCustomOrderIndex(note: ContentItem) {
  const title = (note.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const slug = (note.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const checkTarget = (target: string) => {
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

function sortNotes(notesList: ContentItem[]) {
  return [...notesList].sort((a, b) => {
    const idxA = getCustomOrderIndex(a);
    const idxB = getCustomOrderIndex(b);
    if (idxA !== idxB) {
      return idxA - idxB;
    }
    return a.title.localeCompare(b.title);
  });
}

export default function ReadWithMe() {
  const notes = sortNotes((contentIndex?.notes || []) as ContentItem[]);
  const articles = (contentIndex?.articles || []) as ContentItem[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://www.premdeep.co.in/read-with-me#webpage",
        "url": "https://www.premdeep.co.in/read-with-me",
        "name": "Learn with Me - Notes & Articles | Prem",
        "description": "A collection of structured notes, deep dives, and articles on full-stack development, cloud, and databases."
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
          }
        ]
      }
    ]
  };

  return (
    <div className="pb-16 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Section */}
      <div className="mx-0 sm:mx-4 bg-brand-peach rounded-none text-brand-blue pt-30 pb-12 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Learn with Me
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-brand-blue/90 font-medium leading-relaxed">
            I learn by building, experimenting, and documenting what I discover along the way. This page is a collection of the notes and articles I create while exploring new technologies, concepts, and engineering practices. Everything here is written as part of my learning process, and I hope it helps others on theirs as well.
          </p>
        </div>
      </div>

      {/* Technical Notes Section */}
      <section id="notes" className="mx-0 sm:mx-4 bg-brand-blue rounded-none p-6 sm:p-8 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center pb-3 mb-8">
            <h2 className="text-xl font-semibold leading-snug text-brand-peach sm:text-2xl md:text-3xl lg:text-4xl text-center">
              Technical Notes
            </h2>
            <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-none text-brand-peach mt-2">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {notes.length === 0 ? (
            <p className="text-white/70 italic text-center py-6">No notes found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {notes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="group block bg-brand-peach rounded-none p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-[0_20px_40px_rgba(255,227,208,0.15)] min-h-[160px]"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight">
                        {note.title}
                      </h3>
                      {note.featured && (
                        <span className="shrink-0 text-[10px] font-extrabold bg-brand-blue text-brand-peach px-2 py-0.5 rounded-none uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-4">
                      {note.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Articles & Writings Section */}
      <section id="articles" className="mx-0 sm:mx-4 bg-brand-peach rounded-none p-6 sm:p-8 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center pb-3 mb-8">
            <h2 className="text-xl font-semibold leading-snug text-brand-blue sm:text-2xl md:text-3xl lg:text-4xl text-center">
              Articles & Writings
            </h2>
            <span className="text-xs font-semibold bg-brand-blue/10 px-3 py-1 rounded-none text-brand-blue mt-2">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {articles.length === 0 ? (
            <p className="text-brand-blue/70 italic text-center py-6">No articles found.</p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group block bg-brand-blue text-white rounded-none p-4 hover:translate-x-1.5 transition-all duration-300 shadow-md hover:shadow-[0_15px_30px_rgba(2,98,222,0.15)] border border-brand-peach/10"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-peach group-hover:text-white transition-colors leading-snug">
                      <span>{article.title}</span>
                      {article.featured && (
                        <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold bg-brand-peach text-brand-blue px-2 py-0.5 rounded-none uppercase tracking-wider align-middle -translate-y-0.5">
                          Featured
                        </span>
                      )}
                    </h3>
                    <p className="hidden sm:block text-white/80 text-sm leading-relaxed line-clamp-1">
                      {article.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
