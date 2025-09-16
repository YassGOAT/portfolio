import { Link, Outlet, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-bold text-lg">Mon Portfolio</Link>
          <nav className="flex gap-6 text-sm">
            {[
              ['/', 'Présentation'],
              ['/skills','Compétences'],
              ['/projects','Projets'],
              ['/certifications','Certifications'],
              ['/cvs','CV'],
              ['/contact','Contact']
            ].map(([to,label])=>(
              <NavLink
                key={to}
                to={to}
                className={({isActive}) =>
                  `hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <Outlet />
        <h1 className="text-3xl font-bold underline text-blue-600">Hello Tailwind</h1>

      </main>
      <footer className="container py-10 text-sm text-gray-500">© {new Date().getFullYear()}</footer>
    </div>
  )
}
