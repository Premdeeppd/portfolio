import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import contentIndex from "../../content/index.json";
import MarkdownRenderer from "../components/MarkdownRenderer";
import DocumentOutline from "../components/DocumentOutline";
import NotFound from "./NotFound";
import authorImg from "../assets/images/image.png";


// Eager load markdown modules for SSG pre-rendering
const articleModules = import.meta.glob("/content/articles/*.md", { query: "?raw", import: "default", eager: true });

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

function ArticleDetail() {
  const { slug } = useParams();

  const articles = contentIndex?.articles || [];
  const currentArticleMeta = articles.find((a) => a.slug === slug);

  // Synchronous initial markdown load for SSG pre-rendering
  const fileKey = `/content/articles/${slug}.md`;
  const rawText = articleModules[fileKey] || "";
  const initialBody = parseMarkdown(rawText).body;

  const [content, setContent] = useState(initialBody);
  const [loading, setLoading] = useState(!rawText);
  const [notFound, setNotFound] = useState(!currentArticleMeta || !rawText);

  // Pagination: prev/next articles based on order
  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;

  useEffect(() => {
    const key = `/content/articles/${slug}.md`;
    if (articleModules[key]) {
      const { body } = parseMarkdown(articleModules[key]);
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
          <p className="text-brand-peach font-semibold">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !currentArticleMeta) {
    return <NotFound />;
  }

  const ogImageUrl = `https://www.premdeep.co.in/og/articles/${slug}.png`;

  return (
    <div className="flex flex-col bg-brand-blue text-white min-h-screen">
      <Head>
        <title>{currentArticleMeta.title} | Prem</title>
        <meta name="description" content={currentArticleMeta.description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${currentArticleMeta.title} | Prem`} />
        <meta property="og:description" content={currentArticleMeta.description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${currentArticleMeta.title} | Prem`} />
        <meta name="twitter:description" content={currentArticleMeta.description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <DocumentOutline content={content} />

      {/* Unified Brand Peach Block */}
      <div className="mx-0 sm:mx-4 mb-16 bg-brand-peach text-slate-800 rounded-none shadow-md flex-grow flex flex-col">
        {/* Top Header Section */}
        <header className="pt-20 sm:pt-30 pb-6 sm:pb-10 px-4 sm:px-10 text-brand-blue">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex text-xs font-bold uppercase tracking-wider text-brand-blue/70 mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-1 md:gap-x-2 gap-y-1.5 list-none p-0 m-0">
                <li className="inline-flex items-center">
                  <Link to="/read-with-me" className="hover:text-blue-700 whitespace-nowrap">Learn with Me</Link>
                </li>
                <li className="inline-flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="whitespace-nowrap">Articles</span>
                </li>
                <li aria-current="page" className="inline-flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="truncate max-w-[150px] sm:max-w-xs whitespace-nowrap">{currentArticleMeta.title}</span>
                </li>
              </ol>
            </nav>

            <h1 className="text-2xl font-extrabold sm:text-4xl md:text-5xl leading-tight text-brand-blue break-words">
              {currentArticleMeta.title}
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-slate-700 font-medium leading-relaxed">
              {currentArticleMeta.description}
            </p>

            {/* Author Profile */}
            <div className="mt-6 flex items-center gap-4">
              <img
                src={authorImg}
                alt="Prem Deep"
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover border border-brand-blue shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-brand-blue">Prem Deep</span>
                <span className="text-xs font-semibold text-slate-600">ROXC | Turing | IIT Roorkee</span>
              </div>
            </div>
          </div>
        </header>

        {/* Thick Divider */}
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-10">
          <hr className="border-t-[3px] border-brand-blue" />
        </div>

        {/* Main Content Layout */}
        <div className="py-6 sm:py-10 px-4 sm:px-10 flex-grow">
          <div className="max-w-4xl mx-auto overflow-x-hidden">
            <MarkdownRenderer content={content} />
          </div>
        </div>

        {/* Thick Divider */}
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-10">
          <hr className="border-t-[3px] border-brand-blue" />
        </div>

        {/* Bottom Section: Previous/Next Navigation */}
        <footer className="py-6 sm:py-10 px-4 sm:px-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <Link
                to={`/articles/${prevArticle.slug}`}
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-none p-5 border border-brand-blue/10 transition-colors text-left"
              >
                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider block mb-1">
                  &larr; Previous Article
                </span>
                <span className="text-base font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight block">
                  {prevArticle.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextArticle ? (
              <Link
                to={`/articles/${nextArticle.slug}`}
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-none p-5 border border-brand-blue/10 transition-colors text-right"
              >
                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider block mb-1">
                  Next Article &rarr;
                </span>
                <span className="text-base font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight block">
                  {nextArticle.title}
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

export default ArticleDetail;
