import './ProjectDetails.css'
import { useParams } from 'react-router-dom'
import { useProjectBySlug } from '../../hooks/usePortfolio'
import type { ProjectDetail, ProjectImage, Skill } from '../../types'

export default function ProjectDetails() {
  const { slug = '' } = useParams()
  const { data, isLoading, error } = useProjectBySlug(slug)

  if (isLoading) return <p>Chargement…</p>
  if (error || !data) return <p>Introuvable.</p>

  const proj: ProjectDetail = data
  const imgs: ProjectImage[] = proj.images ?? []
  const skills: Skill[] = proj.skills ?? []

  return (
    <article className="card project-details">
      <h1 className="title">{proj.title}</h1>
      {proj.cover_url && <img className="cover" src={proj.cover_url} alt={proj.title || ''} />}
      {proj.short_desc && <p className="lead">{proj.short_desc}</p>}

      {proj.long_desc && <div className="rich" dangerouslySetInnerHTML={{ __html: proj.long_desc }} />}

      {skills.length > 0 && (
        <section className="skills">
          <h2 className="section-title">Compétences</h2>
          <ul className="chiplist">
            {skills.map((s) => (
              <li key={s.id_skill} className="chip">
                {s.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {imgs.length > 0 && (
        <section className="gallery">
          <h2 className="section-title">Galerie</h2>
          <div className="gallery-grid">
            {imgs.map((img) => (
              <img key={img.id_image} src={img.image_url} alt={img.alt_text || ''} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
