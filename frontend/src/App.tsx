import { Link, NavLink, Outlet } from 'react-router-dom'
import './index.css'

const LINKS: [to: string, label: string][] = [
  ['/', 'Présentation'],
  ['/skills', 'Compétences'],
  ['/projects', 'Projets'],
  ['/certifications', 'Certifications'],
  ['/cvs', 'CV'],
  ['/contact', 'Contact'],
]

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container site-header__bar">
          <Link to="/" className="brand" style={{ fontWeight: 700 }}>
            Mon Portfolio
          </Link>

          <nav className="nav">
            {LINKS.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {label}
              </NavLink>
            ))}
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
