import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CVs from "./pages/CVs/CVs";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Skills from "./pages/Skills/Skills";
import Certifications from "./pages/Certifications/Certifications";
import Presentation from "./pages/Presentation/Presentation";
import Profile from "./pages/Profile/Profile";
import Contact from "./pages/Contact/Contact";

export default function App() {
  return (
    <Router>
      <header style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Accueil</Link>
          <Link to="/cvs">CVs</Link>
          <Link to="/projects">Projets</Link>
          <Link to="/skills">Compétences</Link>
          <Link to="/certifications">Certifications</Link>
          <Link to="/presentation">Présentation</Link>
          <Link to="/profile">Profil</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<h1>Bienvenue sur mon portfolio 🚀</h1>} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<h1>404 - Page introuvable</h1>} />
        </Routes>
      </main>
    </Router>
  );
}
