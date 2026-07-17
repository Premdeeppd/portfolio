import fs from "fs";
import path from "path";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import matter from "gray-matter";
import contentIndex from "../../../../content/index.json";
import authorImg from "@/assets/images/image.png";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import DocumentOutline from "@/components/DocumentOutline";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ContentItem {
  title: string;
  slug: string;
  description: string;
  featured: boolean;
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

function getNoteData(slug: string) {
  const notes = sortNotes((contentIndex?.notes || []) as ContentItem[]);
  const currentNoteMeta = notes.find((n) => n.slug === slug);

  if (!currentNoteMeta) {
    return null;
  }

  const filePath = path.join(process.cwd(), "content/notes", `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    
    // Pagination: prev/next notes based on order
    const currentIndex = notes.findIndex((n) => n.slug === slug);
    const prevNote = currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null;
    const nextNote = currentIndex > 0 ? notes[currentIndex - 1] : null;

    return {
      meta: currentNoteMeta,
      frontmatter: data,
      content,
      prevNote,
      nextNote,
    };
  } catch (err) {
    console.error("Error reading note file:", err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getNoteData(slug);

  if (!data) {
    return {
      title: "Note Not Found",
    };
  }

  const noteUrl = `https://www.premdeep.co.in/notes/${slug}`;
  const ogImageUrl = `https://www.premdeep.co.in/og/notes/${slug}.png`;

  return {
    title: `${data.meta.title} | Prem`,
    description: data.meta.description,
    alternates: {
      canonical: noteUrl,
    },
    openGraph: {
      type: "article",
      url: noteUrl,
      title: `${data.meta.title} | Prem`,
      description: data.meta.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: data.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.meta.title} | Prem`,
      description: data.meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const data = getNoteData(slug);

  if (!data) {
    notFound();
  }

  const noteUrl = `https://www.premdeep.co.in/notes/${slug}`;
  const ogImageUrl = `https://www.premdeep.co.in/og/notes/${slug}.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${noteUrl}#article`,
        "headline": data.meta.title,
        "description": data.meta.description,
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
            "name": data.meta.title,
            "item": noteUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col bg-brand-blue text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocumentOutline content={data.content} />

      {/* Unified Brand Peach Block */}
      <div className="mx-0 sm:mx-4 mb-16 bg-brand-peach text-slate-800 rounded-none shadow-md flex-grow flex flex-col">
        {/* Top Header Section */}
        <header className="pt-30 pb-10 px-6 sm:px-10 text-brand-blue">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex text-xs font-bold uppercase tracking-wider text-brand-blue/70 mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-1 md:gap-x-2 gap-y-1.5 list-none p-0 m-0">
                <li className="inline-flex items-center">
                  <Link href="/read-with-me" className="hover:text-blue-700 whitespace-nowrap">Learn with Me</Link>
                </li>
                <li className="inline-flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="whitespace-nowrap">Notes</span>
                </li>
                <li aria-current="page" className="inline-flex items-center">
                  <span className="mx-1 text-brand-blue/40">/</span>
                  <span className="truncate max-w-[150px] sm:max-w-xs whitespace-nowrap">{data.meta.title}</span>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl leading-tight text-brand-blue">
              {data.meta.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              {data.meta.description}
            </p>

            {/* Author Profile */}
            <div className="mt-6 flex items-center gap-4">
              <Image
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
            <MarkdownRenderer content={data.content} />
          </div>
        </div>

        {/* Thick Divider */}
        <div className="max-w-4xl mx-auto w-full px-6 sm:px-10">
          <hr className="border-t-[3px] border-brand-blue" />
        </div>

        {/* Bottom Section: Previous/Next Navigation */}
        <footer className="py-10 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.prevNote ? (
              <Link
                href={`/notes/${data.prevNote.slug}`}
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-none p-5 border border-brand-blue/10 transition-colors text-left"
              >
                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider block mb-1">
                  &larr; Previous Note
                </span>
                <span className="text-base font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight block">
                  {data.prevNote.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {data.nextNote ? (
              <Link
                href={`/notes/${data.nextNote.slug}`}
                className="group block bg-brand-blue/5 hover:bg-brand-blue/10 rounded-none p-5 border border-brand-blue/10 transition-colors text-right"
              >
                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider block mb-1">
                  Next Note &rarr;
                </span>
                <span className="text-base font-bold text-brand-blue group-hover:text-blue-700 transition-colors leading-tight block">
                  {data.nextNote.title}
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
