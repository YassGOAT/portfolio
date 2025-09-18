import "./Skills.css";
import api from "../../services/api";
import { useEffect, useState } from "react";

type Skill = { id_skill: number; name: string; category?: string | null; level?: number | null };

export default function Skills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.skills()
      .then((rows) => setItems(Array.isArray(rows) ? rows : []))
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (err) return <p style={{ color: "#dc2626" }}>{err}</p>;

  return (
    <>
      <h1 className="page-title">Compétences</h1>
      {!items.length ? (
        <p>Aucune compétence pour le moment.</p>
      ) : (
        <ul className="skills">
          {items.map((s) => (
            <li key={s.id_skill} className="skill">
              <span>{s.name}</span>
              {s.level != null && <span className="level">Niveau {s.level}</span>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
