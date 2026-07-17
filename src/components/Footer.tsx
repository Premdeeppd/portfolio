"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import linkedinImg from "../assets/images/linkedin.png";
import githubImg from "../assets/images/github.png";
import xImg from "../assets/images/x_logo.png";
import emailImg from "../assets/images/email.png";

export default function Footer() {
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLearnWithMeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/read-with-me") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (pathname === "/read-with-me") {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="mx-0 sm:mx-4 mt-8 bg-brand-blue text-white rounded-none border-t border-brand-peach/20 py-6 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 text-center">
        {/* Navigation Links Row */}
        <nav aria-label="Footer Navigation" className="w-full max-w-full overflow-x-auto">
          <ul className="flex flex-nowrap items-center justify-center gap-2 sm:gap-8 text-xs sm:text-sm font-medium p-0 m-0 list-none whitespace-nowrap">
            <li>
              <Link
                href="/#home"
                onClick={(e) => handleLinkClick(e, "home")}
                className="text-slate-300 hover:text-brand-peach transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/read-with-me"
                onClick={handleLearnWithMeClick}
                className="text-slate-300 hover:text-brand-peach transition-colors"
              >
                Learn with Me
              </Link>
            </li>
            <li>
              <Link
                href="/read-with-me#notes"
                onClick={(e) => handleSectionClick(e, "notes")}
                className="text-slate-300 hover:text-brand-peach transition-colors"
              >
                Technical Notes
              </Link>
            </li>
            <li>
              <Link
                href="/read-with-me#articles"
                onClick={(e) => handleSectionClick(e, "articles")}
                className="text-slate-300 hover:text-brand-peach transition-colors"
              >
                Articles
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                onClick={(e) => handleLinkClick(e, "contact")}
                className="text-slate-300 hover:text-brand-peach transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Connect Social Icons Row */}
        <div className="flex items-center justify-center gap-5">
          <a
            href="https://www.linkedin.com/in/prem-deep/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <div
              className="h-5 w-5 bg-brand-peach"
              style={{
                WebkitMaskImage: `url(${linkedinImg.src})`,
                maskImage: `url(${linkedinImg.src})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </a>
          <a
            href="https://github.com/Premdeeppd"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <div
              className="h-5 w-5 bg-brand-peach"
              style={{
                WebkitMaskImage: `url(${githubImg.src})`,
                maskImage: `url(${githubImg.src})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </a>
          <a
            href="https://x.com/Prem_deep_pd"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter) Profile"
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <div
              className="h-5 w-5 bg-brand-peach"
              style={{
                WebkitMaskImage: `url(${xImg.src})`,
                maskImage: `url(${xImg.src})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </a>
          <a
            href="mailto:premdeepnawada@gmail.com"
            aria-label="Email Me"
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <div
              className="h-5 w-5 bg-brand-peach"
              style={{
                WebkitMaskImage: `url(${emailImg.src})`,
                maskImage: `url(${emailImg.src})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
