import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

/** PAGES */
import Home from "./pages/Presentation/Presentation";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Skills from "./pages/Skills/Skills";
import Certifications from "./pages/Certifications/Certifications";
import CVs from "./pages/CVs/CVs";
import Profile from "./pages/Profile/Profile";
import Contact from "./pages/Contact/Contact";

import * as api from "./services/api";
import "./App.css";

export type Session = api.Me | null;

export default function App() {
  const [me, setMe] = useState<Session>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((u) => setMe(u))
      .catch(() => setMe(null))
      .finally(() => setLoadingMe(false));
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof api.logout === "function") {
        await api.logout();
      }
    } finally {
      setMe(null);
    }
  };

  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="brand">
          <Link to="/">
            Hamri <strong>Portfolio</strong>
          </Link>
        </div>

        <nav className="site-nav">
          <Link to="/">Accueil</Link>
          <Link to="/cvs">CVs</Link>
          <Link to="/projects">Projets</Link>
          <Link to="/skills">Compétences</Link>
          <Link to="/certifications">Certifications</Link>
          <Link to="/contact">Contact</Link>

          {/* Espace à droite selon l'état d'auth */}
          {loadingMe ? (
            <span className="muted">…</span>
          ) : me ? (
            <>
              <Link to="/profile">Profil</Link>
              <button className="linklike" onClick={handleLogout}>
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link to="/profile#login">Se connecter</Link>
              <Link to="/profile#register">S’inscrire</Link>
            </>
          )}
        </nav>
      </header>

      <main className="site-main">
        {/* Tu peux aussi afficher un écran de chargement global si tu préfères */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile me={me} onMe={setMe} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} — Yassine Hamri. Tous droits réservés.</p>
      </footer>
    </BrowserRouter>
  );
}
