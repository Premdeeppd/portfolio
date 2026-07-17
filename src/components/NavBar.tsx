"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    // Set initial hash from window
    setHash(window.location.hash);

    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  useEffect(() => {
    // Scroll to hash element if exists in URL
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash, pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
        setHash(`#${targetId}`);
      }
    }
  };

  const handleLearnWithMeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/read-with-me") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isReadWithMeActive =
    pathname.startsWith("/read-with-me") ||
    pathname.startsWith("/notes") ||
    pathname.startsWith("/articles");

  return (
    <nav className="fixed top-8 z-50 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 bg-brand-peach/95 backdrop-blur-md rounded-none max-w-[90vw] md:max-w-none">
      <ul className="m-0 flex list-none items-center justify-center gap-6 px-8 py-2.5 whitespace-nowrap">
        <li>
          <Link
            href="/#home"
            onClick={(e) => handleLinkClick(e, "home")}
            aria-label="Go to Home"
            className={`font-bold text-brand-blue no-underline transition-colors hover:text-blue-700 tracking-wide ${
              pathname === "/" && !hash ? "underline decoration-brand-blue decoration-2 underline-offset-4" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/read-with-me"
            onClick={handleLearnWithMeClick}
            aria-label="Go to Learn with Me"
            className={`font-bold text-brand-blue no-underline transition-colors hover:text-blue-700 tracking-wide ${
              isReadWithMeActive ? "underline decoration-brand-blue decoration-2 underline-offset-4" : ""
            }`}
          >
            Learn with Me
          </Link>
        </li>
        <li>
          <Link
            href="/#contact"
            onClick={(e) => handleLinkClick(e, "contact")}
            aria-label="Go to Contact"
            className={`font-bold text-brand-blue no-underline transition-colors hover:text-blue-700 tracking-wide ${
              hash === "#contact" ? "underline decoration-brand-blue decoration-2 underline-offset-4" : ""
            }`}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
