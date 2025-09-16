import './Skills.css'
import { useSkills } from '../../hooks/usePortfolio'
import type { Skill } from '../../types'

export default function Skills() {
  const { data, isLoading, error } = useSkills()
  if (isLoading) return <p>Chargement…</p>
  if (error) return <p>Erreur de chargement.</p>

  const groups = (data ?? []).reduce<Record<string, Skill[]>>((acc, s) => {
    const key = s.category || 'Autres'
    ;(acc[key] ||= []).push(s)
    return acc
  }, {})

  return (
    <div className="grid grid-cols-2 gap-24">
      {Object.entries(groups).map(([cat, items]) => (
        <section key={cat} className="card">
          <h2 className="block-title">{cat}</h2>
          <ul className="skills">
            {items.map((s) => (
              <li key={s.id_skill} className="skill">
                <span>{s.name}</span>
                {s.level != null && <span className="level">{s.level}%</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
