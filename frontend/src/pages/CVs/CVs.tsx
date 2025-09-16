import './CVs.css'
import { useEffect, useMemo, useState } from 'react'
import { useCVs } from '../../hooks/usePortfolio'
import type { CV } from '../../types'

export default function CVs() {
  // On récupère tous les CV (on filtre côté front)
  const { data, isLoading, error } = useCVs()

  const [locale, setLocale] = useState<string>('all')
  const [onlyActive, setOnlyActive] = useState<boolean>(false)
  const [selected, setSelected] = useState<CV | null>(null)

  // Locales disponibles (ex: ["fr","en"])
  const locales = useMemo<string[]>(
    () => Array.from(new Set((data ?? []).map(cv => cv.locale))).sort(),
    [data]
  )

  // Appliquer les filtres
  const filtered: CV[] = useMemo(() => {
    let arr = (data ?? [])
    if (locale !== 'all') arr = arr.filter(cv => cv.locale === locale)
    if (onlyActive) arr = arr.filter(cv => cv.is_active === 1)
    return arr
  }, [data, locale, onlyActive])

  // Sélection par défaut
  useEffect(() => {
    if (!filtered.length) { setSelected(null); return }
    if (!selected || !filtered.some(cv => cv.id_cv === selected.id_cv)) {
      setSelected(filtered[0])
    }
  }, [filtered, selected])

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur de chargement.</p>

  return (
    <section className="cvs-page">
      {/* Barre de filtres */}
      <div className="toolbar card">
        <div className="toolbar-left">
          <label className="field">
            <span>Langue</span>
            <select value={locale} onChange={e => setLocale(e.target.value)}>
              <option value="all">Toutes</option>
              {locales.map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={e => setOnlyActive(e.target.checked)}
            />
            <span>N’afficher que l’actif</span>
          </label>
        </div>

        <div className="toolbar-right">
          {selected && (
            <a className="btn" href={selected.file_url} target="_blank" rel="noreferrer">
              Télécharger le CV sélectionné
            </a>
          )}
        </div>
      </div>

      {/* Grille des CVs */}
      <ul className="grid grid-cols-2 gap-24 cv-list">
        {filtered.map(cv => (
          <li
            key={cv.id_cv}
            className={`card cv-card ${selected?.id_cv === cv.id_cv ? 'is-selected' : ''}`}
            onClick={() => setSelected(cv)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(cv)}
            aria-label={`CV ${cv.label ?? ''} ${cv.locale?.toUpperCase()}`}
          >
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

      {/* Aperçu PDF */}
      <div className="viewer card">
        <h2 className="viewer-title">Aperçu</h2>
        {!selected ? (
          <p className="muted">Aucun CV à afficher avec ces filtres.</p>
        ) : (
          <iframe
            title={selected.label ?? `CV ${selected.locale?.toUpperCase()}`}
            src={selected.file_url}
            className="pdf-frame"
          />
        )}
      </div>
    </section>
  )
}
