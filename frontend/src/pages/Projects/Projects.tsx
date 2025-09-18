import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

type Project = {
  id_project: number;
  title: string;
  slug: string;
  short_desc?: string | null;
  cover_url?: string | null;
  is_featured: 0 | 1;
  created_at: string;
};

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.projects()
      .then(setItems)
      .catch(e => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des projets…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      <h1>Projets</h1>
      {items.length === 0 ? (
        <p>Aucun projet pour le moment.</p>
      ) : (
        <ul style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", padding: 0 }}>
          {items.map(p => (
            <li key={p.id_project} style={{ listStyle: "none", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              {p.cover_url && (
                <img src={p.cover_url} alt={p.title} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
              )}
              <h3 style={{ marginTop: 8 }}>{p.title}</h3>
              {p.short_desc && <p style={{ color: "#6b7280" }}>{p.short_desc}</p>}
              <Link to={`/projects/${p.slug}`}>Voir le projet</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
