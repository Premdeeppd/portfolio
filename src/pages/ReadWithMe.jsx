import React from "react";
import { Link } from "react-router-dom";
import contentIndex from "../../content/index.json";

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

function ReadWithMe() {
  const notes = sortNotes(contentIndex?.notes || []);
  const articles = contentIndex?.articles || [];



  return (
    <div className="pb-16 space-y-8">
      {/* Header Section */}
      <div className="mx-0 sm:mx-4 bg-brand-peach rounded-none text-brand-blue pt-30 pb-12 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Learn with Me
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-brand-blue/90 font-medium leading-relaxed">
            Welcome to my personal knowledge base. Here I share quick reference notes and long-form articles about technology, learning paths, and system design.
          </p>
        </div>
      </div>

      {/* Technical Notes Section (fuses with blue background, no border, no shadow) */}
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
                  to={`/notes/${note.slug}`}
                  className="group block bg-brand-peach rounded-none p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-[0_20px_40px_rgba(255,227,208,0.15)] min-h-[160px]"
                >
                  <div>
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

      {/* Articles & Writings Section (no shadow) */}
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
                  to={`/articles/${article.slug}`}
                  className="group block bg-brand-blue text-white rounded-none p-4 hover:translate-x-1.5 transition-all duration-300 shadow-md hover:shadow-[0_15px_30px_rgba(2,98,222,0.15)] border border-brand-peach/10"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-brand-peach group-hover:text-white transition-colors leading-tight">
                        {article.title}
                      </h3>
                      {article.featured && (
                        <span className="shrink-0 text-[10px] font-extrabold bg-brand-peach text-brand-blue px-2 py-0.5 rounded-none uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
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

export default ReadWithMe;
