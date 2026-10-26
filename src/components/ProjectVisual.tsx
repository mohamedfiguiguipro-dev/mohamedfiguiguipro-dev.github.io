import type { Visual } from '../content/types'
import { asset, isDraft } from '../preview'

type Props = { visual: Visual; name: string }

/**
 * Affiche la capture réelle si elle existe. Sinon, une planche typographique neutre,
 * légendée « Illustration » : elle ne doit jamais passer pour une vraie capture.
 */
export function ProjectVisual({ visual, name }: Props) {
  const ratioClass = `visual visual--${visual.ratio}`

  if (visual.src) {
    return (
      <figure className={ratioClass}>
        <div className="visual__frame">
          <img
            src={asset(visual.src)}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </figure>
    )
  }

  return (
    <figure className={`${ratioClass} visual--plate`}>
      <div className="visual__frame" aria-hidden="true">
        <svg className="plate__lines" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" fill="none">
          <path d="M0 230 H120 L150 200 H260 L290 170 H400" pathLength={1} />
          <path d="M0 260 H80 L110 230 H400" pathLength={1} />
          <circle cx="150" cy="200" r="3" />
          <circle cx="290" cy="170" r="3" />
        </svg>
        <span className="plate__name">{name}</span>
        {visual.ratio === 'portrait' && <span className="plate__phone" />}
      </div>
      <figcaption className="visual__caption mono">
        Illustration{isDraft ? '' : ' — capture du projet à venir'}
      </figcaption>
      {isDraft && visual.missing && (
        <p className="draft-flag" role="note">
          <strong>Visuel manquant</strong> {visual.missing}
        </p>
      )}
    </figure>
  )
}
