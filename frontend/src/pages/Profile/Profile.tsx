import './Profile.css'
import { useState } from 'react'
import { useLogin, useMe, useRegister, logout } from '../../hooks/useAuth'
import { api } from '../../lib/http'

type View = 'choose' | 'login' | 'register'

export default function Profile() {
  const me = useMe()
  const reg = useRegister()
  const log = useLogin()

  // Vue par défaut : question Oui/Non
  const [view, setView] = useState<View>('choose')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [confirmDelete, setConfirmDelete] = useState(false)

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

          {!confirmDelete ? (
            <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
              Supprimer mon compte
            </button>
          ) : (
            <div className="confirm">
              <span>Confirmer la suppression ?</span>
              <div className="row">
                <button className="btn btn-danger" onClick={onDeleteMe}>Oui</button>
                <button className="btn btn-light" onClick={() => setConfirmDelete(false)}>Non</button>
              </div>
            </div>
          )}
        </div>

        {u.role === 'admin' && (
          <p className="admin-note">
            Vous êtes connecté en <b>admin</b> — les boutons d’admin (ex: CRUD CV) sont visibles sur la page CV.
          </p>
        )}
      </section>
    )
  }

  // Non connecté
  return (
    <section className="card profile">
      {view === 'choose' ? (
        <div className="choose">
          <h1 className="title">Avez-vous déjà un compte ?</h1>
          <div className="row">
            <button className="btn" onClick={() => setView('login')}>Oui</button>
            <button className="btn btn-light" onClick={() => setView('register')}>Non</button>
          </div>
        </div>
      ) : view === 'login' ? (
        <>
          <h1 className="title">Se connecter</h1>
          <form onSubmit={onLogin} className="form">
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
            <input className="input" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
            <div className="row">
              <button className="btn" disabled={log.isPending}>{log.isPending ? 'Connexion…' : 'Se connecter'}</button>
              <button type="button" className="btn btn-light" onClick={() => setView('register')}>Créer un compte</button>
            </div>
            {log.isError && <p className="error">{(log.error as any)?.response?.data?.error || 'Erreur'}</p>}
          </form>
        </>
      ) : (
        <>
          <h1 className="title">Créer un compte</h1>
          <form onSubmit={onRegister} className="form">
            <input className="input" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} required minLength={2} />
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
            <input className="input" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
            <div className="row">
              <button className="btn" disabled={reg.isPending}>{reg.isPending ? 'Création…' : 'Créer mon compte'}</button>
              <button type="button" className="btn btn-light" onClick={() => setView('login')}>J’ai déjà un compte</button>
            </div>
            {reg.isError && <p className="error">{(reg.error as any)?.response?.data?.error || 'Erreur'}</p>}
          </form>
        </>
      )}
    </section>
  )
}
