import React from "react";
import { Link } from "react-router-dom";
import contentIndex from "../../content/index.json";

function ReadWithMe() {
  const notes = contentIndex?.notes || [];
  const articles = contentIndex?.articles || [];

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
    <div className="mx-4 flex flex-col bg-brand-blue min-h-screen text-white pt-6">
      <div className="mx-auto max-w-5xl w-full px-2 sm:px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center py-10 bg-brand-peach rounded-2xl text-brand-blue mb-10 shadow-md">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Read with Me
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg px-4 text-brand-blue/90 font-medium">
            Welcome to my personal knowledge base. Here I share quick reference notes and long-form articles about technology, learning paths, and system design.
          </p>
        </div>

        {/* Notes Grid Section */}
        <section id="notes" className="mb-14">
          <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Technical Notes
            </h2>
            <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-brand-peach">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {notes.length === 0 ? (
            <p className="text-white/70 italic text-center py-6">No notes found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <Link
                  key={note.slug}
                  to={`/notes/${note.slug}`}
                  className="group block bg-brand-peach rounded-2xl p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-[0_20px_40px_rgba(255,227,208,0.15)] flex flex-col justify-between min-h-[170px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight">
                        {note.title}
                      </h3>
                      {note.featured && (
                        <span className="shrink-0 text-[10px] font-extrabold bg-brand-blue text-brand-peach px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-6 line-clamp-3">
                      {note.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-t border-brand-blue/10 pt-3">
                    <span>Updated {formatDate(note.lastUpdated)}</span>
                    <span className="bg-brand-blue/5 text-brand-blue px-2 py-0.5 rounded-md">
                      {note.readingTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Articles List Section */}
        <section id="articles" className="pb-16">
          <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Articles & Writings
            </h2>
            <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-brand-peach">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {articles.length === 0 ? (
            <p className="text-white/70 italic text-center py-6">No articles found.</p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/articles/${article.slug}`}
                  className="group block bg-brand-peach rounded-2xl p-6 hover:translate-x-1.5 transition-all duration-300 shadow-md hover:shadow-[0_15px_30px_rgba(255,227,208,0.15)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight">
                          {article.title}
                        </h3>
                        {article.featured && (
                          <span className="shrink-0 text-[10px] font-extrabold bg-brand-blue text-brand-peach px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed line-clamp-2">
                        {article.description}
                      </p>
                    </div>
                    
                    {/* Meta stats right column on wide screens, bottom on small */}
                    <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0 border-t sm:border-t-0 border-brand-blue/10 pt-3 sm:pt-0 text-xs text-slate-500 font-semibold gap-1.5">
                      <time className="whitespace-nowrap">{formatDate(article.date)}</time>
                      <span className="bg-brand-blue/5 text-brand-blue px-2.5 py-0.5 rounded-md whitespace-nowrap">
                        {article.readingTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ReadWithMe;
