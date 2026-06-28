import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import contentIndex from "../../content/index.json";
import MarkdownRenderer from "../components/MarkdownRenderer";
import TableOfContents from "../components/TableOfContents";
import NotFound from "./NotFound";

// Lazy load markdown modules in Vite
const noteModules = import.meta.glob("/content/notes/*.md", { query: "?raw", import: "default" });

function parseMarkdown(rawText) {
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

function NoteDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const notes = contentIndex?.notes || [];
  const currentNoteMeta = notes.find((n) => n.slug === slug);

  // Pagination: prev/next notes based on order
  const currentIndex = notes.findIndex((n) => n.slug === slug);
  const prevNote = currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null;
  const nextNote = currentIndex > 0 ? notes[currentIndex - 1] : null;

  useEffect(() => {
    async function loadMarkdown() {
      setLoading(true);
      setNotFound(false);
      
      const fileKey = `/content/notes/${slug}.md`;
      if (!noteModules[fileKey]) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const rawText = await noteModules[fileKey]();
        const { body } = parseMarkdown(rawText);
        setContent(body);
      } catch (err) {
        console.error("Error loading note markdown:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadMarkdown();
    // Scroll to top on page transition
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-4 flex items-center justify-center min-h-[400px] bg-brand-blue text-white rounded-b-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-peach mx-auto mb-4"></div>
          <p className="text-brand-peach font-semibold">Loading note...</p>
        </div>
      </div>
    );
  }

  if (notFound || !currentNoteMeta) {
    return <NotFound />;
  }

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mx-4 flex flex-col bg-brand-blue text-white min-h-screen">
      {/* Top Header Section */}
      <header className="bg-brand-peach text-brand-blue py-10 px-6 sm:px-10 rounded-b-2xl shadow-md mb-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex text-xs font-bold uppercase tracking-wider text-brand-blue/70 mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-blue-700">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <Link to="/read-with-me" className="hover:text-blue-700">Read with Me</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="text-brand-blue/40">Notes</span>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="truncate max-w-[150px] sm:max-w-xs">{currentNoteMeta.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl leading-tight">
            {currentNoteMeta.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            {currentNoteMeta.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-brand-blue/80 border-t border-brand-blue/15 pt-5">
            <div>
              LAST UPDATED: <span className="text-brand-blue">{formatDate(currentNoteMeta.lastUpdated)}</span>
            </div>
            <div className="hidden sm:block text-brand-blue/30">|</div>
            <div>
              READING TIME: <span className="text-brand-blue">{currentNoteMeta.readingTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">
          {/* Left Column: Sticky Table of Contents */}
          <aside className="hidden lg:block">
            <TableOfContents content={content} />
          </aside>

          {/* Right Column: Markdown Article Body */}
          <article className="bg-brand-peach text-slate-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-md">
            <MarkdownRenderer content={content} />
          </article>
        </div>
      </div>

      {/* Bottom Section: Previous/Next Navigation */}
      <footer className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/20 pt-8">
          {prevNote ? (
            <Link
              to={`/notes/${prevNote.slug}`}
              className="group block bg-brand-peach/10 hover:bg-brand-peach/15 rounded-xl p-5 border border-white/10 transition-colors text-left"
            >
              <span className="text-xs font-bold text-brand-peach/70 uppercase tracking-wider block mb-1">
                &larr; Previous Note
              </span>
              <span className="text-base font-bold text-white group-hover:text-brand-peach transition-colors leading-tight block">
                {prevNote.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextNote ? (
            <Link
              to={`/notes/${nextNote.slug}`}
              className="group block bg-brand-peach/10 hover:bg-brand-peach/15 rounded-xl p-5 border border-white/10 transition-colors text-right"
            >
              <span className="text-xs font-bold text-brand-peach/70 uppercase tracking-wider block mb-1">
                Next Note &rarr;
              </span>
              <span className="text-base font-bold text-white group-hover:text-brand-peach transition-colors leading-tight block">
                {nextNote.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </footer>
    </div>
  );
}

export default NoteDetail;
