import './Presentation.css'
import { usePresentation } from '../../hooks/usePortfolio'

export default function Presentation() {
  const { data, isLoading, error } = usePresentation('fr')

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur de chargement.</p>

  const item = data?.[0]

  return (
    <section className="card presentation">
      <h1 className="title">{item?.headline || 'Présentation'}</h1>
      {item?.content_md ? (
        <article
          className="content"
          // ton contenu peut être du HTML/Markdown déjà transformé côté back
          dangerouslySetInnerHTML={{ __html: item.content_md }}
        />
      ) : (
        <p className="muted">Aucun contenu pour le moment.</p>
      )}
    </section>
  )
}
