import './CVs.css'
import { useMemo, useState } from 'react'
import { useCVs } from '../../hooks/usePortfolio'
import { useMe } from '../../hooks/useAuth'
import { api } from '../../lib/http'
import type { CV } from '../../types'

type FormState = {
  label: string
  locale: string
  file_url: string
  is_active: boolean
}

export default function CVs() {
  const { data, isLoading, error, refetch } = useCVs()
  const { data: meData } = useMe()
  const isAdmin = meData?.user?.role === 'admin'

  const items: CV[] = useMemo(() => data ?? [], [data])

  const [editing, setEditing] = useState<CV | null>(null)
  const [form, setForm] = useState<FormState>({
    label: '',
    locale: 'fr',
    file_url: '',
    is_active: false
  })

  const resetForm = () => {
    setEditing(null)
    setForm({ label: '', locale: 'fr', file_url: '', is_active: false })
  }

  // Handlers typés
  const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }
  const onChangeSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }
  const onChangeCheckbox: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, checked } = e.target
    setForm((f) => ({ ...f, [name]: checked }))
  }

  const submitCreate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    await api.post('/cvs', {
      label: form.label || null,
      locale: form.locale || 'fr',
      file_url: form.file_url,
      is_active: form.is_active ? 1 : 0
    })
    resetForm()
    await refetch()
  }

  const submitUpdate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!editing) return
    await api.put(`/cvs/${editing.id_cv}`, {
      label: form.label || null,
      locale: form.locale || 'fr',
      file_url: form.file_url || null,
      is_active: form.is_active ? 1 : 0
    })
    resetForm()
    await refetch()
  }

  const makeActive = async (cv: CV) => {
    await api.put(`/cvs/${cv.id_cv}`, { is_active: 1 })
    await refetch()
  }

  const removeCV = async (cv: CV) => {
    if (!confirm('Supprimer ce CV ?')) return
    await api.delete(`/cvs/${cv.id_cv}`)
    await refetch()
  }

  const startEdit = (cv: CV) => {
    setEditing(cv)
    setForm({
      label: cv.label ?? '',
      locale: cv.locale || 'fr',
      file_url: cv.file_url,
      is_active: !!cv.is_active
    })
  }

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur de chargement.</p>

  return (
    <>
      {isAdmin && (
        <section className="card cv-admin">
          <h2 className="cv-admin__title">{editing ? 'Modifier un CV' : 'Ajouter un CV'}</h2>

          <form onSubmit={editing ? submitUpdate : submitCreate} className="cv-form">
            <label>
              <span>Label</span>
              <input
                name="label"
                className="input"
                value={form.label}
                onChange={onChangeInput}
                placeholder="CV FR / CV EN"
              />
            </label>

            <label>
              <span>Langue</span>
              <select name="locale" className="input" value={form.locale} onChange={onChangeSelect}>
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </label>

            <label className="full">
              <span>URL du fichier (PDF)</span>
              <input
                name="file_url"
                className="input"
                value={form.file_url}
                onChange={onChangeInput}
                required
                placeholder="https://…/cv.pdf"
              />
            </label>

            <label className="row">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={onChangeCheckbox}
              />
              <span>Définir comme CV actif</span>
            </label>

            <div className="cv-actions">
              <button className="btn" type="submit">
                {editing ? 'Enregistrer' : 'Créer'}
              </button>
              {editing && (
                <button type="button" className="btn btn-light" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <ul className="grid grid-cols-2 gap-24 cv-list">
        {items.map((cv) => (
          <li key={cv.id_cv} className="card cv-card">
            <div className="cv-head">
              <div>
                <h3 className="cv-title">{cv.label || 'CV'}</h3>
                <p className="cv-sub">
                  {(cv.locale || 'fr').toUpperCase()} {cv.is_active ? '• actif' : ''}
                </p>
              </div>
              <a className="btn" href={cv.file_url} target="_blank" rel="noreferrer">
                Télécharger
              </a>
            </div>

            {isAdmin && (
              <div className="cv-admin-row">
                {!cv.is_active && (
                  <button className="btn btn-light" onClick={() => makeActive(cv)}>
                    Rendre actif
                  </button>
                )}
                <button className="btn btn-light" onClick={() => startEdit(cv)}>
                  Modifier
                </button>
                <button className="btn btn-danger" onClick={() => removeCV(cv)}>
                  Supprimer
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
