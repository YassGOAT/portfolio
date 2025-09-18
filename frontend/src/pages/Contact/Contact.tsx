import { useState } from "react";
import { api } from "../../services/api";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setOk(null);
    setErr(null);
    try {
      await api.sendContact({ name, email, subject, message });
      setOk("Message envoyé ✅");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (e: any) {
      setErr(e?.message || "Erreur d’envoi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: 16 }}>
      <h1>Contact</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>Nom
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Sujet
          <input value={subject} onChange={e => setSubject(e.target.value)} />
        </label>
        <label>Message
          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={6} />
        </label>
        <button type="submit" disabled={sending}>{sending ? "Envoi…" : "Envoyer"}</button>
        {ok && <p style={{ color: "green" }}>{ok}</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>
    </div>
  );
}
