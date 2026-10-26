# Mohamed Figuigui — Comprendre les systèmes. Concevoir des logiciels.

Code source de mon portfolio personnel.

Technicien en courant faible chez Phibor (VINCI Energies), je travaille sur les systèmes de sécurité incendie (SSI, CMSI) et le contrôle d’accès. En parallèle, je conçois des projets numériques avec l’assistance de l’IA et j’apprends Python (niveau débutant).

## Le site

Une page statique qui présente mes projets (Voltude, ASSA Sport, North Origin, Life Tracker), mon parcours, ma démarche et ce que je peux réaliser.

- **Technologies** : Vite, React et TypeScript, sans backend ni service tiers.
- **Animations** : en CSS uniquement. Elles respectent le réglage « réduire les animations » du système, et le contenu reste lisible sans elles.
- **Polices** : hébergées avec le site (Archivo, IBM Plex Mono).
- **Accessibilité** : titres hiérarchisés, focus visibles, textes alternatifs sur chaque capture, testé de 320 px à 1440 px de large.

## Comment il a été réalisé

Ce site a été conçu et développé **avec l’assistance de l’IA**. J’ai défini le contenu et les besoins, fait les choix, testé chaque version et demandé les corrections. La méthode est décrite dans la section « Ma démarche » du site.

## Lancer le site en local

Prérequis : Node.js 20.19+ ou 22.12+.

```bash
npm ci
npm run dev
```

Le site s’ouvre sur http://localhost:5173. Pour construire la version finale : `npm run build` (dossier `dist/`).

## Contenu et droits

- Tous les textes sont dans `src/content/`.
- Les captures des sites ASSA Sport et North Origin restent la propriété de ces marques. Elles sont affichées avec leur accord et ne peuvent pas être réutilisées.
- Les licences des composants tiers sont dans `public/licences-tiers.txt`.

## Contact

mohamedfiguiguipro.dev@gmail.com
