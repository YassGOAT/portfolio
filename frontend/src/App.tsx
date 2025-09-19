import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import * as api from "./services/api";
import "./App.css";

/* PAGES */
import Home from "./pages/Presentation/Presentation";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Skills from "./pages/Skills/Skills";
import Certifications from "./pages/Certifications/Certifications";
import CVs from "./pages/CVs/CVs";
import Profile from "./pages/Profile/Profile";
import Contact from "./pages/Contact/Contact";

export default function App() {
  const [me, setMe] = useState<api.Session>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((u) => setMe(u))
      .catch(() => setMe(null))
      .finally(() => setLoadingMe(false));
  }, []);

  const onLogout = async () => {
    await api.logout();
    setMe(null);
  };

  return (
    <BrowserRouter>
      <header className="topbar">
        <div className="brand">
          <Link to="/">Hamri <strong>Portfolio</strong></Link>
        </div>
        <nav className="nav">
          <Link to="/cvs">CVs</Link>
          <Link to="/projects">Projets</Link>
          <Link to="/skills">Compétences</Link>
          <Link to="/certifications">Certifications</Link>
          <Link to="/">Présentation</Link>
          {!loadingMe && (
            me ? (
              <>
                <Link to="/profile">Profil</Link>
                <button className="linklike" onClick={onLogout}>Se déconnecter</button>
              </>
            ) : (
              <Link to="/profile">Se connecter / S’inscrire</Link>
            )
          )}
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} — Yassine Hamri. Tous droits réservés.
      </footer>
    </BrowserRouter>
  );
}
