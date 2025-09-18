import { useEffect, useState } from "react";
import * as api from "../../services/api";
import "./Profile.css";

type Props = { me: api.Me; onMe: (m: api.Me | null) => void };

export default function Profile({ me, onMe }: Props) {
  // si jamais tu gardes ce composant quand non connecté:
  if (!me) return null;

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPwd, setRegPwd] = useState("");

  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setName(me.name);
    setEmail(me.email);
  }, [me]);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErr(null);
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
    try {
      setLoading(true);
      setErr(null);
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
    try {
      setLoading(true);
      setErr(null);
      const updated = await api.updateProfile({ name, email });
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

      <form className="card" onSubmit={saveMe}>
        <h3>Mes infos</h3>
        <label>
          Nom
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button className="btn" disabled={loading}>
          Sauvegarder
        </button>
      </form>

      <div className="grid grid-2">
        <form className="card" onSubmit={doLogin}>
          <h3>Connexion</h3>
          <label>
            Email
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          </label>
          <label>
            Mot de passe
            <input type="password" value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} />
          </label>
          <button className="btn" disabled={loading}>
            Se connecter
          </button>
        </form>

        <form className="card" onSubmit={doRegister}>
          <h3>Inscription</h3>
          <label>
            Nom
            <input value={regName} onChange={(e) => setRegName(e.target.value)} />
          </label>
          <label>
            Email
            <input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
          </label>
          <label>
            Mot de passe
            <input type="password" value={regPwd} onChange={(e) => setRegPwd(e.target.value)} />
          </label>
          <button className="btn" disabled={loading}>
            S’inscrire
          </button>
        </form>
      </div>
    </section>
  );
}
