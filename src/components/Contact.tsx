import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { contact, person } from '../content/site'
import { asset } from '../preview'
import { ArrowIcon } from './ArrowIcon'
import { SectionHead } from './SectionHead'

type Intent = (typeof contact.intents)[number]

/** Adresse coupée de préférence après « @ » sur les écrans étroits (jamais au milieu d’un mot). */
function EmailText({ email }: { email: string }) {
  const at = email.indexOf('@')
  if (at < 0) return <>{email}</>
  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  )
}

/**
 * Bloque le défilement de la page sous la fenêtre (y compris au doigt sur téléphone,
 * où `overflow: hidden` sur la racine ne suffit pas) et rend la position exacte à la fermeture.
 */
function lockPageScroll() {
  const root = document.documentElement
  const body = document.body
  const y = window.scrollY
  const previous = { position: body.style.position, top: body.style.top, width: body.style.width }
  root.classList.add('has-modal')
  body.style.position = 'fixed'
  body.style.top = `${-y}px`
  body.style.width = '100%'
  return () => {
    root.classList.remove('has-modal')
    Object.assign(body.style, previous)
    window.scrollTo({ top: y, left: 0, behavior: 'instant' })
  }
}

export function Contact() {
  const [open, setOpen] = useState<Intent | null>(null)
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({})

  // La fenêtre est déjà fermée (la page n’est plus inerte) : le focus peut revenir au bouton d’origine.
  const close = (intent: Intent) => {
    setOpen(null)
    triggers.current[intent.id]?.focus()
  }

  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-title">
      <SectionHead id="contact-title" index="05" title={contact.title} heading={contact.heading} lead={contact.lead} />

      <div className="contact__main" data-reveal>
        <a className="contact__email" href={`mailto:${person.email}`}>
          <span className="contact__email-text">
            <EmailText email={person.email} />
          </span>
          <ArrowIcon direction="up-right" />
        </a>

        {person.phone && (
          <a className="contact__phone" href={`tel:${person.phone.tel}`}>
            <span className="mono">Téléphone</span> {person.phone.display}
          </a>
        )}

        <ul className="contact__intents" aria-label="Choisir le sujet du contact">
          {contact.intents.map((intent) => (
            <li key={intent.id}>
              <button
                type="button"
                className="contact__intent"
                aria-haspopup="dialog"
                ref={(el) => {
                  triggers.current[intent.id] = el
                }}
                onClick={() => setOpen(intent)}
              >
                <span className="contact__intent-label">{intent.label}</span>
                <span className="contact__intent-text mono">{intent.text}</span>
                <ArrowIcon />
              </button>
            </li>
          ))}
        </ul>

        <p className="contact__availability">{contact.availability}</p>

        {(person.cv || person.links.length > 0) && (
          <div className="contact__actions">
            {person.cv && (
              <a className="btn btn--ghost btn--small" href={asset(person.cv)} download>
                <span>Télécharger mon CV (PDF)</span>
                <ArrowIcon direction="down" />
              </a>
            )}
            {person.links.map((l) => (
              <a className="text-link" href={l.href} target="_blank" rel="noopener noreferrer" key={l.href}>
                <span>{l.label}</span>
                <ArrowIcon direction="up-right" />
                <span className="sr-only"> (ouvre un nouvel onglet)</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {open && <ContactDialog intent={open} onClose={close} />}
    </section>
  )
}

/**
 * Petite fenêtre de contact : <dialog> modal natif (fond inerte, Échap).
 * Adresse à copier (ou à sélectionner à la main), messagerie avec objet rempli, téléphone.
 * Aucun formulaire, aucune collecte, aucun envoi automatique.
 */
function ContactDialog({ intent, onClose }: { intent: Intent; onClose: (intent: Intent) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const email = useRef<HTMLParagraphElement>(null)
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle')
  const t = contact.dialog

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.showModal()
    // Focus initial sur le titre : la fenêtre est annoncée, Tab mène ensuite aux actions.
    title.current?.focus()
    return lockPageScroll()
  }, [])

  useEffect(() => {
    if (copy !== 'copied') return
    const timer = window.setTimeout(() => setCopy('idle'), 2400)
    return () => window.clearTimeout(timer)
  }, [copy])

  const shut = () => {
    ref.current?.close()
    onClose(intent)
  }

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Presse-papiers indisponible')
      await navigator.clipboard.writeText(person.email)
      setCopy('copied')
    } catch {
      setCopy('failed')
      // L’adresse est sélectionnée pour faciliter la copie manuelle.
      const el = email.current
      const selection = window.getSelection()
      if (el && selection) {
        const range = document.createRange()
        range.selectNodeContents(el)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  // Tab et Maj+Tab restent dans la fenêtre.
  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab' || !ref.current) return
    const items = [...ref.current.querySelectorAll<HTMLElement>('a[href], button')]
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={ref}
      className="contact-dialog"
      aria-labelledby="contact-dialog-title"
      aria-describedby="contact-dialog-intro"
      onCancel={(e) => {
        e.preventDefault()
        shut()
      }}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // Clic sur le fond, hors du panneau : fermeture.
        if (e.target === e.currentTarget) shut()
      }}
    >
      <div className="contact-dialog__panel">
        <div className="contact-dialog__head">
          <h2 id="contact-dialog-title" className="contact-dialog__title" tabIndex={-1} ref={title}>
            {intent.label}
          </h2>
          <button type="button" className="contact-dialog__close" onClick={shut}>
            <span>{t.close}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <p id="contact-dialog-intro" className="contact-dialog__intro">
          {intent.intro}
        </p>

        <div className="contact-dialog__block">
          <p className="contact-dialog__label mono">{t.emailLabel}</p>
          <p className="contact-dialog__email" ref={email}>
            <EmailText email={person.email} />
          </p>
          <button type="button" className="btn btn--ghost btn--small" onClick={copyEmail}>
            <span>{copy === 'copied' ? t.copied : t.copy}</span>
          </button>
          {copy === 'failed' && (
            <p className="contact-dialog__help" aria-hidden="true">
              {t.copyFailed}
            </p>
          )}
        </div>

        <a className="btn btn--primary contact-dialog__mail" href={`mailto:${person.email}?subject=${encodeURIComponent(intent.subject)}`}>
          <span>{t.mail}</span>
          <ArrowIcon direction="up-right" />
        </a>

        {person.phone && (
          <div className="contact-dialog__block">
            <p className="contact-dialog__label mono">{t.phoneLabel}</p>
            <a className="contact-dialog__phone" href={`tel:${person.phone.tel}`}>
              {person.phone.display}
            </a>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {copy === 'copied' ? 'Adresse email copiée dans le presse-papiers' : copy === 'failed' ? t.copyFailed : ''}
        </p>
      </div>
    </dialog>
  )
}
