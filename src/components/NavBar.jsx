function NavBar() {
  return (
    <nav className="mx-4 bg-brand-peach rounded-t-2xl">
      <ul className="m-0 flex list-none items-center justify-end gap-6 px-6 py-3">
        <li>
          <a
            href="#home"
            aria-label="Go to Home"
            className="font-semibold text-brand-blue no-underline visited:text-brand-blue hover:text-blue-700"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#contact"
            aria-label="Go to Contact"
            className="font-semibold text-brand-blue no-underline visited:text-brand-blue hover:text-blue-700"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
