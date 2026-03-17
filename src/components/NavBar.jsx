import "../styles/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar mx-4">
      <ul className="nav-links">
        <li>
          <a href="#home" aria-label="Go to Home">
            Home
          </a>
        </li>
        <li>
          <a href="#projects" aria-label="Go to Projects">
            Projects
          </a>
        </li>
        <li>
          <a href="#contact" aria-label="Go to Contact">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
