import React, { useEffect, useState } from "react";
import { parseHeadings } from "../utils/parseHeadings";

// Safe padding mapping for Tailwind class compiler
const paddingMap = {
  1: "pl-0",
  2: "pl-3",
  3: "pl-6",
  4: "pl-9",
  5: "pl-12",
  6: "pl-16",
};

function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const parsedHeadings = parseHeadings(content);
    setHeadings(parsedHeadings);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleObserver = (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Find the first visible heading in viewport
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -40% 0px",
      threshold: 0.1,
    });

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc-nav py-4 border-l-2 border-brand-blue/10 pl-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto hidden lg:block">
      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-2.5 text-sm">
        {headings.map((heading) => {
          const indentClass = paddingMap[heading.level] || "pl-0";
          const isActive = activeId === heading.id;
          
          return (
            <li key={heading.id} className={`${indentClass}`}>
              <a
                href={`#${heading.id}`}
                className={`block transition-all duration-200 border-l-2 py-0.5 leading-snug ${
                  isActive
                    ? "text-brand-blue font-bold border-brand-blue -ml-[18px] pl-[16px]"
                    : "text-slate-500 hover:text-brand-blue border-transparent -ml-[18px] pl-[16px]"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default TableOfContents;
