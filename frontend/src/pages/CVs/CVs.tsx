import './CVs.css'
import { useMemo, useState } from 'react'
import { useCVs } from '../../hooks/usePortfolio'
import { useMe } from '../../hooks/useAuth'
import { api } from '../../lib/http'
import type { CV } from '../../types'

type FormState = {
  label: string
  locale: string
  file: File | null
  is_active: boolean
}

function fileHref(file_url: string | null): string {
  if (!file_url) return '#'
  if (file_url.startsWith('http')) return file_url
  return `${import.meta.env.VITE_API_URL}${file_url}` // ex: http://localhost:5000/uploads/cv/xxx.pdf
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
    file: null,
    is_active: false
  })

  const resetForm = () => {
    setEditing(null)
    setForm({ label: '', locale: 'fr', file: null, is_active: false })
  }

  // Handlers typés
  const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value, type, files, checked } = e.target
    if (type === 'file') {
      setForm((f) => ({ ...f, file: files && files[0] ? files[0] : null }))
    } else if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }
  const onChangeSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submitCreate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!form.file) {
      alert('Veuillez choisir un fichier PDF')
      return
    }
    const fd = new FormData()
    fd.append('file', form.file)
    fd.append('label', form.label || '')
    fd.append('locale', form.locale || 'fr')
    fd.append('is_active', form.is_active ? '1' : '0')

    await api.post('/cvs', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    resetForm()
    await refetch()
  }

  const submitUpdate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!editing) return
    const fd = new FormData()
    if (form.file) fd.append('file', form.file)          // optionnel
    if (form.label) fd.append('label', form.label)
    if (form.locale) fd.append('locale', form.locale)
    fd.append('is_active', form.is_active ? '1' : '0')

    await api.put(`/cvs/${editing.id_cv}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    resetForm()
    await refetch()
  }

  const makeActive = async (cv: CV) => {
    const fd = new FormData()
    fd.append('is_active', '1')
    await api.put(`/cvs/${cv.id_cv}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
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
      file: null, // on ne précharge pas le fichier
      is_active: !!cv.is_active
    })
  }

  if (isLoading) return <p>Chargement…</p>
  if (error) {
    const msg = (error as any)?.response?.data?.error || (error as Error)?.message || 'Erreur inconnue'
    return <p>Erreur de chargement : {msg}</p>
  }

  return (
    <>
      {isAdmin && (
        <section className="card cv-admin">
          <h2 className="cv-admin__title">{editing ? 'Modifier un CV' : 'Ajouter un CV (PDF)'}</h2>

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
              <span>Fichier PDF</span>
              <input
                name="file"
                type="file"
                accept="application/pdf"
                className="input"
                onChange={onChangeInput}
              />
              {form.file && <small className="text-sm">Sélectionné : {form.file.name}</small>}
            </label>

            <label className="row">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={onChangeInput}
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
        {items.map((cv) => {
          const href = fileHref(cv.file_url)
          return (
            <li key={cv.id_cv} className="card cv-card">
              <div className="cv-head">
                <div>
                  <h3 className="cv-title">{cv.label || 'CV'}</h3>
                  <p className="cv-sub">
                    {(cv.locale || 'fr').toUpperCase()} {cv.is_active ? '• actif' : ''}
                  </p>
                </div>
                <a className="btn" href={href} target="_blank" rel="noreferrer" download>
                  Télécharger
                </a>
              </div>

              {/* Visionneuse PDF directement visible */}
              <div className="pdf-viewer">
                <object data={href} type="application/pdf" width="100%" height="70vh">
                  <iframe src={href} title={`CV ${cv.id_cv}`} style={{ width:'100%', height:'70vh', border:0 }} />
                </object>
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
          )
        })}
      </ul>
    </>
  )
}
