import { useEffect, useState } from "react";
import * as api from "../../services/api";
import "./Profile.css";

export default function Profile() {
  const [me, setMe] = useState<api.Session>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPwd, setRegPwd] = useState("");

  // Update
  const [name, setName] = useState("");

  useEffect(() => {
    api
      .me()
      .then((u) => {
        setMe(u);
        setName(u?.name || "");
      })
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { user } = await api.login({ email: loginEmail, password: loginPwd });
      setMe(user);
      setName(user?.name || "");
    } catch (e: any) {
      setErr(e?.message || "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { user } = await api.register({ name: regName, email: regEmail, password: regPwd });
      setMe(user);
      setName(user?.name || "");
    } catch (e: any) {
      setErr(e?.message || "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  const saveMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) return;
    setLoading(true);
    setErr(null);
    try {
      const { user } = await api.updateProfile({ name });
      setMe(user);
    } catch (e: any) {
      setErr(e?.message || "Mise à jour impossible");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="page">
      <h1 className="title">Profil</h1>
      {err && <p className="error">{err}</p>}

      {!me ? (
        <div className="grid grid-cols-2 gap-4">
          <form onSubmit={doLogin} className="card">
            <h3>Se connecter</h3>
            <label>Email</label>
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            <label>Mot de passe</label>
            <input type="password" value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} required />
            <button className="btn">Connexion</button>
          </form>

          <form onSubmit={doRegister} className="card">
            <h3>S’inscrire</h3>
            <label>Nom</label>
            <input value={regName} onChange={(e) => setRegName(e.target.value)} required />
            <label>Email</label>
            <input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            <label>Mot de passe</label>
            <input type="password" value={regPwd} onChange={(e) => setRegPwd(e.target.value)} required />
            <button className="btn">Créer mon compte</button>
          </form>
        </div>
      ) : (
        <form onSubmit={saveMe} className="card">
          <h3>Mon profil</h3>
          <label>Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Email</label>
          <input value={me.email || ""} disabled />
          <button className="btn">Enregistrer</button>
        </form>
      )}
    </section>
  );
}
