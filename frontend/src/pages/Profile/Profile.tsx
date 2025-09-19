import { useEffect, useState } from "react";
import * as api from "../../services/api";
import "./Profile.css";

type Props = {
  me: api.Me | null;
  onMe: (u: api.Me | null) => void;
};

export default function Profile({ me, onMe }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  // register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPwd, setRegPwd] = useState("");

  // profile update
  const [name, setName] = useState(me?.name ?? "");

  useEffect(() => {
    setName(me?.name ?? "");
  }, [me]);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const user = await api.login({ email: loginEmail, password: loginPwd });
      onMe(user);
    } catch (e: any) {
      setErr(e?.message || "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const user = await api.register({ name: regName, email: regEmail, password: regPwd });
      onMe(user);
    } catch (e: any) {
      setErr(e?.message || "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  const saveMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) return;
    setLoading(true); setErr(null);
    try {
      const updated = await api.updateProfile({ name });
      onMe(updated);
    } catch (e: any) {
      setErr(e?.message || "Mise à jour impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h1 className="title">Profil</h1>

      {err && <p className="error">{err}</p>}

      {!me ? (
        <div className="grid grid-cols-2 gap-4">
          <form id="login" className="card" onSubmit={doLogin}>
            <h3>Se connecter</h3>
            <label>Email</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            <label>Mot de passe</label>
            <input type="password" value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} required />
            <button className="btn" disabled={loading}>Connexion</button>
          </form>

          <form id="register" className="card" onSubmit={doRegister}>
            <h3>S’inscrire</h3>
            <label>Nom</label>
            <input value={regName} onChange={(e) => setRegName(e.target.value)} required />
            <label>Email</label>
            <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            <label>Mot de passe</label>
            <input type="password" value={regPwd} onChange={(e) => setRegPwd(e.target.value)} required />
            <button className="btn" disabled={loading}>Créer mon compte</button>
          </form>
        </div>
      ) : (
        <form className="card" onSubmit={saveMe}>
          <h3>Mon compte</h3>
          <label>Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Email</label>
          <input value={me.email} disabled />
          <button className="btn" disabled={loading}>Enregistrer</button>
        </form>
      )}
    </section>
  );
}
