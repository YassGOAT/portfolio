import { usePresentation } from '../hooks/usePortfolio';

export default function Presentation() {
  const { data, isLoading, error } = usePresentation('fr')
  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur.</p>

  const item = data?.[0]
  return (
    <section className="card">
      <h1 className="text-2xl font-bold mb-2">{item?.headline || 'Présentation'}</h1>
      <article className="prose max-w-none" dangerouslySetInnerHTML={{__html: item?.content_md || ''}} />
    </section>
  )
}
