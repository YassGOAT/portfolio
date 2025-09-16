import './Profile.css'
import { useState } from 'react'
import { useLogin, useMe, useRegister, logout } from '../../hooks/useAuth'
import { api } from '../../lib/http'
import { useSearchParams } from 'react-router-dom'

export default function Profile() {
  const me = useMe()
  const reg = useRegister()
  const log = useLogin()

  const [sp, setSp] = useSearchParams()
  const initialTab = sp.get('t') === 'register' ? 'register' : 'login'
  const [tab, setTab] = useState<'login' | 'register'>(initialTab as 'login' | 'register')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const switchTab = (t: 'login' | 'register') => {
    setTab(t)
    setSp({ t })
  }

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await reg.mutateAsync({ name, email, password })
    setName(''); setEmail(''); setPassword('')
  }

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await log.mutateAsync({ email, password })
    setEmail(''); setPassword('')
  }

  const onDeleteMe = async () => {
    if (!confirm('Supprimer votre compte ? Cette action est irréversible.')) return
    await api.delete('/auth/me')
    logout()
    location.reload()
  }

  if (me.isLoading) return <p>Chargement…</p>

  const u = me.data?.user
  if (u) {
    return (
      <section className="card profile">
        <h1 className="title">Mon profil</h1>
        <p><b>Nom :</b> {u.name}</p>
        <p><b>Email :</b> {u.email}</p>
        <p><b>Rôle :</b> {u.role}</p>

        <div className="row">
          <button className="btn" onClick={() => { logout(); location.reload() }}>
            Se déconnecter
          </button>
          <button className="btn btn-danger" onClick={onDeleteMe}>
            Supprimer mon compte
          </button>
        </div>

        {u.role === 'admin' && (
          <p className="admin-note">
            Vous êtes connecté en <b>admin</b> — les boutons d’admin (ex: CRUD CV) sont visibles sur la page CV.
          </p>
        )}
      </section>
    )
  }

  // Non connecté : onglets Connexion / Inscription
  return (
    <section className="card profile">
      <div className="tabs">
        <button className={tab === 'login' ? 'tab active' : 'tab'} onClick={() => switchTab('login')}>
          Se connecter
        </button>
        <button className={tab === 'register' ? 'tab active' : 'tab'} onClick={() => switchTab('register')}>
          S’inscrire
        </button>
      </div>

      {tab === 'login' ? (
        <form onSubmit={onLogin} className="form">
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
          <input className="input" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
          <button className="btn" disabled={log.isPending}>{log.isPending ? 'Connexion…' : 'Se connecter'}</button>
          {log.isError && <p className="error">{(log.error as any)?.response?.data?.error || 'Erreur'}</p>}
        </form>
      ) : (
        <form onSubmit={onRegister} className="form">
          <input className="input" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} required minLength={2} />
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
          <input className="input" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
          <button className="btn" disabled={reg.isPending}>{reg.isPending ? 'Création…' : 'Créer mon compte'}</button>
          {reg.isError && <p className="error">{(reg.error as any)?.response?.data?.error || 'Erreur'}</p>}
        </form>
      )}
    </section>
  )
}
