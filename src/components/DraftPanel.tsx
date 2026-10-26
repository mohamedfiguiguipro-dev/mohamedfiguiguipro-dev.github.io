import { useState } from 'react'
import { projects } from '../content/projects'
import { person } from '../content/site'

/** Panneau visible uniquement en aperçu : récapitule ce qui reste à fournir. */
export function DraftPanel() {
  const [open, setOpen] = useState(false)

  const items = [
    ...(person.cv ? [] : ['CV en PDF (aucun bouton de téléchargement tant qu’il manque)']),
    ...(person.links.length ? [] : ['Liens LinkedIn / GitHub (facultatifs)']),
    ...projects.flatMap((p) => (p.missing ?? []).map((m) => `${p.name} — ${m}`)),
  ]

  return (
    <aside className={`draft-panel${open ? ' is-open' : ''}`} aria-label="Aperçu : éléments manquants">
      <button type="button" aria-expanded={open} aria-controls="draft-list" onClick={() => setOpen((v) => !v)}>
        Aperçu · {items.length} éléments à fournir
      </button>
      <ul id="draft-list" hidden={!open}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  )
}
