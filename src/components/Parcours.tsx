import type { CSSProperties } from 'react'
import { parcours } from '../content/site'
import { SectionHead } from './SectionHead'

const stateLabel = { now: 'En cours', next: 'À venir', goal: 'Objectif' }

export function Parcours() {
  return (
    <section id="parcours" className="section section--parcours" aria-labelledby="parcours-title">
      <SectionHead
        id="parcours-title"
        index="02"
        title={parcours.title}
        heading={parcours.heading}
        lead={parcours.lead}
      />

      <ol className="timeline">
        {parcours.timeline.map((step, i) => (
          <li
            className={`timeline__step is-${step.state}`}
            data-reveal
            style={{ '--d': `${i * 60}ms` } as CSSProperties}
            key={step.title}
          >
            <span className="timeline__node" aria-hidden="true" />
            <p className="timeline__when mono">
              {step.when}
              <span className="timeline__state">{stateLabel[step.state]}</span>
            </p>
            <h3 className="timeline__title">{step.title}</h3>
            <p className="timeline__text">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="bridges">
        <h3 className="bridges__title" data-reveal>
          Ce que le terrain m’apprend <span>pour le code</span>
        </h3>
        <ul className="bridges__list">
          {parcours.bridges.map((b, i) => (
            <li
              className="bridges__item"
              data-reveal
              style={{ '--d': `${i * 90}ms` } as CSSProperties}
              key={b.field}
            >
              <p className="bridges__field mono">{b.field}</p>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
