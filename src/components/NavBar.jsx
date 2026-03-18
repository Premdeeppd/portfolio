function NavBar() {
  return (
    <nav className="mx-4 bg-[#ffe3d0]">
      <ul className="m-0 flex list-none items-center justify-end gap-6 px-4 py-3">
        <li>
          <a
            href="#home"
            aria-label="Go to Home"
            className="font-semibold text-[#0262de] no-underline visited:text-[#0262de] hover:text-blue-700"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#projects"
            aria-label="Go to Projects"
            className="font-semibold text-[#0262de] no-underline visited:text-[#0262de] hover:text-blue-700"
          >
            Projects
          </a>
        </li>
        <li>
          <a
            href="#contact"
            aria-label="Go to Contact"
            className="font-semibold text-[#0262de] no-underline visited:text-[#0262de] hover:text-blue-700"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
