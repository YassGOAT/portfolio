import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../services/api";

type ProjectDetail = {
  id_project: number;
  title: string;
  slug: string;
  long_desc?: string | null;
  cover_url?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  images?: Array<{ id_image: number; image_url: string; alt_text?: string | null }>;
  skills?: Array<{ id_skill: number; name: string; category?: string | null; level?: number | null }>;
};

export default function ProjectDetails() {
  const { slug = "" } = useParams();
  const [data, setData] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.projectBySlug(slug)
      .then(setData)
      .catch(e => setErr(e?.message || "Projet introuvable"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!slug) return <p>Slug manquant.</p>;
  if (loading) return <p>Chargement…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!data) return <p>Projet introuvable.</p>;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <Link to="/projects">← Retour</Link>
      <h1>{data.title}</h1>

      {data.cover_url && (
        <img src={data.cover_url} alt={data.title} style={{ width: "100%", borderRadius: 12, margin: "12px 0" }} />
      )}

      {data.long_desc && <p style={{ whiteSpace: "pre-line" }}>{data.long_desc}</p>}

      {(data.github_url || data.demo_url) && (
        <p style={{ marginTop: 12 }}>
          {data.github_url && <a href={data.github_url} target="_blank" rel="noreferrer">GitHub</a>}{" "}
          {data.demo_url && <> • <a href={data.demo_url} target="_blank" rel="noreferrer">Demo</a></>}
        </p>
      )}

      {data.skills && data.skills.length > 0 && (
        <>
          <h3>Compétences</h3>
          <ul>
            {data.skills.map(s => <li key={s.id_skill}>{s.name}</li>)}
          </ul>
        </>
      )}

      {data.images && data.images.length > 0 && (
        <>
          <h3>Galerie</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
            {data.images.map(img => (
              <img key={img.id_image} src={img.image_url} alt={img.alt_text || ""} style={{ width: "100%", borderRadius: 8 }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
