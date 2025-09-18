import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../services/api";
import "./Projects.css";

type Project = api.Project;

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .projects()
      .then((rows) => setItems(rows))
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (err) return <p className="error">{err}</p>;

  return (
    <section className="page">
      <h1 className="title">Projets</h1>

      {items.length === 0 ? (
        <p>Aucun projet pour le moment.</p>
      ) : (
        <div className="grid grid-cols-3">
          {items.map((p) => (
            <Link key={p.id_project} to={`/projects/${p.slug}`} className="card project-card">
              {p.cover_url && <img src={p.cover_url} alt={p.title} />}
              <h3 className="project-title">{p.title}</h3>
              {p.short_desc && <p className="project-desc">{p.short_desc}</p>}
              <div className="project-meta">
                {p.github_url && (
                  <a
                    href={p.github_url}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener"
                  >
                    Code
                  </a>
                )}
                {p.demo_url && (
                  <a
                    href={p.demo_url}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener"
                  >
                    Démo
                  </a>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
