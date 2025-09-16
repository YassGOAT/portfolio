import { useParams } from 'react-router-dom'
import { useProjectBySlug } from '../hooks/usePortfolio'

export default function ProjectDetails() {
  const { slug = '' } = useParams()
  const { data, isLoading, error } = useProjectBySlug(slug)
  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Introuvable.</p>

  return (
    <article className="card">
      <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
      {data.cover_url && <img src={data.cover_url} className="w-full rounded-xl mb-4" />}
      <p className="mb-4">{data.short_desc}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: data.long_desc || ''}} />
      {data.skills?.length ? (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Compétences</h2>
          <ul className="flex flex-wrap gap-2">{data.skills.map((s:any)=><li key={s.id_skill} className="px-2 py-1 bg-gray-100 rounded">{s.name}</li>)}</ul>
        </div>
      ) : null}
      {data.images?.length ? (
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {data.images.map((img:any)=>(
            <img key={img.id_image} src={img.image_url} alt={img.alt_text||''} className="rounded-xl"/>
          ))}
        </div>
      ) : null}
    </article>
  )
}
