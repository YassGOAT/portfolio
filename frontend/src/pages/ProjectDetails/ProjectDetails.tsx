// src/pages/ProjectDetails/ProjectDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as api from "../../services/api";
import "./ProjectDetails.css";

/** Type détaillé pour cette page (étend le type de base) */
type ProjectDetail = api.Project & {
  long_desc?: string | null;
  images?: { id_image: number; image_url: string; alt_text?: string | null }[];
  skills?: { id_skill: number; name: string; category?: string | null; level?: number | null }[];
};

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setErr("Projet introuvable");
      setLoading(false);
      return;
    }
    api
      .projectBySlug(slug)
      .then((p) => setData(p as ProjectDetail)) // l’API renvoie au moins ces champs
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return null;
  if (err) return <p className="error">{err}</p>;
  if (!data) return <p>Projet introuvable.</p>;

  return (
    <article className="project-details">
      <Link to="/projects" className="btn btn-light mb-4">
        ← Retour
      </Link>

      <h1 className="title">{data.title}</h1>

      {data.cover_url && (
        <img className="cover" src={data.cover_url} alt={data.title} />
      )}

      {data.long_desc && <p className="lead">{data.long_desc}</p>}

      {/* IMAGES */}
      {data.images?.length ? (
        <>
          <h3 className="section-title">Images</h3>
          <div className="gallery-grid">
            {data.images.map((img) => (
              <img
                key={img.id_image}
                src={img.image_url}
                alt={img.alt_text || data.title}
              />
            ))}
          </div>
        </>
      ) : null}

      {/* COMPÉTENCES */}
      {data.skills?.length ? (
        <>
          <h3 className="section-title">Compétences</h3>
          <ul className="chiplist">
            {data.skills.map((s) => (
              <li className="chip" key={s.id_skill}>
                {s.name}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/* Liens externes */}
      {(data.github_url || data.demo_url) && (
        <div className="project-links">
          {data.github_url && (
            <a href={data.github_url} target="_blank" rel="noopener">
              Code
            </a>
          )}
          {data.demo_url && (
            <a href={data.demo_url} target="_blank" rel="noopener">
              Démo
            </a>
          )}
        </div>
      )}
    </article>
  );
}
