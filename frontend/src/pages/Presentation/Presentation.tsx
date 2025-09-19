import { useEffect, useState } from "react";
import * as api from "../../services/api";
import "./Presentation.css";

export default function Presentation() {
  const [data, setData] = useState<api.Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .presentation("fr")
      .then((d) => setData(d))
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (err) return <p className="error">{err}</p>;

  return (
    <section className="page">
      <h1 className="title">{data?.headline || "Bienvenue sur mon portfolio 🚀"}</h1>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: api.mdToHtml(data?.content_md) }}
      />
    </section>
  );
}
