import type { CSSProperties } from 'react'
import { services } from '../content/site'
import { ArrowIcon } from './ArrowIcon'
import { SectionHead } from './SectionHead'

/** Types de réalisations proposées aux petites entreprises : pistes à discuter, sans références inventées. */
export function Services() {
  return (
    <section id="realiser" className="section section--services" aria-labelledby="realiser-title">
      <SectionHead id="realiser-title" index="04" title={services.title} heading={services.heading} lead={services.lead} />

      <ol className="services">
        {services.items.map((item, i) => (
          <li className="services__item" data-reveal style={{ '--d': `${i * 60}ms` } as CSSProperties} key={item.title}>
            <span className="services__num mono" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="services__title">{item.title}</h3>
            <div className="services__body">
              <p>{item.text}</p>
              <p className="services__deliverable">
                <span className="mono">Livrable</span> {item.deliverable}
              </p>
              {item.ref && (
                <a className="text-link" href={item.ref.href}>
                  <span>{item.ref.label}</span>
                  <ArrowIcon />
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="services__foot" data-reveal>
        <p>{services.note}</p>
        <a className="btn btn--ghost" href={services.cta.href}>
          <span>{services.cta.label}</span>
          <ArrowIcon direction="down" />
        </a>
      </div>
    </section>
  )
}
