import { useEffect, useState } from "react";
import { api } from "../../services/api";

type Cert = {
  id_certification: number;
  title: string;
  issuer?: string | null;
  issue_date?: string | null;
  credential_url?: string | null;
};

export default function Certifications() {
  const [items, setItems] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.certifications()
      .then(setItems)
      .catch(e => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des certifications…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <h1>Certifications</h1>
      {items.length === 0 ? <p>Aucune certification.</p> : (
        <ul style={{ padding: 0 }}>
          {items.map(c => (
            <li key={c.id_certification} style={{ listStyle: "none", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <strong>{c.title}</strong>
              {c.issuer && <> • {c.issuer}</>}
              {c.issue_date && <> — {new Date(c.issue_date).toLocaleDateString()}</>}
              {c.credential_url && (
                <>
                  {" "}- <a href={c.credential_url} target="_blank" rel="noreferrer">Voir la certification</a>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
