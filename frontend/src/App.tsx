import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useMe } from './hooks/useAuth'
import './index.css'

const MAIN_LINKS: [to: string, label: string][] = [
  ['/', 'Présentation'],
  ['/skills', 'Compétences'],
  ['/projects', 'Projets'],
  ['/certifications', 'Certifications'],
  ['/cvs', 'CV'],
  ['/contact', 'Contact'],
]

export default function App() {
  const { data: me, isLoading } = useMe()
  const user = me?.user
  const [open, setOpen] = useState(false)

  const closeMobile = () => setOpen(false)

  return (
    <div className="app">
      <header className="site-header">
        <div className="container site-header__bar">
          <Link to="/" className="brand" style={{ fontWeight: 700 }}>
            Mon Portfolio
          </Link>

          {/* Bouton burger (mobile) */}
          <button
            aria-label="Ouvrir le menu"
            className="mobile-toggle"
            onClick={() => setOpen(v => !v)}
          >
            <span /><span /><span />
          </button>

          {/* Nav desktop */}
          <div className="nav-group">
            <nav className="nav">
              {MAIN_LINKS.map(([to, label]) => (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <nav className="nav">
              {isLoading ? null : user ? (
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                  title={user.email}
                >
                  {user.name || user.email}
                </NavLink>
              ) : (
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  Se connecter / S’inscrire
                </NavLink>
              )}
            </nav>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`mobile-menu${open ? ' open' : ''}`}>
          <nav className="nav">
            {MAIN_LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} onClick={closeMobile}>
                {label}
              </NavLink>
            ))}
          </nav>
          <hr />
          <nav className="nav">
            {user ? (
              <NavLink to="/profile" onClick={closeMobile} title={user.email}>
                {user.name || user.email}
              </NavLink>
            ) : (
              <NavLink to="/profile" onClick={closeMobile}>
                Se connecter / S’inscrire
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="container" style={{ padding: '32px 0' }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', background: '#f3f4f6', marginTop: 40 }}>
        <div className="container center" style={{ padding: '24px 0' }}>
          <small className="text-sm">© {new Date().getFullYear()} Mon Nom. Tous droits réservés.</small>
        </div>
      </footer>
    </div>
  )
}
