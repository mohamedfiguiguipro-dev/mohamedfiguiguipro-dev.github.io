type Props = { direction?: 'right' | 'down' | 'up-right' }

const rotation = { right: 0, down: 90, 'up-right': -45 }

/** Flèche des boutons. La rotation est portée par le tracé pour laisser le CSS animer le SVG. */
export function ArrowIcon({ direction = 'right' }: Props) {
  return (
    <svg
      className={`arrow arrow--${direction}`}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`rotate(${rotation[direction]} 9 9)`}>
        <path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      </g>
    </svg>
  )
}
