/** Visuel d’un projet. Sans `src`, une illustration neutre est affichée
 *  (jamais présentée comme une capture) et `missing` est signalé en aperçu. */
export type Visual = {
  /** Chemin dans /public, ex. "projets/voltude-accueil.webp" */
  src?: string
  alt: string
  width?: number
  height?: number
  /** Format du cadre : paysage, large ou portrait (affichage mobile) */
  ratio: 'landscape' | 'wide' | 'portrait'
  /** Ce qu’il faut fournir tant que `src` est vide */
  missing?: string
}

/**
 * Capture réelle d’un projet, déclinée en plusieurs largeurs.
 * Fichiers attendus : public/<base>-<largeur>.webp pour chaque largeur de `widths`
 * (ex. base "projets/assa-sport/accueil-ordinateur", widths [960, 1600, 2400]).
 */
export type Shot = {
  base: string
  widths: number[]
  /** Dimensions de la plus grande version (pour le ratio) */
  width: number
  height: number
  device: 'desktop' | 'mobile'
  alt: string
  /** Légende courte et fidèle à ce que montre l’image */
  caption: string
}

export type Project = {
  id: string
  index: string
  name: string
  kind: string
  status: string
  pitch: string
  facts: {
    besoin: string
    contribution: string
    /** Facultatif : seulement quand le rôle de l’IA sur ce projet est confirmé */
    ia?: string
    resultat: string
    apprentissage: string
  }
  /** Intitulés propres au projet (ex. « Ce que j’ai appris » pour un travail déjà réalisé) */
  factLabels?: Partial<Record<keyof Project['facts'], string>>
  /** Ce que montrent les captures du projet, affiché sous la galerie */
  shotsNote?: string
  /** Distinction réalisé / envisagé (utile pour les projets d’apprentissage) */
  progress?: {
    done: string[]
    planned: string[]
  }
  /**
   * État d’avancement par étapes (« Déjà en place », « En développement », « Envisagé »).
   * N’y mettre que ce qui est vérifié ; une étape sans élément n’est pas affichée.
   */
  stages?: { label: string; note?: string; items: string[] }[]
  link?: {
    href: string
    label: string
    /** Date à laquelle le lien a été vérifié */
    checked: string
  }
  /** Captures réelles : la première est mise en avant. Prioritaire sur `visual`. */
  shots?: Shot[]
  visual?: Visual
  /** Volets d’un même projet (ex. Voltude S et Voltude Pro) */
  parts?: ProjectPart[]
  /** Titre des volets sans capture (présentation simple) ; note affichée sous les volets dans les deux présentations */
  partsTitle?: string
  partsNote?: string
  /** Informations à confirmer ou à fournir (affichées uniquement en aperçu) */
  missing?: string[]
}

export type ProjectPart = {
  id: string
  name: string
  audience: string
  /** Intention du volet (ce à quoi il doit servir), pas une liste de fonctions livrées */
  intent: string
  /** Ce que montrent réellement les captures du volet */
  shown?: string
  /** Captures à ajouter plus tard : laisser vide tant qu’elles n’existent pas */
  shots: Shot[]
  missing?: string
}
