import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import type { Shot } from '../content/types'
import { asset } from '../preview'

const srcSet = (shot: Shot) => shot.widths.map((w) => `${asset(`${shot.base}-${w}.webp`)} ${w}w`).join(', ')
const fallback = (shot: Shot) => asset(`${shot.base}-${shot.widths[Math.min(1, shot.widths.length - 1)]}.webp`)

type ImgProps = { shot: Shot; sizes: string; eager?: boolean }

/** Capture responsive : dimensions explicites (pas de décalage), chargement différé par défaut. */
export function ShotImage({ shot, sizes, eager = false }: ImgProps) {
  return (
    <img
      src={fallback(shot)}
      srcSet={srcSet(shot)}
      sizes={sizes}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

type GalleryProps = { shots: Shot[]; name: string; flipped?: boolean; compact?: boolean }

/**
 * Mise en scène des captures d’un projet : une capture ordinateur, une capture mobile en
 * superposition, puis les autres en vignettes. Chaque image ouvre la visionneuse.
 */
export function Gallery({ shots, name, flipped = false, compact = false }: GalleryProps) {
  const [open, setOpen] = useState<number | null>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])

  const lead = shots.findIndex((s) => s.device === 'desktop')
  const phone = shots.findIndex((s) => s.device === 'mobile')
  const rest = shots.map((_, i) => i).filter((i) => i !== lead && i !== phone)

  const close = useCallback((index: number) => {
    setOpen(null)
    // Retour au déclencheur : on reprend là où l’on était dans la page.
    triggers.current[index]?.focus({ preventScroll: true })
  }, [])

  const trigger = (i: number, className: string, sizes: string, label: string) => {
    const shot = shots[i]
    return (
      <button
        type="button"
        className={`shot shot--${shot.device} ${className}`}
        ref={(el) => {
          triggers.current[i] = el
        }}
        onClick={() => setOpen(i)}
        aria-haspopup="dialog"
      >
        <span className="shot__frame">
          <ShotImage shot={shot} sizes={sizes} />
        </span>
        <span className="shot__label mono">
          <span>{label}</span>
          <span className="shot__zoom" aria-hidden="true">
            +
          </span>
          <span className="sr-only"> — agrandir la capture</span>
        </span>
      </button>
    )
  }

  return (
    <div className={`gallery${flipped ? ' gallery--flipped' : ''}${compact ? ' gallery--compact' : ''}`}>
      <div className={`gallery__stage${phone < 0 ? ' gallery__stage--solo' : ''}${lead < 0 ? ' gallery__stage--phone-only' : ''}`}>
        {lead >= 0 && trigger(lead, 'gallery__lead', compact ? '(max-width: 900px) 100vw, 40vw' : '(max-width: 900px) 100vw, 62vw', shots[lead].caption)}
        {phone >= 0 && trigger(phone, 'gallery__phone', compact ? '(max-width: 600px) 42vw, 14vw' : '(max-width: 600px) 42vw, 18vw', shots[phone].caption)}
      </div>
      {rest.length > 0 && (
        <ul className="gallery__thumbs" aria-label={`Autres captures de ${name}`}>
          {rest.map((i, n) => (
            <li key={shots[i].base} style={{ '--d': `${n * 60}ms` } as CSSProperties}>
              {trigger(i, 'gallery__thumb', '(max-width: 600px) 50vw, 24vw', shots[i].caption)}
            </li>
          ))}
        </ul>
      )}
      {open !== null && <Lightbox shots={shots} start={open} name={name} onClose={close} />}
    </div>
  )
}

type LightboxProps = { shots: Shot[]; start: number; name: string; onClose: (index: number) => void }

type Level = { width: number; label: string }

/**
 * Niveaux de zoom d’une capture, d’après la place disponible (`fit`, largeur en vue ajustée)
 * et sa résolution (`real`, largeur à un pixel d’image par pixel d’écran) :
 * Ajustée → Agrandie (palier intermédiaire) → Taille réelle, quand elle apporte du détail.
 */
function zoomLevels(fit: number, real: number): Level[] {
  const levels: Level[] = [{ width: fit, label: 'Ajustée' }]
  if (!fit) return levels
  const k = real / fit
  if (k >= 1.8) {
    levels.push({ width: Math.round(fit * Math.sqrt(k)), label: 'Agrandie' })
    levels.push({ width: Math.round(real), label: 'Taille réelle' })
  } else if (k >= 1.25) levels.push({ width: Math.round(real), label: 'Taille réelle' })
  else levels.push({ width: Math.round(fit * 1.6), label: 'Agrandie' })
  return levels
}

/**
 * Visionneuse : <dialog> modal natif (focus piégé, fond inerte, Échap).
 * - Flèches gauche/droite : capture précédente/suivante (en vue ajustée).
 * - Zoom par paliers : boutons « Ajustée / Agrandie / Taille réelle », clic ou toucher sur l’image
 *   (palier suivant, centré sur le point visé), touches + et −, 0 pour revenir.
 *   L’image agrandie défile nativement (doigt, molette, flèches) ; on peut aussi la tirer à la souris.
 *   Les proportions sont toujours conservées : rien n’est rogné.
 * - À la fermeture, le focus revient à la capture d’origine.
 */
function Lightbox({ shots, start, name, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const figure = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(start)
  const [level, setLevel] = useState(0)
  const [box, setBox] = useState({ w: 0, h: 0 })
  // Point visé lors du zoom (fractions de l’image), gardé au centre de la zone.
  const focusPoint = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 })
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null)
  const shot = shots[index]
  const count = shots.length
  const zoomed = level > 0

  const dpr = window.devicePixelRatio || 1
  const fit = box.w && box.h ? Math.floor(Math.min(box.w, (box.h * shot.width) / shot.height)) : 0
  const levels = zoomLevels(fit, shot.width / dpr)
  const current = levels[Math.min(level, levels.length - 1)]

  const go = useCallback(
    (step: number) => {
      setLevel(0)
      setIndex((i) => (i + step + count) % count)
    },
    [count],
  )

  // On ferme d’abord le dialog (la page cesse d’être inerte), puis le focus peut revenir au déclencheur.
  const shut = () => {
    ref.current?.close()
    onClose(start)
  }

  /** Change de palier en gardant le point visé (ou le centre actuel) au milieu de la zone. */
  const zoomTo = (next: number, point?: { x: number; y: number }) => {
    const el = figure.current
    if (point) focusPoint.current = point
    else if (zoomed && el) {
      focusPoint.current = {
        x: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth,
        y: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight,
      }
    } else focusPoint.current = { x: 0.5, y: shot.device === 'mobile' ? 0.2 : 0.5 }
    setLevel(Math.max(0, Math.min(levels.length - 1, next)))
  }

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.showModal()
    document.documentElement.classList.add('has-modal')
    return () => document.documentElement.classList.remove('has-modal')
  }, [])

  // Place disponible pour l’image, mise à jour si la fenêtre change de taille.
  useLayoutEffect(() => {
    const el = figure.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    if (!('ResizeObserver' in window)) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  // Après un changement de palier : centrer la zone visée et donner le focus à la zone défilante.
  useLayoutEffect(() => {
    const el = figure.current
    if (!el) return
    if (zoomed) {
      const { x, y } = focusPoint.current
      el.scrollLeft = x * el.scrollWidth - el.clientWidth / 2
      el.scrollTop = y * el.scrollHeight - el.clientHeight / 2
      el.focus({ preventScroll: true })
    } else {
      el.scrollLeft = 0
      el.scrollTop = 0
    }
  }, [level, index, zoomed])

  // Changement de capture : si le focus a été perdu en route, il reste dans la visionneuse.
  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.contains(document.activeElement)) figure.current?.focus({ preventScroll: true })
  }, [index])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      zoomTo(level + 1)
    } else if (e.key === '-') {
      e.preventDefault()
      zoomTo(level - 1)
    } else if (e.key === '0') {
      e.preventDefault()
      zoomTo(0)
    } else if (!zoomed && count > 1 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      // Image agrandie : les flèches la font défiler (comportement natif).
      e.preventDefault()
      go(e.key === 'ArrowRight' ? 1 : -1)
    }
  }

  // Clic ou toucher : palier suivant centré sur le point visé ; au dernier palier, retour à la vue ajustée.
  const onImageClick = (e: MouseEvent<HTMLImageElement>) => {
    if (drag.current?.moved) return
    const r = e.currentTarget.getBoundingClientRect()
    const next = level + 1 < levels.length ? level + 1 : 0
    zoomTo(next, { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }

  // Déplacement à la souris quand l’image est agrandie (le tactile et le stylet gardent le défilement natif).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = figure.current
    if (!zoomed || !el || e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop, moved: false }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = figure.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) > 4) {
      d.moved = true
      el.setPointerCapture(e.pointerId)
      el.classList.add('is-dragging')
    }
    if (d.moved) {
      el.scrollLeft = d.left - dx
      el.scrollTop = d.top - dy
    }
  }

  const onPointerUp = () => {
    figure.current?.classList.remove('is-dragging')
    // Laisse passer le clic qui suit un déplacement sans déclencher de zoom.
    window.setTimeout(() => {
      drag.current = null
    }, 0)
  }

  return (
    <dialog
      ref={ref}
      className={`lightbox lightbox--${shot.device}${zoomed ? ' is-zoomed' : ''}`}
      aria-labelledby="lightbox-title"
      onCancel={(e) => {
        e.preventDefault()
        shut()
      }}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // Clic sur le fond (hors image et contrôles), en vue ajustée : fermeture.
        const t = e.target as HTMLElement
        if (!zoomed && (t === e.currentTarget || t.classList.contains('lightbox__figure'))) shut()
      }}
    >
      <div className="lightbox__bar">
        <p id="lightbox-title" className="lightbox__title mono">
          {name} <span aria-hidden="true">·</span> {shot.caption}
        </p>
        {count > 1 && (
          <p className="lightbox__count mono" aria-live="polite">
            {index + 1} / {count}
          </p>
        )}
        <button type="button" className="lightbox__close" onClick={shut}>
          <span>Fermer</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <div
        ref={figure}
        className="lightbox__figure"
        tabIndex={zoomed ? 0 : -1}
        role={zoomed ? 'region' : undefined}
        aria-label={zoomed ? `Capture agrandie (${current.label.toLowerCase()}) : faites défiler pour la parcourir` : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={fallback(shot)}
          srcSet={srcSet(shot)}
          sizes={zoomed ? `${current.width}px` : `${fit || 1200}px`}
          width={shot.width}
          height={shot.height}
          style={zoomed ? ({ width: `${current.width}px` } as CSSProperties) : undefined}
          alt={shot.alt}
          decoding="async"
          draggable={false}
          onClick={onImageClick}
        />
      </div>
      <div className="lightbox__foot">
        <div className="lightbox__levels" role="group" aria-label="Niveau de zoom">
          {levels.map((l, i) => (
            <button type="button" key={l.label} aria-pressed={level === i} onClick={() => zoomTo(i)}>
              {l.label}
            </button>
          ))}
        </div>
        <p className="lightbox__hint mono" aria-hidden="true">
          {zoomed ? 'Faites glisser pour parcourir' : 'Touchez l’image pour l’agrandir'}
        </p>
        {count > 1 && (
          <div className="lightbox__nav">
            <button type="button" onClick={() => go(-1)}>
              <span aria-hidden="true">←</span> Précédente
            </button>
            <button type="button" onClick={() => go(1)}>
              Suivante <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}
