function NavBar() {
  return (
    <nav className="fixed top-4 z-50 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 bg-brand-peach/95 backdrop-blur-md rounded-full shadow-lg border border-brand-peach/20 max-w-[90vw] md:max-w-none">
      <ul className="m-0 flex list-none items-center justify-center gap-6 px-8 py-2.5 whitespace-nowrap">
        <li>
          <a
            href="#home"
            aria-label="Go to Home"
            className="font-bold text-brand-blue no-underline transition-colors hover:text-blue-700 tracking-wide"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#contact"
            aria-label="Go to Contact"
            className="font-bold text-brand-blue no-underline transition-colors hover:text-blue-700 tracking-wide"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
