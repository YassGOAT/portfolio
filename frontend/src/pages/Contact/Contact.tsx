import './Contact.css'
import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { useSendContact } from '../../hooks/usePortfolio'

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined
    return data?.error ?? err.message
  }
  if (err instanceof Error) return err.message
  return 'Une erreur est survenue'
}

export default function Contact() {
  const m = useSendContact()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await m.mutateAsync({ name, email, message })
    setName(''); setEmail(''); setMessage('')
  }

  return (
    <form onSubmit={onSubmit} className="card contact-form">
      <h1 className="form-title">Me contacter</h1>

      <input
        className="input"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={120}
      />

      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
        maxLength={190}
      />

      <textarea
        className="textarea"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        maxLength={5000}
      />

      <button className="btn" disabled={m.isPending}>
        {m.isPending ? 'Envoi…' : 'Envoyer'}
      </button>

      {m.isSuccess && <p className="status-ok">Message envoyé ✅</p>}
      {m.isError && <p className="status-err">Erreur : {getErrorMessage(m.error)}</p>}
    </form>
  )
}
