import { useSkills } from '../hooks/usePortfolio';

export default function Skills() {
  const { data, isLoading } = useSkills()
  if (isLoading) return <p>Chargement…</p>
  const groups = Object.groupBy?.(data, (s:any)=>s.category || 'Autres') ?? {}
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.entries(groups).map(([cat, items])=>(
        <div key={cat} className="card">
          <h2 className="font-semibold mb-3">{cat}</h2>
          <ul className="grid grid-cols-2 gap-2">
            {items?.map((s:any)=>(
              <li key={s.id_skill} className="p-2 rounded bg-gray-100">{s.name}{s.level!=null && ` (${s.level}%)`}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
