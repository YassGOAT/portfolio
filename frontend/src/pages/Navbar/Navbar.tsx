import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Session } from "../../App";

type Props = {
  me: Session;
  onLogout: () => void;
};

export default function NavBar({ me, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const link = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  const goto = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      <a className="brand" onClick={() => goto("/")} style={{ cursor: "pointer" }}>
        <span className="brand-dot" />
        <span className="brand-name">Hamri <span className="brand-accent">Portfolio</span></span>
      </a>

      {/* Desktop */}
      <nav className="nav-group">
        <div className="nav">
          <NavLink to="/" className={link}>Accueil</NavLink>
          <NavLink to="/cvs" className={link}>CVs</NavLink>
          <NavLink to="/projects" className={link}>Projets</NavLink>
          <NavLink to="/skills" className={link}>Compétences</NavLink>
          <NavLink to="/certifications" className={link}>Certifications</NavLink>
          <NavLink to="/" className={link} end>Présentation</NavLink>
          <NavLink to="/contact" className={link}>Contact</NavLink>
          {me ? (
            <>
              <NavLink to="/profile" className={link}>Profil</NavLink>
              <button className="btn btn-light" onClick={onLogout}>Se déconnecter</button>
            </>
          ) : (
            <>
              <button className="btn btn-light" onClick={() => goto("/profile")}>
                Se connecter
              </button>
              <button className="btn" onClick={() => goto("/profile")}>
                S'inscrire
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile toggle */}
      <button
        className="mobile-toggle"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <nav className="nav">
          <NavLink to="/" className={link} onClick={() => setOpen(false)}>Accueil</NavLink>
          <NavLink to="/cvs" className={link} onClick={() => setOpen(false)}>CVs</NavLink>
          <NavLink to="/projects" className={link} onClick={() => setOpen(false)}>Projets</NavLink>
          <NavLink to="/skills" className={link} onClick={() => setOpen(false)}>Compétences</NavLink>
          <NavLink to="/certifications" className={link} onClick={() => setOpen(false)}>Certifications</NavLink>
          <NavLink to="/" className={link} end onClick={() => setOpen(false)}>Présentation</NavLink>
          <NavLink to="/contact" className={link} onClick={() => setOpen(false)}>Contact</NavLink>
          {me ? (
            <>
              <NavLink to="/profile" className={link} onClick={() => setOpen(false)}>Profil</NavLink>
              <button className="btn btn-light" onClick={() => { setOpen(false); onLogout(); }}>
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-light" onClick={() => goto("/profile")}>
                Se connecter
              </button>
              <button className="btn" onClick={() => goto("/profile")}>
                S'inscrire
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
