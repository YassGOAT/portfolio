import { useEffect, useState } from "react";
import * as api from "../../services/api";
import "./Presentation.css";

type Pres = api.Pres;

export default function Presentation() {
  const [data, setData] = useState<Pres | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const locale = "fr";
    api
      .presentation(locale)
      .then(setData)
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (err) return <p className="error">{err}</p>;

  return (
    <section className="page">
      <h1 className="title">{data?.headline || "Bienvenue sur mon portfolio 🚀"}</h1>
      <div className="content">
        {data?.content_md ? (
          <div dangerouslySetInnerHTML={{ __html: api.mdToHtml(data.content_md) }} />
        ) : (
          <p className="muted">Aucune présentation disponible pour l’instant.</p>
        )}
      </div>
    </section>
  );
}
