import './CVs.css'
import { useCVs } from '../../hooks/usePortfolio'
import type { CV } from '../../types'

export default function CVs() {
  const { data, isLoading, error } = useCVs()
  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur de chargement.</p>

  const items: CV[] = data ?? []

  return (
    <ul className="grid grid-cols-2 gap-24 cv-list">
      {items.map((cv) => (
        <li key={cv.id_cv} className="card cv-card">
          <div className="cv-head">
            <div>
              <h3 className="cv-title">{cv.label || 'CV'}</h3>
              <p className="cv-sub">
                {(cv.locale || 'fr').toUpperCase()} {cv.is_active ? '• actif' : ''}
              </p>
            </div>
            <a className="btn" href={cv.file_url} target="_blank" rel="noreferrer">
              Télécharger
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
