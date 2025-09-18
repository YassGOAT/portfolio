import { useEffect, useState } from "react";
import { api } from "../../services/api";

type Me = {
  id_user: number;
  name: string;
  email: string;
  role: "admin" | "visitor";
  bio?: string | null;
  photo_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  other_links?: any;
};

export default function Profile() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // formulaire d’édition simple
  const [form, setForm] = useState<Partial<Me>>({});

  useEffect(() => {
    api.me()
      .then(({ user }) => {
        setMe(user);
        setForm({
          name: user?.name,
          bio: user?.bio,
          photo_url: user?.photo_url,
          linkedin_url: user?.linkedin_url,
          github_url: user?.github_url,
          other_links: user?.other_links,
        });
      })
      .catch(e => setErr(e?.message || "Non authentifié"))
      .finally(() => setLoading(false));
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(form);
      const { user } = await api.me();
      setMe(user);
      alert("Profil mis à jour");
    } catch (e: any) {
      alert(e?.message || "Erreur sauvegarde");
    }
  };

  if (loading) return <p>Chargement…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!me) return <p>Non connecté.</p>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1>Mon profil</h1>
      <p><strong>{me.name}</strong> — {me.email} — rôle: {me.role}</p>

      <form onSubmit={onSave} style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <label>Nom
          <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </label>
        <label>Bio
          <textarea value={form.bio || ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
        </label>
        <label>Photo URL
          <input value={form.photo_url || ""} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} />
        </label>
        <label>LinkedIn
          <input value={form.linkedin_url || ""} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} />
        </label>
        <label>GitHub
          <input value={form.github_url || ""} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} />
        </label>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
