import './CVs.css'
import { useEffect, useMemo, useRef, useState } from 'react'
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
type FormMode = 'none' | 'create' | 'edit'

function fileHref(file_url: string | null): string {
  if (!file_url) return '#'
  if (file_url.startsWith('http')) return file_url
  return `${import.meta.env.VITE_API_URL}${file_url}`
}

export default function CVs() {
  const { data, isLoading, error, refetch } = useCVs()
  const { data: meData } = useMe()
  const isAdmin = meData?.user?.role === 'admin'

  const items: CV[] = useMemo(() => data ?? [], [data])

  const [selected, setSelected] = useState<CV | null>(null)
  useEffect(() => {
    if (!items.length) { setSelected(null); return }
    const active = items.find(c => c.is_active)
    setSelected(active ?? items[0])
  }, [items])

  const [fullscreen, setFullscreen] = useState(false)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const [mode, setMode] = useState<FormMode>('none')
  const [editing, setEditing] = useState<CV | null>(null)
  const [form, setForm] = useState<FormState>({ label: '', locale: 'fr', file: null, is_active: false })
  const asideRef = useRef<HTMLDivElement>(null)
  const scrollAsideTop = () => setTimeout(() => asideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)

  const resetFormState = () => setForm({ label: '', locale: 'fr', file: null, is_active: false })

  const openCreate = () => {
    setMode('create')
    setEditing(null)
    resetFormState()
    scrollAsideTop()
  }
  const toggleCreate = () => {
    if (mode === 'create') {
      setMode('none'); setEditing(null); resetFormState()
    } else {
      openCreate() // passe en création même si on était en édition
    }
  }
  const openEdit = (cv: CV) => {
    setMode('edit')
    setEditing(cv)
    setForm({
      label: cv.label ?? '',
      locale: cv.locale || 'fr',
      file: null,
      is_active: !!cv.is_active
    })
    scrollAsideTop()
  }
  const closeForm = () => { setMode('none'); setEditing(null); resetFormState() }

  const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value, type, files, checked } = e.target
    if (type === 'file') setForm(f => ({ ...f, file: files && files[0] ? files[0] : null }))
    else if (type === 'checkbox') setForm(f => ({ ...f, [name]: checked }))
    else setForm(f => ({ ...f, [name]: value }))
  }
  const onChangeSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const submitCreate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!form.file) { alert('Veuillez choisir un fichier PDF'); return }
    const fd = new FormData()
    fd.append('file', form.file)
    fd.append('label', form.label || '')
    fd.append('locale', form.locale || 'fr')
    fd.append('is_active', form.is_active ? '1' : '0')
    await api.post('/cvs', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    closeForm()
    await refetch()
  }

  const submitUpdate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!editing) return
    const fd = new FormData()
    if (form.file) fd.append('file', form.file)
    if (form.label) fd.append('label', form.label)
    if (form.locale) fd.append('locale', form.locale)
    fd.append('is_active', form.is_active ? '1' : '0')
    await api.put(`/cvs/${editing.id_cv}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    closeForm()
    await refetch()
  }

  const makeActive = async (cv: CV) => {
    const fd = new FormData()
    fd.append('is_active', '1')
    await api.put(`/cvs/${cv.id_cv}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await refetch()
  }

  const removeCV = async (cv: CV) => {
    await api.delete(`/cvs/${cv.id_cv}`)
    if (selected?.id_cv === cv.id_cv) setSelected(null)
    await refetch()
    setConfirmId(null)
  }

  if (isLoading) return <p>Chargement…</p>
  if (error) {
    const msg = (error as any)?.response?.data?.error || (error as Error)?.message || 'Erreur inconnue'
    return <p>Erreur de chargement : {msg}</p>
  }

  const selectedHref = fileHref(selected?.file_url ?? null)

  return (
    <>
      <section className="cv-layout">
        <aside className="card cv-side" ref={asideRef}>
          <div className="cv-side__header">
            <h3 className="m-0">Mes CV</h3>

            {isAdmin && (
              <button
                className="icon-btn"
                aria-label={mode === 'create' ? 'Fermer le formulaire' : 'Ajouter un CV'}
                aria-expanded={mode === 'create'}
                onClick={toggleCreate}
                title={mode === 'create' ? 'Fermer' : 'Ajouter un CV'}
              >
                {mode === 'create' ? '–' : '+'}
              </button>
            )}
          </div>

          {/* Formulaire admin repliable (create | edit) */}
          {isAdmin && mode !== 'none' && (
            <section className="cv-admin cv-admin--inline">
              <h4 className="cv-admin__title">{mode === 'edit' ? 'Modifier un CV' : 'Ajouter un CV (PDF)'}</h4>

              <form onSubmit={mode === 'edit' ? submitUpdate : submitCreate} className="cv-form">
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
                    {mode === 'edit' ? 'Enregistrer' : 'Créer'}
                  </button>
                  <button type="button" className="btn btn-light" onClick={closeForm}>
                    Annuler
                  </button>
                </div>
              </form>
            </section>
          )}

          <ul className="cv-items">
            {items.map(cv => (
              <li key={cv.id_cv}>
                <button
                  className={`cv-item ${selected?.id_cv === cv.id_cv ? 'active' : ''}`}
                  onClick={() => setSelected(cv)}
                  title={cv.label || 'CV'}
                >
                  <span className="cv-item__title">{cv.label || 'CV'}</span>
                  <span className="cv-item__meta">
                    {(cv.locale || 'fr').toUpperCase()} {cv.is_active ? '• actif' : ''}
                  </span>
                </button>

                {isAdmin && selected?.id_cv === cv.id_cv && (
                  <div className="cv-admin-row mt-6">
                    {!cv.is_active && (
                      <button className="btn btn-light" onClick={() => makeActive(cv)}>
                        Rendre actif
                      </button>
                    )}
                    <button
                      className="btn btn-light"
                      onClick={() => openEdit(cv)}   // <- actif même si création ouverte
                      title="Modifier ce CV"
                    >
                      Modifier
                    </button>

                    {confirmId !== cv.id_cv ? (
                      <button className="btn btn-danger" onClick={() => setConfirmId(cv.id_cv)}>
                        Supprimer
                      </button>
                    ) : (
                      <div className="row">
                        <button className="btn btn-danger" onClick={() => removeCV(cv)}>Confirmer</button>
                        <button className="btn btn-light" onClick={() => setConfirmId(null)}>Annuler</button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <div className="cv-view">
          {selected ? (
            <>
              <div className="viewer-toolbar">
                <div>
                  <h3 className="m-0">{selected.label || 'CV'}</h3>
                  <small className="text-sm">
                    {(selected.locale || 'fr').toUpperCase()} {selected.is_active ? '• actif' : ''}
                  </small>
                </div>
                <div className="viewer-actions">
                  <button className="btn btn-light" onClick={() => setFullscreen(true)}>
                    Plein écran
                  </button>
                </div>
              </div>

              <div className="pdf-viewer pdf-viewer--full">
                <object data={selectedHref} type="application/pdf" width="100%" height="100%">
                  <iframe src={selectedHref} title={`CV ${selected.id_cv}`} style={{ width: '100%', height: '100%', border: 0 }} />
                </object>
              </div>
            </>
          ) : (
            <div className="card">Aucun CV sélectionné.</div>
          )}
        </div>
      </section>

      {fullscreen && selected && (
        <div className="fs-overlay" role="dialog" aria-modal="true">
          <div className="fs-bar">
            <span>{selected.label || 'CV'} — {(selected.locale || 'fr').toUpperCase()}</span>
            <div className="viewer-actions">
              <button className="btn btn-danger" onClick={() => setFullscreen(false)}>Fermer</button>
            </div>
          </div>
          <div className="fs-content">
            <object data={selectedHref} type="application/pdf" width="100%" height="100%">
              <iframe src={selectedHref} title="CV full" style={{ width: '100%', height: '100%', border: 0 }} />
            </object>
          </div>
        </div>
      )}
    </>
  )
}
