import "./Contact.css";
import { useState } from "react";
import api from "../../services/api";

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
    setSending(true); setOk(null); setErr(null);
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
    <>
      <h1 className="page-title">Contact</h1>

      <form className="card contact-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label>Nom</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Sujet</label>
          <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button className="btn" disabled={sending}>
          {sending ? "Envoi..." : "Envoyer"}
        </button>

        {ok && <p className="status-ok">{ok}</p>}
        {err && <p className="status-err">{err}</p>}
      </form>
    </>
  );
}
