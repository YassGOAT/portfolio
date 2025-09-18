import { useEffect, useState } from "react";
import * as api from "../../services/api";
import "./CVs.css";

type Cv = api.Cv;

export default function CVs({ me }: { me: api.Me | null }) {
  const [items, setItems] = useState<Cv[]>([]);
  const [active, setActive] = useState<Cv | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [fs, setFs] = useState(false);

  useEffect(() => {
    api
      .cvs()
      .then((rows) => {
        const list: Cv[] = Array.isArray(rows) ? rows : [];
        setItems(list);
        setActive(list.find((x) => x.is_active === 1) || list[0] || null);
      })
      .catch((e) => setErr(e?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (err) return <p className="error">{err}</p>;

  return (
    <section className="page">
      <h1 className="title">CVs</h1>

      {items.length === 0 ? (
        <p>Aucun CV pour le moment.</p>
      ) : (
        <>
          <div className="cv-list">
            {items.map((cv) => (
              <button
                key={cv.id_cv}
                className={cv.id_cv === active?.id_cv ? "btn active" : "btn"}
                onClick={() => setActive(cv)}
              >
                {cv.locale?.toUpperCase() || "CV"}
              </button>
            ))}
          </div>

          {active && (
            <div className={fs ? "cv-viewer fullscreen" : "cv-viewer"}>
              <iframe src={active.file_url} title="CV" />
              <div className="cv-actions">
                <a href={active.file_url} target="_blank" rel="noopener" className="btn">
                  Ouvrir
                </a>
                <button className="btn" onClick={() => setFs((v) => !v)}>
                  {fs ? "Quitter le plein écran" : "Plein écran"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
