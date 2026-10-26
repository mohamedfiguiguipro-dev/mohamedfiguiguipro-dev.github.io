import { Fragment, useEffect, useRef, type CSSProperties } from 'react'
import { hero, person } from '../content/site'
import { CircuitArt } from './CircuitArt'
import { ArrowIcon } from './ArrowIcon'

/** Délai d’apparition en millisecondes. Le titre est complet en ≈ 0,7 s ; le circuit poursuit sa séquence sans le retarder. */
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  // Met en pause les animations en boucle lorsque le premier écran n’est plus visible.
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle('is-offscreen', !entry.isIntersecting)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="accueil" className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__text">
        <p className="hero__kicker mono intro" style={delay(0)}>
          <span className="pin" aria-hidden="true" />
          <span>
            {hero.badges.map((badge, i) => (
              <Fragment key={badge}>
                {i > 0 && ' · '}
                <span className="hero__badge">{badge}</span>
              </Fragment>
            ))}
          </span>
        </p>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__name intro" style={delay(30)}>
            {person.name}
          </span>
          {hero.title.map((line, i) => (
            <span className="line-mask" key={line}>
              <span className={`line line--${i} intro-up`} style={delay(60 + i * 90)}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero__subtitle intro" style={delay(220)}>
          {hero.subtitle.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="hero__actions intro-soft">
          <a className="btn btn--primary" href={hero.primary.href}>
            <span>{hero.primary.label}</span>
            <ArrowIcon direction="down" />
          </a>
          <a className="btn btn--ghost" href={hero.secondary.href}>
            <span>{hero.secondary.label}</span>
            <ArrowIcon />
          </a>
        </div>

      </div>

      <div className="hero__art">
        <CircuitArt />
      </div>

      <dl className="hero__legend">
        {hero.legend.map((item, i) => (
          <div className="hero__legend-item intro" style={delay(360 + i * 50)} key={item.label}>
            <dt className="mono">{item.label}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
