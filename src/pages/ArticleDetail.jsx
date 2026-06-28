import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import contentIndex from "../../content/index.json";
import MarkdownRenderer from "../components/MarkdownRenderer";
import TableOfContents from "../components/TableOfContents";
import NotFound from "./NotFound";

// Lazy load markdown modules in Vite
const articleModules = import.meta.glob("/content/articles/*.md", { query: "?raw", import: "default" });

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

function ArticleDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const articles = contentIndex?.articles || [];
  const currentArticleMeta = articles.find((a) => a.slug === slug);

  // Pagination: prev/next articles based on order
  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;

  useEffect(() => {
    async function loadMarkdown() {
      setLoading(true);
      setNotFound(false);
      
      const fileKey = `/content/articles/${slug}.md`;
      if (!articleModules[fileKey]) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const rawText = await articleModules[fileKey]();
        const { body } = parseMarkdown(rawText);
        setContent(body);
      } catch (err) {
        console.error("Error loading article markdown:", err);
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
          <p className="text-brand-peach font-semibold">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !currentArticleMeta) {
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
                  <span className="text-brand-blue/40">Articles</span>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="truncate max-w-[150px] sm:max-w-xs">{currentArticleMeta.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl leading-tight">
            {currentArticleMeta.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            {currentArticleMeta.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-brand-blue/80 border-t border-brand-blue/15 pt-5">
            <div>
              PUBLISHED: <span className="text-brand-blue">{formatDate(currentArticleMeta.date)}</span>
            </div>
            <div className="hidden sm:block text-brand-blue/30">|</div>
            <div>
              READING TIME: <span className="text-brand-blue">{currentArticleMeta.readingTime}</span>
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
          {prevArticle ? (
            <Link
              to={`/articles/${prevArticle.slug}`}
              className="group block bg-brand-peach/10 hover:bg-brand-peach/15 rounded-xl p-5 border border-white/10 transition-colors text-left"
            >
              <span className="text-xs font-bold text-brand-peach/70 uppercase tracking-wider block mb-1">
                &larr; Previous Article
              </span>
              <span className="text-base font-bold text-white group-hover:text-brand-peach transition-colors leading-tight block">
                {prevArticle.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextArticle ? (
            <Link
              to={`/articles/${nextArticle.slug}`}
              className="group block bg-brand-peach/10 hover:bg-brand-peach/15 rounded-xl p-5 border border-white/10 transition-colors text-right"
            >
              <span className="text-xs font-bold text-brand-peach/70 uppercase tracking-wider block mb-1">
                Next Article &rarr;
              </span>
              <span className="text-base font-bold text-white group-hover:text-brand-peach transition-colors leading-tight block">
                {nextArticle.title}
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

export default ArticleDetail;
