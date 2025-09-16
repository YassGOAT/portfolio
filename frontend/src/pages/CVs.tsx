import { useCVs } from '../hooks/usePortfolio';

export default function CVs() {
  const { data, isLoading } = useCVs()
  if (isLoading) return <p>Chargement…</p>
  return (
    <ul className="grid sm:grid-cols-2 gap-4">
      {data?.map((cv:any)=>(
        <li key={cv.id_cv} className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{cv.label || 'CV'}</h3>
              <p className="text-sm text-gray-600">{cv.locale.toUpperCase()} {cv.is_active ? '• actif' : ''}</p>
            </div>
            <a href={cv.file_url} target="_blank" className="px-3 py-2 rounded bg-gray-900 text-white">Télécharger</a>
          </div>
        </li>
      ))}
    </ul>
  )
}
