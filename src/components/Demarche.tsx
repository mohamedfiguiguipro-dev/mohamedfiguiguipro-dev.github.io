import type { CSSProperties } from 'react'
import { demarche } from '../content/site'
import { SectionHead } from './SectionHead'

export function Demarche() {
  return (
    <section id="demarche" className="section section--demarche theme-light" aria-labelledby="demarche-title">
      <SectionHead
        id="demarche-title"
        index="03"
        title={demarche.title}
        heading={demarche.heading}
        lead={demarche.lead}
      />

      <ol className="steps">
        {demarche.steps.map((step, i) => (
          <li
            className="steps__item"
            data-reveal
            style={{ '--d': `${i * 80}ms` } as CSSProperties}
            key={step.title}
          >
            <span className="steps__num mono" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="steps__title">{step.title}</h3>
            <p className="steps__text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
