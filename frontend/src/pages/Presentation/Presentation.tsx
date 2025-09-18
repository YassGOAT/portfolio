import { useEffect, useState } from "react";
import { api } from "../../services/api";

type Pres = { id_presentation: number; locale: string; headline?: string | null; content_md?: string | null };

export default function Presentation() {
  const [data, setData] = useState<Pres | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // adapte si tu veux lire une autre locale (en, fr…)
  const locale = "fr";

  useEffect(() => {
    api.presentation(locale)
      .then(setData)
      .catch(e => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <h1>{data?.headline || "Présentation"}</h1>
      {data?.content_md ? (
        <pre style={{ whiteSpace: "pre-wrap", font: "inherit" }}>{data.content_md}</pre>
      ) : (
        <p>Aucune présentation pour le moment.</p>
      )}
    </div>
  );
}
