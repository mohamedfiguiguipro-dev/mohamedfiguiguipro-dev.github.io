import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { projects } from '../content/projects'
import { projectsIntro } from '../content/site'
import type { Project, ProjectPart } from '../content/types'
import { isDraft } from '../preview'
import { ArrowIcon } from './ArrowIcon'
import { Gallery } from './Gallery'
import { ProjectVisual } from './ProjectVisual'
import { SectionHead } from './SectionHead'

const factLabels: { key: keyof Project['facts']; label: string }[] = [
  { key: 'besoin', label: 'Le besoin' },
  { key: 'contribution', label: 'Mon rôle' },
  { key: 'ia', label: 'Avec l’IA' },
  { key: 'resultat', label: 'Résultat actuel' },
  { key: 'apprentissage', label: 'Ce que j’apprends' },
]

const stagger = (i: number) => ({ '--d': `${i * 60}ms` }) as CSSProperties

/** Projets qui reçoivent une bande de fond claire (contraste de rythme dans la section). */
const lightProjects = new Set(['north-origin'])

function Facts({ project }: { project: Project }) {
  const items = factLabels.filter(({ key }) => project.facts[key])
  return (
    <dl className="facts">
      {items.map(({ key, label }, i) => (
        <div className="facts__item" data-reveal style={stagger(i)} key={key}>
          <dt className="mono">
            <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {project.factLabels?.[key] ?? label}
          </dt>
          <dd>{project.facts[key]}</dd>
        </div>
      ))}
    </dl>
  )
}

function ProjectLink({ project }: { project: Project }) {
  if (!project.link) return null
  return (
    <a className="text-link" href={project.link.href} target="_blank" rel="noopener noreferrer">
      <span>{project.link.label}</span>
      <ArrowIcon direction="up-right" />
      <span className="sr-only"> (ouvre un nouvel onglet)</span>
    </a>
  )
}

function DraftNotes({ project }: { project: Project }) {
  if (!isDraft || !project.missing?.length) return null
  return (
    <div className="draft-flag draft-flag--block" role="note">
      <strong>À fournir ou confirmer</strong>
      <ul>
        {project.missing.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  )
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <p className="project__meta mono">
      <span>{project.kind}</span>
      <span className="project__status">
        <span className="pin" aria-hidden="true" />
        {project.status}
      </span>
    </p>
  )
}

/** Avancement vérifié : une colonne par étape renseignée, rien d’inventé pour les étapes vides. */
function Stages({ project }: { project: Project }) {
  const stages = project.stages?.filter((s) => s.items.length) ?? []
  if (!stages.length) return null
  return (
    <div className="stages">
      {stages.map((stage, i) => (
        <section className={`stage stage--${i}`} data-reveal style={stagger(i)} aria-labelledby={`${project.id}-stage-${i}`} key={stage.label}>
          <h4 id={`${project.id}-stage-${i}`} className="stage__label mono">
            <span className="stage__dot" aria-hidden="true" />
            {stage.label}
          </h4>
          <ul className="stage__list">
            {stage.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {stage.note && <p className="stage__note mono">{stage.note}</p>}
        </section>
      ))}
    </div>
  )
}

/** Contenu d’un volet : ce qui est prévu, puis ce que la capture montre réellement. Aucune interface simulée. */
function PartPanel({ part, project }: { part: ProjectPart; project: Project }) {
  const hasShots = part.shots.length > 0
  return (
    <div className={`part${hasShots ? '' : ' part--text'}`}>
      <div className="part__text">
        {/* Le public est déjà indiqué sur l’onglet */}
        <p className="part__label mono">Objectif</p>
        <p className="part__intent">{part.intent}</p>
        {part.shown && (
          <>
            <p className="part__label mono">Ce que montre la capture</p>
            <p className="part__shown">{part.shown}</p>
          </>
        )}
      </div>
      {/* Emplacement prêt : remplir `parts[].shots` dans projects.ts suffit à afficher la galerie */}
      {hasShots && <Gallery shots={part.shots} name={`${project.name} — ${part.name}`} />}
      {isDraft && part.missing && (
        <p className="draft-flag" role="note">
          <strong>Visuel manquant</strong> {part.missing}
        </p>
      )}
    </div>
  )
}

/** Onglets Voltude S / Voltude Pro : motif ARIA « tabs », flèches gauche/droite, Début/Fin. */
function PartTabs({ project, parts }: { project: Project; parts: ProjectPart[] }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (i: number, focus = false) => {
    const next = (i + parts.length) % parts.length
    setActive(next)
    if (focus) tabs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: parts.length - 1 }
    if (e.key in moves) {
      e.preventDefault()
      select(moves[e.key], true)
    }
  }

  return (
    <div className="parts" data-reveal>
      <div className="parts__tabs" role="tablist" aria-label={`Volets de ${project.name}`} onKeyDown={onKeyDown}>
        {parts.map((part, i) => (
          <button
            key={part.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`tab-${part.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${part.id}`}
            tabIndex={active === i ? 0 : -1}
            className="parts__tab"
            onClick={() => select(i)}
          >
            <span className="parts__tab-num mono" aria-hidden="true">
              Volet {String(i + 1).padStart(2, '0')}
            </span>
            <span className="parts__tab-name">{part.name}</span>
            <span className="parts__tab-for mono">{part.audience}</span>
          </button>
        ))}
        <span className="parts__indicator" aria-hidden="true" style={{ '--i': active, '--n': parts.length } as CSSProperties} />
      </div>
      {parts.map((part, i) => (
        <div
          key={part.id}
          role="tabpanel"
          id={`panel-${part.id}`}
          aria-labelledby={`tab-${part.id}`}
          className="parts__panel"
          hidden={active !== i}
          tabIndex={0}
        >
          <PartPanel part={part} project={project} />
        </div>
      ))}
      {project.partsNote && <p className="parts__note parts__note--tabs">{project.partsNote}</p>}
    </div>
  )
}

/** Volets sans aucune capture : objectifs côte à côte, sans onglets ni interface simulée. */
function PartsSummary({ project, parts }: { project: Project; parts: ProjectPart[] }) {
  return (
    <section className="parts parts--summary" data-reveal aria-labelledby={`${project.id}-parts`}>
      <h4 id={`${project.id}-parts`} className="parts__title mono">
        {project.partsTitle ?? `Volets de ${project.name}`}
      </h4>
      <div className="parts__grid">
        {parts.map((part) => (
          <div className="parts__item" key={part.id}>
            <p className="parts__tab-name">{part.name}</p>
            <p className="part__audience mono">{part.audience}</p>
            <p className="part__intent">{part.intent}</p>
          </div>
        ))}
      </div>
      {project.partsNote && <p className="parts__note">{project.partsNote}</p>}
      {isDraft &&
        parts.map(
          (part) =>
            part.missing && (
              <p className="draft-flag" role="note" key={part.id}>
                <strong>Visuel manquant</strong> {part.missing}
              </p>
            ),
        )}
    </section>
  )
}

function Featured({ project }: { project: Project }) {
  const shots = project.shots ?? []
  return (
    <article
      className={`project project--featured${shots.length ? ' has-shots' : ''}`}
      id={`projet-${project.id}`}
      aria-labelledby={`t-${project.id}`}
    >
      <div className="project--featured__head" data-reveal>
        <span className="project__index mono" aria-hidden="true">
          {project.index} / Projet principal
        </span>
        <h3 id={`t-${project.id}`} className="project__name project__name--xl">
          {project.name}
        </h3>
      </div>
      <div className="project--featured__intro" data-reveal>
        <ProjectMeta project={project} />
        <p className="project__pitch">{project.pitch}</p>
        <Stages project={project} />
        <ProjectLink project={project} />
        <DraftNotes project={project} />
      </div>
      {shots.length > 0 && (
        <div className="project--featured__visual project__gallery" data-reveal="rise">
          <Gallery shots={shots} name={project.name} compact />
        </div>
      )}
      {!shots.length && project.visual && (
        <div className="project--featured__visual" data-reveal="wipe">
          <ProjectVisual visual={project.visual} name={project.name} />
        </div>
      )}
      {project.parts &&
        (project.parts.some((p) => p.shots.length) ? (
          <PartTabs project={project} parts={project.parts} />
        ) : (
          <PartsSummary project={project} parts={project.parts} />
        ))}
      <div className="project--featured__facts">
        <Facts project={project} />
      </div>
    </article>
  )
}

/** Projet illustré par de vraies captures : en-tête, scène (capture + téléphone), vignettes, puis les faits. */
function Showcase({ project, flip }: { project: Project; flip: boolean }) {
  const light = lightProjects.has(project.id)
  return (
    <article
      className={`project project--showcase${flip ? ' is-flipped' : ''}${light ? ' project--light theme-light' : ''}`}
      id={`projet-${project.id}`}
      aria-labelledby={`t-${project.id}`}
    >
      <span className="project__bignum" aria-hidden="true">
        {project.index}
      </span>
      <header className="project__header" data-reveal>
        <span className="project__index mono" aria-hidden="true">
          {project.index} / {String(projects.length).padStart(2, '0')}
        </span>
        <h3 id={`t-${project.id}`} className="project__name">
          {project.name}
        </h3>
        <ProjectMeta project={project} />
        <p className="project__pitch">{project.pitch}</p>
        <ProjectLink project={project} />
      </header>
      <div className="project__gallery" data-reveal="rise">
        <Gallery shots={project.shots ?? []} name={project.name} flipped={flip} />
      </div>
      <div className="project__facts">
        {project.shotsNote && <p className="parts__note project__shots-note">{project.shotsNote}</p>}
        <Facts project={project} />
        <DraftNotes project={project} />
      </div>
    </article>
  )
}

function Row({ project, flip }: { project: Project; flip: boolean }) {
  const hasVisual = Boolean(project.visual)
  // Le bloc Réalisé / Envisagé n’apparaît qu’une fois quelque chose de réellement terminé.
  const showProgress = Boolean(project.progress?.done.length)
  return (
    <article
      className={`project project--row${flip ? ' is-flipped' : ''}${hasVisual ? '' : ' project--text'}`}
      id={`projet-${project.id}`}
      aria-labelledby={`t-${project.id}`}
    >
      <div className="project__main">
        <header className="project__header" data-reveal>
          <span className="project__index mono" aria-hidden="true">
            {project.index} / {String(projects.length).padStart(2, '0')}
          </span>
          <h3 id={`t-${project.id}`} className="project__name">
            {project.name}
          </h3>
          <ProjectMeta project={project} />
          <p className="project__pitch">{project.pitch}</p>
          <ProjectLink project={project} />
        </header>
        {showProgress && project.progress && (
          <div className="progress" data-reveal>
            <div>
              <h4 className="mono">Réalisé</h4>
              <ul>
                {project.progress.done.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mono">Envisagé</h4>
              <ul className="progress__planned">
                {project.progress.planned.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <Facts project={project} />
        <DraftNotes project={project} />
      </div>
      {project.visual && (
        <div className="project__visual" data-reveal="wipe">
          <ProjectVisual visual={project.visual} name={project.name} />
        </div>
      )}
    </article>
  )
}

export function Projects() {
  const [featured, ...others] = projects
  return (
    <section id="projets" className="section section--projects" aria-labelledby="projets-title">
      <SectionHead id="projets-title" index="01" title={projectsIntro.title} lead={projectsIntro.lead} />
      <Featured project={featured} />
      <div className="project-list">
        {others.map((p, i) =>
          p.shots?.length ? <Showcase project={p} flip={i % 2 === 1} key={p.id} /> : <Row project={p} flip={i % 2 === 1} key={p.id} />,
        )}
      </div>
    </section>
  )
}
