/**
 * Mode aperçu : signale les visuels et informations manquants.
 * Actif avec `npm run dev`, ou sur le build servi en local en ajoutant ?brouillon à l'adresse.
 * Jamais sur le site publié : les notes internes n'y sont pas affichées.
 */
const isLocalHost =
  typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)

export const isDraft =
  import.meta.env.DEV || (isLocalHost && new URLSearchParams(window.location.search).has('brouillon'))

/** Résout un chemin de /public quelle que soit l'adresse de publication (GitHub Pages). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
