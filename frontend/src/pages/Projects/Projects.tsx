import './Projects.css'
import { useState } from 'react'
import { useProjects } from '../../hooks/usePortfolio'
import { Link } from 'react-router-dom'
import type { Project } from '../../types'

export default function Projects() {
  const [page, setPage] = useState<number>(1)
  const { data, isLoading, error } = useProjects({ page, limit: 6 })

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur de chargement.</p>

  const totalPages = data?.totalPages ?? 1
  const items: Project[] = data?.data ?? []

  return (
    <section>
      <div className="grid grid-cols-3 gap-24">
        {items.map((p) => (
          <Link to={`/projects/${p.slug}`} key={p.id_project} className="card project-card">
            {p.cover_url && <img src={p.cover_url} alt="" />}
            <h3 className="project-title">{p.title}</h3>
            {p.short_desc && <p className="project-desc">{p.short_desc}</p>}
            <div className="project-meta">
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noreferrer">
                  Code
                </a>
              )}
              {p.demo_url && (
                <a href={p.demo_url} target="_blank" rel="noreferrer">
                  Démo
                </a>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button className="page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Préc.
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          className="page-btn"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Suiv.
        </button>
      </div>
    </section>
  )
}
