type Props = {
  id: string
  index: string
  title: string
  heading?: string
  /** Un ou plusieurs paragraphes */
  lead?: string | string[]
}

/** En-tête de section : numéro, titre court et trait qui se dessine à l’entrée dans l’écran. */
export function SectionHead({ id, index, title, heading, lead }: Props) {
  return (
    <header className="section-head" data-reveal>
      <div className="section-head__rule" aria-hidden="true">
        <span className="section-head__node" />
      </div>
      <p className="section-head__index mono" aria-hidden="true">
        {index}
      </p>
      <h2 id={id} className="section-head__title">
        {title}
      </h2>
      {heading && <p className="section-head__heading">{heading}</p>}
      {(typeof lead === 'string' ? [lead] : (lead ?? [])).map((paragraph) => (
        <p className="section-head__lead" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </header>
  )
}
