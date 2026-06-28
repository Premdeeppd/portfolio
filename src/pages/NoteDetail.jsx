import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import contentIndex from "../../content/index.json";
import MarkdownRenderer from "../components/MarkdownRenderer";
import DocumentOutline from "../components/DocumentOutline";
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



  return (
    <div className="flex flex-col bg-brand-blue text-white min-h-screen">
      <DocumentOutline content={content} />

      {/* Unified Brand Peach Block */}
      <div className="mx-4 mb-16 bg-brand-peach text-slate-800 rounded-2xl shadow-md flex-grow flex flex-col">
        {/* Top Header Section */}
        <header className="pt-30 pb-10 px-6 sm:px-10 text-brand-blue">
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

            <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl leading-tight text-brand-blue">
              {currentNoteMeta.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              {currentNoteMeta.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-brand-blue/80">
              <div>
                READING TIME: <span className="text-brand-blue">{currentNoteMeta.readingTime}</span>
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
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-xl p-5 border border-brand-blue/10 transition-colors text-left"
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
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-xl p-5 border border-brand-blue/10 transition-colors text-right"
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
