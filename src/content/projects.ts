import type { Project, Shot } from './types'

/*
 * Règles : aucune capture, statistique, technologie ou résultat inventé.
 * Ce qui n’est pas fourni reste dans `missing` et n’apparaît qu’en aperçu.
 *
 * Ajouter une capture : déposer public/projets/<projet>/<nom>-<largeur>.webp
 * pour chaque largeur, puis ajouter une entrée `desktop(...)` ou `mobile(...)`.
 * Pour Voltude S / Pro : remplir `shots` du volet concerné (onglets). Sans aucune capture de volet,
 * présentation simple (objectifs + `partsNote`).
 */

/** Capture ordinateur 16:9, déclinée en 960, 1600 et 2400 px de large */
const desktop = (base: string, alt: string, caption: string): Shot => ({
  base: `projets/${base}`,
  widths: [960, 1600, 2400],
  width: 2400,
  height: 1350,
  device: 'desktop',
  alt,
  caption,
})

/** Capture téléphone (1170 × 2532), déclinée en 480, 780 et 1170 px de large */
const mobile = (base: string, alt: string, caption: string): Shot => ({
  base: `projets/${base}`,
  widths: [480, 780, 1170],
  width: 1170,
  height: 2532,
  device: 'mobile',
  alt,
  caption,
})

export const projects: Project[] = [
  {
    id: 'voltude',
    index: '01',
    name: 'Voltude',
    kind: 'Logiciel pédagogique',
    status: 'En développement',
    pitch:
      'Un logiciel pédagogique pour les métiers de l’électricité, imaginé par quelqu’un qui les apprend sur le terrain. Deux volets : Voltude S pour les étudiants, Voltude Pro pour les formateurs et les établissements.',
    facts: {
      besoin:
        'Les notions d’électricité (circuits, schémas, protections) sont souvent abstraites quand on les découvre. Voltude cherche à les rendre plus visuelles et plus progressives, pour l’étudiant comme pour le formateur qui l’accompagne.',
      contribution:
        'Je conduis le projet avec l’assistance de l’IA : je définis les besoins, je choisis les fonctionnalités, je teste chaque version et je suis les corrections.',
      ia: 'Le code est produit avec l’IA, selon la méthode décrite dans « Ma démarche ».',
      resultat: 'Projet en développement, pas encore diffusé.',
      apprentissage:
        'Découper un besoin en fonctionnalités, penser un même produit pour deux publics, lire le code pour comprendre ce qu’il fait, et relier mon métier à un outil numérique.',
    },
    stages: [
      {
        label: 'Vérifié',
        note: 'constaté sur une version locale, le 20 octobre 2026',
        items: [
          'Accueil commun aux deux volets : chacun choisit son profil, étudiant ou formateur.',
          'Écrans de connexion et de création de compte pour les profils étudiant et formateur.',
        ],
      },
      { label: 'Confirmé par Mohamed', items: [] },
      { label: 'Envisagé', items: [] },
    ],
    // Écrans réels accessibles sans compte (aucune donnée personnelle).
    shots: [
      desktop(
        'voltude/accueil-ordinateur',
        'Accueil de Voltude : « La plateforme de formation dédiée aux métiers de l’électricité », avec deux choix : « Je suis élève » et « Je suis formateur ».',
        'Accueil public et choix du profil — ordinateur',
      ),
      mobile(
        'voltude/accueil-mobile',
        'Accueil de Voltude sur téléphone : le choix entre « Je suis élève » et « Je suis formateur ».',
        'Accueil public — mobile',
      ),
    ],
    partsNote:
      'Ces captures présentent les écrans d’accès de Voltude S et Pro. Elles ne démontrent pas le fonctionnement des fonctionnalités internes.',
    parts: [
      {
        id: 'voltude-s',
        name: 'Voltude S',
        audience: 'Student — pour les étudiants',
        intent: 'Apprendre et réviser les notions d’électricité à son rythme, et rejoindre sa classe.',
        shown: 'Écran de connexion du profil étudiant, sur téléphone.',
        shots: [
          mobile(
            'voltude/student-connexion-mobile',
            'Écran de connexion de Voltude sur téléphone : « Bon retour. Connectez-vous pour reprendre vos révisions. », bouton « Continuer avec Google », champs email et mot de passe vides, lien « Créer un compte ».',
            'Connexion Voltude S — mobile',
          ),
        ],
      },
      {
        id: 'voltude-pro',
        name: 'Voltude Pro',
        audience: 'Pour les formateurs et les établissements',
        intent:
          'Organiser ses classes, préparer des QCM et suivre la progression des étudiants. À terme : un suivi global et des bulletins.',
        shown: 'Écran de connexion du profil formateur, sur téléphone.',
        shots: [
          mobile(
            'voltude/pro-connexion-mobile',
            'Écran de connexion de Voltude Pro sur téléphone, marqué « PRO » : « Bon retour. Connectez-vous pour retrouver vos classes et vos QCM. », bouton « Continuer avec Google », champs email et mot de passe vides, lien « Créer un compte ».',
            'Connexion Voltude Pro — mobile',
          ),
        ],
      },
    ],
  },
  {
    id: 'assa-sport',
    index: '02',
    name: 'ASSA Sport',
    kind: 'Marque d’équipement de football',
    status: 'Contribution en cours',
    pitch:
      'ASSA Sport est une marque de maillots, de ballons et d’équipements personnalisables, destinée aux clubs de football. J’y contribue sur la négociation, le marketing et le numérique.',
    facts: {
      besoin:
        'Faire connaître la marque, développer sa présence en ligne et avancer sur le plan commercial auprès des clubs et des partenaires.',
      contribution:
        'Je participe à la négociation et au marketing de la marque, ainsi qu’à son projet numérique.',
      ia: 'Sur le volet numérique, je conduis mon travail avec l’assistance de l’IA, selon la méthode décrite dans « Ma démarche ».',
      resultat:
        'Le site de la marque est en ligne : collection, fiches produits, configurateur de tenue et demande de devis. Ma contribution se poursuit.',
      apprentissage:
        'Négocier et défendre une proposition, penser marketing et expérience client, coordonner plusieurs volets d’un même projet.',
    },
    factLabels: { apprentissage: 'Ce que j’ai appris' },
    link: {
      href: 'https://assasport.com',
      label: 'assasport.com',
      checked: '2026-10-23',
    },
    shots: [
      desktop(
        'assa-sport/accueil-ordinateur',
        'Page d’accueil du site ASSA : le titre « Forgé pour le football. Construit pour la légende. » sur un portrait en tons dorés.',
        'Page d’accueil — ordinateur',
      ),
      mobile(
        'assa-sport/accueil-mobile',
        'Page d’accueil du site ASSA affichée sur téléphone, avec le bouton « Voir la collection ».',
        'Page d’accueil — mobile',
      ),
      // Fiches recadrées sur le bloc produit complet.
      desktop(
        'assa-sport/fiche-maillot-ordinateur',
        'Fiche produit de la tenue ASSA Tempo Pure White : mannequin en tenue blanche, choix de cinq coloris, caractéristiques et bouton « Configurer & demander un devis ».',
        'Fiche maillot — ordinateur',
      ),
      desktop(
        'assa-sport/fiche-ballon-ordinateur',
        'Fiche du ballon ASSA Elite White sur le site ASSA : ballon blanc à motifs bleus, taille officielle 5, caractéristiques et bouton « Demander un devis ».',
        'Fiche ballon — ordinateur',
      ),
    ],
    shotsNote:
      'Captures des pages publiques d’assasport.com, sans compte : accueil, fiche d’une tenue et fiche d’un ballon.',
  },
  {
    id: 'north-origin',
    index: '03',
    name: 'North Origin',
    kind: 'Site vitrine streetwear',
    status: 'Participation',
    pitch:
      'North Origin est une marque streetwear. Je participe à la création de son site vitrine, avec un travail sur la présentation des produits et l’affichage mobile.',
    facts: {
      besoin:
        'Présenter les produits de la marque clairement, avec un affichage soigné quel que soit l’écran.',
      contribution: 'La présentation des produits (collection et fiches) et l’affichage sur téléphone.',
      ia: 'Je m’appuie sur l’IA pour avancer sur la réalisation du site, puis vérifier le rendu et demander des corrections.',
      resultat: 'Le site présente la collection et une fiche par produit, sur ordinateur comme sur téléphone.',
      apprentissage:
        'La mise en page adaptée aux écrans, la hiérarchie d’une fiche produit, et l’importance de tester sur de vrais appareils.',
    },
    factLabels: { apprentissage: 'Ce que j’ai appris' },
    shots: [
      mobile(
        'north-origin/accueil-mobile',
        'Page d’accueil de North Origin sur téléphone : portrait en sweat clair et titre « From higher ground. »',
        'Page d’accueil — mobile',
      ),
      desktop(
        'north-origin/accueil-ordinateur',
        'Page d’accueil de North Origin sur ordinateur : deux personnes en tenue claire sur fond sombre, titre « From higher ground. »',
        'Page d’accueil — ordinateur',
      ),
      desktop(
        'north-origin/collection-ordinateur',
        'Section collection Altitude : trois sweats à capuche (Onyx, Émeraude, Glacier) présentés en grille.',
        'Collection — ordinateur',
      ),
      desktop(
        'north-origin/fiche-produit-ordinateur',
        'Fiche produit du sweat Glacier : photo, caractéristiques et choix parmi sept coloris.',
        'Fiche produit — ordinateur',
      ),
    ],
    shotsNote:
      'Captures du site vitrine : l’accueil (image fixe tirée de sa vidéo d’accueil), la collection et une fiche produit.',
  },
  {
    id: 'life-tracker',
    index: '04',
    name: 'Life Tracker',
    kind: 'Apprentissage Python',
    status: 'Projet d’apprentissage en cours',
    pitch:
      'Mon terrain d’entraînement en Python : un petit outil de suivi de tâches que je construis moi-même, au rythme de mon apprentissage.',
    facts: {
      besoin:
        'Apprendre Python sur un besoin concret plutôt que sur des exercices isolés.',
      contribution: 'J’écris le code moi-même : c’est le but du projet.',
      ia: 'Ici, l’IA ne produit pas le code : elle m’explique les notions et m’aide à comprendre mes erreurs.',
      resultat: 'Projet d’apprentissage en cours, pas un outil terminé.',
      apprentissage:
        'Écrire du code moi-même, comprendre mes erreurs et progresser étape par étape.',
    },
    progress: {
      done: [],
      planned: [
        'Ajouter, terminer et lister des tâches',
        'Suivre une progression personnelle dans le temps',
      ],
    },
  },
]
