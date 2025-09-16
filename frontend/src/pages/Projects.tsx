import { useState } from 'react'
import { useProjects } from '../hooks/usePortfolio';
import { Link } from 'react-router-dom'

export default function Projects() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useProjects({ page, limit: 6 })
  if (isLoading) return <p>Chargement…</p>

  return (
    <section>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((p:any)=>(
          <Link to={`/projects/${p.slug}`} key={p.id_project} className="card hover:shadow-lg transition">
            <img src={p.cover_url || ''} alt="" className="w-full h-40 object-cover rounded-xl mb-3"/>
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{p.short_desc}</p>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Préc.</button>
        <span className="px-3 py-1">{page}/{data?.totalPages ?? 1}</span>
        <button disabled={page>=(data?.totalPages ?? 1)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Suiv.</button>
      </div>
    </section>
  )
}
