import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function NavBar() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to hash element if exists in URL (e.g. after navigating back to home)
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly to allow the home component to render and mount
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const handleLinkClick = (e, targetId) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isReadWithMeActive =
    location.pathname.startsWith("/read-with-me") ||
    location.pathname.startsWith("/notes") ||
    location.pathname.startsWith("/articles");

  return (
    <nav className="fixed top-8 z-50 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 bg-brand-peach/95 backdrop-blur-md rounded-none max-w-[90vw] md:max-w-none">
      <ul className="m-0 flex list-none items-center justify-center gap-6 px-8 py-2.5 whitespace-nowrap">
        <li>
          <Link
            to="/#home"
            onClick={(e) => handleLinkClick(e, "home")}
            aria-label="Go to Home"
            className={`font-bold text-brand-blue no-underline transition-colors hover:text-blue-700 tracking-wide ${
              location.pathname === "/" && !location.hash ? "underline decoration-brand-blue decoration-2 underline-offset-4" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/read-with-me"
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
            to="/#contact"
            onClick={(e) => handleLinkClick(e, "contact")}
            aria-label="Go to Contact"
            className={`font-bold text-brand-blue no-underline transition-colors hover:text-blue-700 tracking-wide ${
              location.hash === "#contact" ? "underline decoration-brand-blue decoration-2 underline-offset-4" : ""
            }`}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
