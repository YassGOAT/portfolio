import { useCertifications } from "../hooks/usePortfolio";

export default function Certifications() {
  const { data, isLoading } = useCertifications()
  if (isLoading) return <p>Chargement…</p>
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {data?.map((c:any)=>(
        <div key={c.id_certification} className="card">
          <h3 className="font-semibold">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.issuer} • {c.issue_date?.slice(0,10)}</p>
          {c.credential_url && <a className="text-blue-600 underline text-sm mt-2 inline-block" href={c.credential_url} target="_blank">Voir le certificat</a>}
          {c.description && <p className="mt-2">{c.description}</p>}
        </div>
      ))}
    </div>
  )
}
