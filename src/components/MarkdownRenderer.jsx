import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import mermaid from "mermaid";

// Initialize mermaid with clean matching styles
mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "Outfit, sans-serif",
  themeVariables: {
    fontFamily: "Outfit, sans-serif",
    primaryColor: "#ffe3d0",      // brand peach
    primaryTextColor: "#0262de",  // brand blue
    lineColor: "#0262de",
    nodeBorder: "#0262de",
  }
});

// Render Mermaid charts safely with a ref
const MermaidBlock = ({ chart }) => {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!chart || !containerRef.current) return;

    const renderChart = async () => {
      const id = `mermaid-chart-${Math.floor(Math.random() * 100000)}`;
      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        const { svg } = await mermaid.render(id, chart);
        if (active) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        if (active) {
          setError(err.message || "Failed to render Mermaid diagram");
        }
        // Cleanup the temporary element created by this specific render attempt
        const badElement = document.getElementById(`d${id}`);
        if (badElement) badElement.remove();
      }
    };

    renderChart();

    return () => {
      active = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 p-4 border border-red-500/20 bg-red-50/10 text-red-500 text-xs font-mono whitespace-pre-wrap rounded-none text-left">
        <div className="font-bold mb-2">Mermaid Rendering Error:</div>
        {error}
        <pre className="mt-4 p-3 bg-slate-900 text-slate-300 overflow-x-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 p-6 bg-white/40 border border-brand-blue/10 flex justify-center items-center overflow-x-auto rounded-none shadow-xs text-center"
      dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
    />
  );
};

// Custom code block renderer with syntax highlighting and copy button
const CodeBlock = ({ lang, codeString }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let highlightedCode = codeString;
  try {
    if (lang && hljs.getLanguage(lang)) {
      highlightedCode = hljs.highlight(codeString, { language: lang }).value;
    } else {
      highlightedCode = hljs.highlightAuto(codeString).value;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="relative my-6 rounded-none overflow-hidden border border-white/20 shadow-md text-left">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono">
        <span>{lang || "code"}</span>
        <button
          onClick={handleCopy}
          className="rounded-none bg-slate-700 hover:bg-slate-600 px-2.5 py-1 text-white font-sans font-medium transition-colors cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-slate-950 p-4 overflow-x-auto text-sm font-mono text-slate-100 m-0">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
};

// Helper to generate heading IDs and anchor links
const renderHeading = (level, children) => {
  const text = React.Children.toArray(children)
    .map((child) => (typeof child === "string" ? child : child.props?.children || ""))
    .join("");
  const id = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
  
  const Tag = `h${level}`;
  
  // Custom styles per heading level
  let className = "group relative font-semibold text-brand-blue scroll-mt-28 ";
  if (level === 1) className += "text-3xl mt-8 mb-4 border-b border-brand-blue/10 pb-2";
  else if (level === 2) className += "text-2xl mt-8 mb-4";
  else if (level === 3) className += "text-xl mt-6 mb-3";
  else className += "text-lg mt-5 mb-2";

  return (
    <Tag id={id} className={className}>
      <a
        href={`#${id}`}
        className="absolute -left-5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue/40 pr-2 hover:text-brand-blue"
        aria-label={`Link to section: ${text}`}
      >
        #
      </a>
      {children}
    </Tag>
  );
};

// Renderer components mapping
const mdComponents = {
  h1: ({ children }) => renderHeading(1, children),
  h2: ({ children }) => renderHeading(2, children),
  h3: ({ children }) => renderHeading(3, children),
  h4: ({ children }) => renderHeading(4, children),
  h5: ({ children }) => renderHeading(5, children),
  h6: ({ children }) => renderHeading(6, children),
  pre: ({ children }) => {
    const childrenArray = React.Children.toArray(children);
    const codeElement = childrenArray.find(
      (child) => child.props && (child.props.className || child.props.children)
    );
    if (codeElement) {
      const className = codeElement.props.className || "";
      const codeText = codeElement.props.children || "";
      const match = /language-(\w+)/.exec(className);
      const lang = match ? match[1] : "";
      const codeString = String(codeText).replace(/\n$/, "");
      
      if (lang === "mermaid") {
        return <MermaidBlock chart={codeString} />;
      }
      
      return <CodeBlock lang={lang} codeString={codeString} />;
    }
    return <pre className="bg-slate-950 p-4 overflow-x-auto rounded-none">{children}</pre>;
  },
  code: ({ children }) => (
    <code className="bg-brand-blue/10 px-1.5 py-0.5 rounded-none font-mono text-[0.85em] text-brand-blue break-words whitespace-pre-wrap">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-none border border-brand-blue/10 shadow-xs">
      <table className="w-full border-collapse text-left text-sm text-slate-800">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-100/60 font-semibold text-brand-blue border-b border-brand-blue/10">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 text-slate-700">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-brand-blue/40 bg-brand-blue/5 pl-4 py-2 pr-2 italic text-slate-700 rounded-none">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="my-4 list-disc pl-6 space-y-1.5 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal pl-6 space-y-1.5 text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  p: ({ children }) => <p className="my-4 leading-relaxed text-slate-700">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-brand-blue font-semibold underline hover:text-blue-700 transition-colors"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="my-6 max-w-full h-auto rounded-none border border-white/20 shadow-md mx-auto"
    />
  ),
  hr: () => <hr className="my-8 border-t border-brand-blue/10" />,
};

function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
