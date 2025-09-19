import { useEffect, useState } from "react";
import * as api from "../../services/api";
import "./Skills.css";

type Skill = api.Skill;

export default function Skills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .skills()
      .then((rows) => setItems(Array.isArray(rows) ? rows : []))
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (err) return <p className="error">{err}</p>;

  return (
    <section className="page">
      <h1 className="title">Compétences</h1>

      {items.length === 0 ? (
        <p>Aucune compétence pour le moment.</p>
      ) : (
        <ul className="skills">
          {items.map((s) => (
            <li key={s.id_skill} className="skill">
              <span className="name">{s.name}</span>
              {s.level != null && <span className="level">Niveau {s.level}</span>}
              {s.category && <span className="cat">{s.category}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
