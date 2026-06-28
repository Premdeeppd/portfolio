import React, { useEffect, useState } from "react";

const parseHeadings = (markdown) => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
    headings.push({ level, text, id });
  }
  return headings;
};

function DocumentOutline({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (content) {
      setHeadings(parseHeadings(content));
    }
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
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end space-y-3 p-3.5 rounded-2xl bg-transparent hover:bg-brand-peach/95 hover:backdrop-blur-md border border-transparent hover:border-brand-blue/10 hover:shadow-xl transition-all duration-300 ease-in-out group max-w-[42px] hover:max-w-[280px] overflow-hidden">
      {headings.map((heading) => {
        const isActive = activeId === heading.id;
        const dashWidth =
          heading.level === 1
            ? "w-6"
            : heading.level === 2
            ? "w-4"
            : heading.level === 3
            ? "w-2.5"
            : "w-1.5";

        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(heading.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="flex items-center justify-end gap-3 no-underline group/item cursor-pointer w-full py-0.5"
          >
            {/* Title Text Label */}
            <span
              className={`text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[200px] text-right ${
                isActive
                  ? "text-brand-blue font-bold translate-x-0"
                  : "text-brand-blue/70 hover:text-brand-blue group-hover/item:-translate-x-1"
              }`}
            >
              {heading.text}
            </span>

            {/* Dash Line representation */}
            <div
              className={`h-1 rounded-full transition-all duration-300 shrink-0 ${dashWidth} ${
                isActive
                  ? "bg-brand-peach group-hover:bg-brand-blue h-1.5 shadow-[0_0_8px_rgba(255,227,208,0.6)] group-hover:shadow-none"
                  : "bg-white/40 group-hover:bg-brand-blue/30"
              }`}
            />
          </a>
        );
      })}
    </div>
  );
}

export default DocumentOutline;
