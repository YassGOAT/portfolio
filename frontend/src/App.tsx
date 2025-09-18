import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./pages/Navbar/Navbar";
import Footer from "./pages/Footer/Footer";

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
      .then((u) => setMe(u)) // <- me() renvoie maintenant Me | null
      .catch(() => setMe(null))
      .finally(() => setLoadingMe(false));
  }, []);

  if (loadingMe) return null;

  return (
    <BrowserRouter>
      <NavBar me={me} onLogout={() => setMe(null)} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/cvs" element={<CVs me={me} />} />
          <Route path="/profile" element={me ? <Profile me={me} onMe={setMe} /> : <Navigate to="/" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
