/*
 * Contenu général du site. Modifier ici, pas dans les composants.
 * Règles : rester honnête sur le niveau, ne rien inventer
 * (diplôme obtenu, clients, chiffres, poste de développeur ou de chef de projet).
 */

export const person = {
  name: 'Mohamed Figuigui',
  email: 'mohamedfiguiguipro.dev@gmail.com',
  /** Téléphone : `display` affiché, `tel` pour le lien. null = non affiché. */
  phone: { display: '06 99 23 03 14', tel: '+33699230314' } as { display: string; tel: string } | null,
  /**
   * CV : déposer le PDF dans public/ (ex. public/cv/Mohamed-Figuigui-CV.pdf)
   * puis renseigner son chemin ici. Tant que la valeur est null,
   * aucun bouton de téléchargement n’est affiché.
   */
  cv: null as string | null,
  /** Liens publics facultatifs (LinkedIn, GitHub). Vides = non affichés. */
  links: [] as { label: string; href: string }[],
}

export const nav = [
  { id: 'projets', label: 'Projets' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'demarche', label: 'Démarche' },
  { id: 'realiser', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const

export const hero = {
  /** Badges de l’accueil, affichés séparés par « · » */
  badges: ['Courant faible', 'Projets avec l’IA', 'Python'],
  /** Direction personnelle, pas une affirmation de maîtrise professionnelle. */
  title: ['Comprendre les systèmes.', 'Concevoir des logiciels.'],
  subtitle: [
    'Technicien en courant faible chez Phibor, je travaille sur les systèmes de sécurité incendie (SSI), notamment les CMSI, et le contrôle d’accès. En parallèle, je conçois des projets numériques avec l’assistance de l’IA et j’apprends à programmer.',
  ],
  primary: { label: 'Voir mes réalisations', href: '#projets' },
  secondary: { label: 'Me contacter', href: '#contact' },
  legend: [
    { label: 'Aujourd’hui', text: 'Technicien en courant faible chez Phibor — VINCI Energies, depuis janvier 2026.' },
    { label: 'En cours', text: 'Apprentissage de Python — niveau débutant.' },
    { label: 'Objectif', text: 'Progresser en développement, en automatisation et en conception de logiciels.' },
  ],
}

export const projectsIntro = {
  title: 'Projets',
  lead: 'Quatre projets, quatre façons d’apprendre : une plateforme de formation, deux sites de marque et un outil pour apprendre Python.',
}

export const parcours = {
  title: 'Parcours',
  heading: 'Mon parcours et mes objectifs',
  lead: 'Sur le terrain, les systèmes de sécurité incendie et le contrôle d’accès m’apprennent à comprendre des enchaînements logiques, vérifier des connexions et rechercher l’origine d’un problème. Je retrouve cette démarche en programmation.',
  timeline: [
    {
      when: 'Depuis janvier 2026',
      title: 'Technicien en courant faible — Phibor, VINCI Energies',
      text: 'SSI, CMSI, contrôle d’accès et vérifications de continuité.',
      state: 'now' as const,
    },
    {
      when: '2026',
      title: "Projets numériques avec l’IA",
      text: 'Voltude, ASSA Sport, North Origin : définir les besoins, organiser les étapes, suivre les corrections.',
      state: 'now' as const,
    },
    {
      when: 'En continu',
      title: 'Apprentissage de Python',
      text: 'Niveau débutant, avec un projet concret pour progresser : Life Tracker.',
      state: 'now' as const,
    },
    {
      when: 'Ensuite',
      title: 'Progresser vers la conception de logiciels',
      text: 'Développer mes compétences en programmation et en automatisation, avec l’objectif de devenir ingénieur logiciel. Je suis ouvert à une formation en alternance, à un emploi accompagné et à des collaborations adaptées à mon niveau.',
      state: 'goal' as const,
    },
  ],
  /** Rapprochements simples entre le courant faible et la programmation, sans explication de sécurité. */
  bridges: [
    {
      field: 'SSI / CMSI',
      text: 'Comprendre les informations reçues et les enchaînements de commande. Un programme aussi reçoit des informations et enchaîne des actions.',
    },
    {
      field: "Contrôle d’accès",
      text: 'Comprendre les conditions et les autorisations : qui peut passer, et dans quels cas. On écrit le même type de règles dans un programme.',
    },
    {
      field: 'Continuité',
      text: 'Vérifier méthodiquement et rechercher les anomalies. Je teste mes projets avec la même méthode.',
    },
  ],
}

export const demarche = {
  title: 'Ma démarche',
  heading: 'L’IA comme outil, le projet en main.',
  lead: [
    'Dans mes projets, l’IA m’aide à produire du code. Je définis les besoins, fais les choix, teste les versions et demande les corrections. En parallèle, j’apprends Python en écrivant moi-même du code pour gagner en compréhension et en autonomie.',
    'Je suis aussi l’évolution des outils d’IA, j’explore des projets sur GitHub et je m’intéresse à la façon dont ces technologies sont construites.',
  ],
  steps: [
    {
      title: 'Définir le besoin',
      text: 'À qui ça sert, quel problème on règle, ce qui compte vraiment.',
    },
    {
      title: 'Choisir les fonctionnalités',
      text: 'Prioriser, mettre de côté ce qui peut attendre, garder un objectif clair.',
    },
    {
      title: "Produire avec l’IA",
      text: 'Des demandes précises, une étape à la fois, en gardant la main sur les décisions.',
    },
    {
      title: 'Tester',
      text: 'Comparer au besoin, repérer les défauts, faire corriger.',
    },
    {
      title: 'Comprendre',
      text: 'Revenir sur le code produit, poser des questions, apprendre Python pour aller plus loin seul.',
    },
  ],
}

export const objectif = {
  title: 'Objectifs',
  big: ['Apprendre,', 'construire.'],
  lead: 'Mon objectif est de concevoir des logiciels utiles et de comprendre leur fonctionnement. Je cherche un cadre où apprendre, contribuer et confronter mes idées à des besoins réels.',
  domainsTitle: 'Domaines d’intérêt',
  /** Le premier domaine est la direction principale ; les autres ne sont pas des expertises acquises. */
  domains: [
    'Conception de logiciels',
    'Programmation et automatisation',
    'Intelligence artificielle',
    'Cybersécurité',
    'Gestion technique du bâtiment',
  ],
  domainsNote: 'La conception de logiciels est ma direction principale ; les autres domaines sont des centres d’intérêt.',
  /** La méthode de travail est décrite une seule fois, dans « Ma démarche ». */
  goals: {
    title: 'Mes objectifs',
    items: [
      'Maîtriser progressivement Python et les fondamentaux de la programmation.',
      'Comprendre et expliquer le code de mes projets.',
      'Apprendre à concevoir, tester et maintenir des logiciels.',
    ],
  },
  cta: { label: 'Proposer un échange', href: '#contact' },
}

/** Types de réalisations à discuter : ni références clients, ni tarifs, ni résultats. */
export const services = {
  title: 'Services',
  heading: 'Ce que je peux réaliser',
  lead: 'Pour une petite entreprise, une marque ou un projet qui démarre : trois types de réalisations, à taille humaine, menées avec des outils d’IA selon ma démarche.',
  items: [
    {
      title: 'Sites vitrines et pages de présentation',
      text: 'Présenter une activité, une marque ou un projet, avec un affichage adapté à l’ordinateur comme au téléphone.',
      deliverable: 'un site vitrine ou une page de présentation.',
      ref: { label: 'Exemple : North Origin', href: '#projet-north-origin' },
    },
    {
      title: 'Vidéos de démonstration et contenus animés',
      text: 'Présenter en peu de temps un produit, une fonctionnalité ou une idée.',
      deliverable: 'une vidéo courte, avec montage, textes et animations.',
    },
    {
      title: 'Contenus et supports marketing',
      text: 'Mettre en valeur des produits et préparer des contenus pour les réseaux sociaux.',
      deliverable: 'des visuels et des textes adaptés à un objectif de communication.',
    },
  ] as { title: string; text: string; deliverable: string; ref?: { label: string; href: string } }[],
  note: 'Nous définissons ensemble le périmètre, les livrables et les délais adaptés à votre projet.',
  cta: { label: 'Parler de votre projet', href: '#contact' },
}

export const contact = {
  title: 'Contact',
  heading: 'Écrivez-moi ou appelez-moi.',
  lead: 'Une opportunité professionnelle, une collaboration ou un projet pour votre activité : choisissez le sujet, je réponds personnellement.',
  /** Chaque accès ouvre une petite fenêtre : adresse à copier, messagerie avec objet rempli, téléphone. Aucun envoi automatique. */
  intents: [
    {
      id: 'opportunite',
      label: 'Opportunité professionnelle',
      subject: 'Opportunité professionnelle',
      text: 'Emploi, alternance, collaboration',
      intro: 'Pour un emploi, une alternance ou une collaboration : écrivez-moi en précisant le poste ou le contexte.',
    },
    {
      id: 'projet',
      label: 'Parlons de votre projet',
      subject: 'Votre projet',
      text: 'Site, vidéo, contenus',
      intro: 'Pour un site, une vidéo ou des contenus : décrivez votre besoin en quelques lignes, nous en discuterons ensemble.',
    },
  ],
  availability:
    'Technicien en courant faible chez Phibor — VINCI Energies. Les projets se mènent en parallèle de mon activité, avec des délais convenus ensemble.',
  dialog: {
    emailLabel: 'Adresse email',
    copy: 'Copier l’adresse',
    copied: 'Adresse copiée',
    copyFailed: 'La copie automatique n’a pas fonctionné. L’adresse ci-dessus reste sélectionnable : vous pouvez la copier à la main.',
    mail: 'Ouvrir ma messagerie',
    phoneLabel: 'Téléphone',
    close: 'Fermer',
  },
}

export const footer = {
  note: "Site conçu et développé avec l’assistance de l’IA — en cohérence avec ma démarche.",
}
