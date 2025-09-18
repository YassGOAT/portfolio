import { useEffect, useState } from "react";
import { api } from "../../services/api";

type Skill = { id_skill: number; name: string; category?: string | null; level?: number | null };

export default function Skills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.skills()
      .then(setItems)
      .catch(e => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des compétences…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h1>Compétences</h1>
      {items.length === 0 ? <p>Aucune compétence.</p> : (
        <ul>
          {items.map(s => (
            <li key={s.id_skill}>
              {s.name} {s.category ? `• ${s.category}` : ""} {s.level != null ? `• niveau ${s.level}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
