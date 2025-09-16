import './Certifications.css'
import { useCertifications } from '../../hooks/usePortfolio'
import type { Certification } from '../../types'

export default function Certifications() {
  const { data, isLoading, error } = useCertifications()
  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur de chargement.</p>

  const items: Certification[] = data ?? []

  return (
    <div className="grid grid-cols-2 gap-24">
      {items.map((c) => (
        <article key={c.id_certification} className="card cert">
          <h3 className="cert-title">{c.title}</h3>
          <p className="cert-sub">
            {c.issuer || '—'} {c.issue_date ? `• ${c.issue_date.slice(0, 10)}` : ''}
            {c.expire_date ? ` → ${c.expire_date.slice(0, 10)}` : ''}
          </p>
          {c.description && <p className="cert-desc">{c.description}</p>}
          <div className="cert-actions">
            {c.credential_url && (
              <a className="btn" target="_blank" rel="noreferrer" href={c.credential_url}>
                Voir le certificat
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
