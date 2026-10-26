import { objectif } from '../content/site'
import { ArrowIcon } from './ArrowIcon'

export function Objectif() {
  return (
    <section id="objectif" className="section section--objectif" aria-labelledby="objectif-title">
      <p className="objectif__index mono" aria-hidden="true">
        02 — {objectif.title}
      </p>
      <h2 id="objectif-title" className="objectif__big" data-reveal>
        <span>{objectif.big[0]}</span>
        <span className="objectif__year">{objectif.big[1]}</span>
      </h2>

      <div className="objectif__grid">
        <div data-reveal>
          <p className="objectif__lead">{objectif.lead}</p>
          <h3 className="objectif__subtitle mono">{objectif.domainsTitle}</h3>
          <ul className="objectif__domains">
            {objectif.domains.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="objectif__note">{objectif.domainsNote}</p>
        </div>
        <div data-reveal>
          <h3 className="objectif__subtitle mono">{objectif.method.title}</h3>
          <ul className="objectif__bring">
            {objectif.method.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="btn btn--ink" href={objectif.cta.href}>
            <span>{objectif.cta.label}</span>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}
