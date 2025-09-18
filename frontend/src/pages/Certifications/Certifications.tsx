import "./Certifications.css";
import api from "../../services/api";
import { useEffect, useState } from "react";

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
      .then((rows) => setItems(Array.isArray(rows) ? rows : []))
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (err) return <p style={{ color: "#dc2626" }}>{err}</p>;

  return (
    <>
      <h1 className="page-title">Certifications</h1>
      {!items.length ? (
        <p>Aucune certification pour le moment.</p>
      ) : (
        <div className="cert-list">
          {items.map((c) => (
            <article key={c.id_certification} className="cert">
              <h3 className="cert-title">{c.title}</h3>
              {(c.issuer || c.issue_date) && (
                <p className="cert-sub">
                  {c.issuer && <span>{c.issuer}</span>}
                  {c.issuer && c.issue_date && " • "}
                  {c.issue_date && <span>{new Date(c.issue_date).toLocaleDateString()}</span>}
                </p>
              )}
              {c.credential_url && (
                <div className="cert-actions">
                  <a href={c.credential_url} target="_blank">Voir le certificat</a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
