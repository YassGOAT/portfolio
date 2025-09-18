import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from "react-router-dom";

import CVs from "./pages/CVs/CVs";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Skills from "./pages/Skills/Skills";
import Certifications from "./pages/Certifications/Certifications";
import Presentation from "./pages/Presentation/Presentation";
import Profile from "./pages/Profile/Profile";
import Contact from "./pages/Contact/Contact";

export default function App() {
  const [open, setOpen] = useState(false);

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <>
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        Accueil
      </NavLink>
      <NavLink to="/cvs" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        CVs
      </NavLink>
      <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        Projets
      </NavLink>
      <NavLink to="/skills" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        Compétences
      </NavLink>
      <NavLink to="/certifications" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        Certifications
      </NavLink>
      <NavLink to="/presentation" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        Présentation
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        Profil
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClick}>
        Contact
      </NavLink>
    </>
  );

  return (
    <Router>
      {/* Header */}
      <header className="site-header">
        <div className="container site-header__bar">
          <Link to="/" className="brand">
            <span className="brand-dot" />
            <span className="brand-name">Hamri<span className="brand-accent">Portfolio</span></span>
          </Link>

          <div className="nav-group">
            <nav className="nav">
              <NavItems />
            </nav>
          </div>

          <button className="mobile-toggle" aria-label="Ouvrir le menu" onClick={() => setOpen((o) => !o)}>
            <span></span><span></span><span></span>
          </button>
        </div>

        {/* Menu mobile */}
        <div className={`mobile-menu ${open ? "open" : ""}`}>
          <nav className="nav container">
            <NavItems onClick={() => setOpen(false)} />
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Routes>
          <Route path="/" element={<h1 className="page-title">Bienvenue sur mon portfolio 🚀</h1>} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<h1 className="page-title">404 - Page introuvable</h1>} />
        </Routes>
      </main>

      {/* Footer simple */}
      <footer className="container" style={{ padding: "24px 0", borderTop: "1px solid #e5e7eb", color: "#6b7280" }}>
        © {new Date().getFullYear()} — Yassine Hamri. Tous droits réservés.
      </footer>
    </Router>
  );
}
