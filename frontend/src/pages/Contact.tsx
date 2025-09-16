import { FormEvent, useState } from 'react'
import { useCertifications } from "../hooks/usePortfolio";

export default function Contact() {
  const m = useSendContact()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await m.mutateAsync({ name, email, message })
    setName(''); setEmail(''); setMessage('')
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-xl mx-auto space-y-3">
      <h1 className="text-xl font-bold">Me contacter</h1>

      <input className="w-full border rounded px-3 py-2" placeholder="Nom"
             value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={120} />
      <input className="w-full border rounded px-3 py-2" placeholder="Email"
             value={email} onChange={e=>setEmail(e.target.value)} required type="email" maxLength={190} />
      <textarea className="w-full border rounded px-3 py-2 h-32" placeholder="Message"
                value={message} onChange={e=>setMessage(e.target.value)} required maxLength={5000} />

      <button disabled={m.isPending} className="px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-60">
        {m.isPending ? 'Envoi…' : 'Envoyer'}
      </button>

      {m.isSuccess && <p className="text-green-600 text-sm">Message envoyé ✅</p>}
      {m.isError && <p className="text-red-600 text-sm">Erreur: {(m.error as any)?.response?.data?.error || 'réessaie'}</p>}
    </form>
  )
}
