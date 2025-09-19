import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as api from "../../services/api";
import "./ProjectDetails.css";

type Detail = api.ProjectDetail;

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api
      .projectBySlug(slug)
      .then((d) => setData(d))
      .catch((e) => setErr(e?.message || "Projet introuvable"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return null;
  if (err) return <p className="error">{err}</p>;
  if (!data) return <p>Projet introuvable.</p>;

  return (
    <article className="project-details">
      <Link to="/projects" className="btn btn-light mb-4">← Retour</Link>

      <h1 className="title">{data.title}</h1>

      {data.cover_url && (
        <img className="cover" src={data.cover_url} alt={data.title} />
      )}

      {data.long_desc && (
        <p className="lead">{data.long_desc}</p>
      )}

      {data.images?.length ? (
        <>
          <h3 className="section-title">Images</h3>
          <div className="gallery-grid">
            {data.images.map((img) => (
              <img key={img.id_image} src={img.image_url} alt={img.alt_text || data.title} />
            ))}
          </div>
        </>
      ) : null}

      {data.skills?.length ? (
        <>
          <h3 className="section-title">Compétences</h3>
          <ul className="chips">
            {data.skills.map((s) => (
              <li className="chip" key={s.id_skill}>{s.name}</li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="links">
        {data.github_url && (
          <a href={data.github_url} target="_blank" rel="noreferrer" className="btn">Code</a>
        )}
        {data.demo_url && (
          <a href={data.demo_url} target="_blank" rel="noreferrer" className="btn">Démo</a>
        )}
      </div>
    </article>
  );
}
