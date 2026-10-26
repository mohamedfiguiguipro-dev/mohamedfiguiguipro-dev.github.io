import type { CSSProperties } from 'react'

/** Décalage d’un élément d’interface vers le point d’entrée du courant : il « sort » du signal. */
const from = (cx: number, cy: number, ex: number, ey: number) => ({ '--fx': `${ex - cx}px`, '--fy': `${ey - cy}px` }) as CSSProperties

/**
 * Illustration du premier écran : un schéma électrique (L1, interrupteur S1, lampe H1)
 * relié à une interface. Décoratif, donc masqué aux lecteurs d’écran.
 * Deux compositions, choisies en CSS : complète (écrans larges) et compacte (téléphones),
 * qui garde le récit et retire les détails secondaires (terre, conducteurs annexes).
 *
 * Séquence (≈ 2 s, CSS uniquement, mêmes classes pour les deux compositions) :
 *   0,0 s  les conducteurs se tracent, le cadre de l’interface apparaît vide
 *   0,55 s S1 se ferme
 *   0,8 s  une impulsion lumineuse parcourt L1 → S1 → interface
 *   1,15 s éclair d’arrivée ; le signal se décompose en éléments d’interface
 *   1,5 s  l’interrupteur de l’interface passe sur ON
 *   1,6 s  le courant repart de l’interface vers H1, qui s’allume (1,85 s)
 * L’état final est l’état par défaut : sans animation (ou avec la réduction des animations),
 * tout est affiché allumé, directement.
 */
export function CircuitArt() {
  return (
    <>
      <CircuitFull />
      <CircuitCompact />
    </>
  )
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor="#527bff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#527bff" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function CircuitFull() {
  const IN = 'M60 640 V470 H200 H440 Q460 470 460 450 V370'
  const OUT = 'M340 266 H150 L120 236 V194'
  const f = (cx: number, cy: number) => from(cx, cy, 460, 370)
  return (
    <svg className="circuit circuit--full" viewBox="0 0 700 640" fill="none" aria-hidden="true" focusable="false">
      <Defs id="lamp-light-full" />

      {/* Lumière de la lampe, sous le schéma */}
      <circle className="lamp-light" cx="120" cy="170" r="150" fill="url(#lamp-light-full)" />

      {/* Conducteurs */}
      <g className="circuit__traces">
        <path className="trace t1" pathLength={1} d="M60 640 V470 H150" />
        <path className="trace t2" pathLength={1} d="M200 470 H440 Q460 470 460 450 V370" />
        <path className="trace t3" pathLength={1} d="M120 0 V146 M120 194 V236 L150 266 H340" />
        <path className="trace t4" pathLength={1} d="M100 470 V540" />
        <path className="trace t5" pathLength={1} d="M260 0 V120 L300 160 H340" />
        <path className="trace t6" pathLength={1} d="M700 520 H620 Q600 520 600 500 V370" />
        <path className="trace t7" pathLength={1} d="M560 80 V40 H700" />
      </g>

      {/* Conducteurs sous tension : se colorent au passage du courant et le restent */}
      <g className="circuit__live">
        <path className="live live--in" pathLength={1} d={IN} />
        <path className="live live--out" pathLength={1} d={OUT} />
      </g>

      {/* Impulsion lumineuse (un seul passage, avec son halo) puis impulsions discrètes en boucle */}
      <g className="circuit__pulses">
        <path className="spark-halo spark--in" pathLength={1} d={IN} />
        <path className="spark spark--in" pathLength={1} d={IN} />
        <path className="spark-halo spark--out" pathLength={1} d={OUT} />
        <path className="spark spark--out" pathLength={1} d={OUT} />
        <path className="pulse p1" pathLength={1} d={IN} />
        <path className="pulse p3" pathLength={1} d="M700 520 H620 Q600 520 600 500 V370" />
      </g>

      {/* Terre */}
      <g className="circuit__symbol s-ground">
        <path d="M78 540 H122 M88 551 H112 M97 562 H103" />
      </g>

      {/* Interrupteur S1 */}
      <g className="circuit__symbol s-switch">
        <circle cx="150" cy="470" r="4" className="node" />
        <circle cx="200" cy="470" r="4" className="node" />
        <line className="switch-blade" x1="150" y1="470" x2="198" y2="470" />
      </g>

      {/* Lampe H1 */}
      <g className="circuit__symbol s-lamp">
        <circle className="lamp-glow" cx="120" cy="170" r="44" />
        <circle className="lamp-body" cx="120" cy="170" r="24" />
        <path d="M103 153 L137 187 M137 153 L103 187" />
      </g>

      {/* Nœuds */}
      <g className="circuit__nodes">
        <circle cx="100" cy="470" r="4" className="node" />
        <circle cx="340" cy="266" r="4" className="node" />
        <circle cx="340" cy="160" r="4" className="node" />
        <circle cx="600" cy="370" r="4" className="node" />
        <circle cx="560" cy="80" r="4" className="node" />
      </g>
      <circle className="arrival" cx="460" cy="370" r="22" />
      <circle cx="460" cy="370" r="4" className="node node--entry" />

      {/* Repères */}
      <g className="circuit__labels">
        <text x="72" y="606">L1</text>
        <text x="162" y="440">S1</text>
        <text x="158" y="140">H1</text>
        <text x="132" y="560">PE</text>
      </g>

      {/* Interface */}
      <g className="circuit__ui">
        <rect className="ui-frame" x="340" y="80" width="320" height="290" rx="12" pathLength={1} />
        <path className="ui-rule" d="M340 118 H660" />
        <text className="ui-label" x="362" y="105">
          INTERFACE
        </text>
        <g className="ui-bits">
          <rect className="ui-heading bit" style={f(439, 154)} x="364" y="146" width="150" height="16" rx="3" />
          <rect className="ui-line bit" style={f(484, 183)} x="364" y="180" width="240" height="6" rx="3" />
          <rect className="ui-line bit" style={f(462, 199)} x="364" y="196" width="196" height="6" rx="3" />
          <rect className="ui-line bit" style={f(474, 215)} x="364" y="212" width="220" height="6" rx="3" />
          <g className="ui-toggle bit" style={f(396, 266)}>
            <rect className="ui-toggle__track" x="364" y="250" width="64" height="32" rx="16" />
            <circle className="ui-toggle__knob" cx="380" cy="266" r="11" />
          </g>
          <g className="ui-cta bit" style={f(430, 327)}>
            <rect className="ui-button" x="364" y="310" width="132" height="34" rx="4" />
            <rect className="ui-line" x="384" y="324" width="92" height="6" rx="3" />
          </g>
        </g>
        <text className="ui-label ui-state" x="444" y="271">
          H1 · ON
        </text>
      </g>
    </svg>
  )
}

/** Composition pour téléphone : bande horizontale L1 → S1 → interface → H1, lisible à 320 px. */
function CircuitCompact() {
  const IN = 'M0 132 H176 Q186 132 186 122 V112 H196'
  const OUT = 'M196 64 H112 L96 48 H59'
  const f = (cx: number, cy: number) => from(cx, cy, 196, 112)
  return (
    <svg className="circuit circuit--compact" viewBox="0 0 360 166" fill="none" aria-hidden="true" focusable="false">
      <Defs id="lamp-light-compact" />
      <circle className="lamp-light" cx="44" cy="48" r="78" fill="url(#lamp-light-compact)" />

      <g className="circuit__traces">
        <path className="trace t1" pathLength={1} d="M0 132 H64" />
        <path className="trace t2" pathLength={1} d="M100 132 H176 Q186 132 186 122 V112 H196" />
        <path className="trace t3" pathLength={1} d="M44 0 V33 M59 48 H96 L112 64 H196" />
      </g>

      <g className="circuit__live">
        <path className="live live--in" pathLength={1} d={IN} />
        <path className="live live--out" pathLength={1} d={OUT} />
      </g>

      <g className="circuit__pulses">
        <path className="spark-halo spark--in" pathLength={1} d={IN} />
        <path className="spark spark--in" pathLength={1} d={IN} />
        <path className="spark-halo spark--out" pathLength={1} d={OUT} />
        <path className="spark spark--out" pathLength={1} d={OUT} />
        <path className="pulse p1" pathLength={1} d={IN} />
      </g>

      <g className="circuit__symbol s-switch">
        <circle cx="64" cy="132" r="3.5" className="node" />
        <circle cx="100" cy="132" r="3.5" className="node" />
        <line className="switch-blade" x1="64" y1="132" x2="98" y2="132" />
      </g>

      <g className="circuit__symbol s-lamp">
        <circle className="lamp-glow" cx="44" cy="48" r="28" />
        <circle className="lamp-body" cx="44" cy="48" r="15" />
        <path d="M33.5 37.5 L54.5 58.5 M54.5 37.5 L33.5 58.5" />
      </g>

      <g className="circuit__nodes">
        <circle cx="196" cy="64" r="3.5" className="node" />
      </g>
      <circle className="arrival" cx="196" cy="112" r="16" />
      <circle cx="196" cy="112" r="3.5" className="node node--entry" />

      <g className="circuit__labels">
        <text x="4" y="122">L1</text>
        <text x="72" y="120">S1</text>
        <text x="66" y="28">H1</text>
      </g>

      <g className="circuit__ui">
        <rect className="ui-frame" x="196" y="6" width="158" height="154" rx="10" pathLength={1} />
        <path className="ui-rule" d="M196 28 H354" />
        <text className="ui-label" x="208" y="21">
          INTERFACE
        </text>
        <g className="ui-bits">
          <rect className="ui-heading bit" style={f(252, 45)} x="210" y="40" width="84" height="10" rx="2" />
          <rect className="ui-line bit" style={f(272, 64)} x="210" y="62" width="124" height="4" rx="2" />
          <rect className="ui-line bit" style={f(260, 74)} x="210" y="72" width="100" height="4" rx="2" />
          <g className="ui-toggle bit" style={f(230, 102)}>
            <rect className="ui-toggle__track" x="210" y="92" width="40" height="20" rx="10" />
            <circle className="ui-toggle__knob" cx="220" cy="102" r="7" />
          </g>
          <g className="ui-cta bit" style={f(250, 138)}>
            <rect className="ui-button" x="210" y="128" width="80" height="20" rx="3" />
            <rect className="ui-line" x="222" y="136" width="56" height="4" rx="2" />
          </g>
        </g>
        <text className="ui-label ui-state" x="258" y="106">
          H1 · ON
        </text>
      </g>
    </svg>
  )
}
