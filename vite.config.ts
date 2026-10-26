import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Seule variable d’environnement lue ici (évite d’ajouter @types/node pour une ligne).
declare const process: { env: Record<string, string | undefined> }

/**
 * Métadonnées de partage. Les réseaux exigent des adresses absolues pour og:image et og:url :
 * elles ne sont ajoutées que si SITE_URL est fournie au build, par exemple
 *   SITE_URL=https://<identifiant>.github.io/portfolio/ npm run build
 * Sans SITE_URL, seule une image relative est déclarée (aucun domaine inventé).
 */
function shareMeta(): Plugin {
  const site = process.env.SITE_URL?.trim()
  const url = site ? (site.endsWith('/') ? site : `${site}/`) : ''
  return {
    name: 'share-meta',
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        { tag: 'meta', attrs: { property: 'og:image', content: `${url || './'}og-image.png` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Mohamed Figuigui — Comprendre les systèmes. Concevoir des logiciels. Courant faible, projets avec l’IA, Python.' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ]
      if (url) {
        tags.push({ tag: 'meta', attrs: { property: 'og:url', content: url } })
        tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url } })
      }
      return tags.map((t) => ({ ...t, injectTo: 'head' }))
    },
  }
}

/**
 * Précharge la police des titres (Archivo, sous-ensemble latin) : elle arrive avec le JavaScript
 * au lieu d’être découverte après la feuille de style, ce qui évite une seconde mise en page
 * complète au premier affichage (mesuré : ≈ 75 ms à pleine vitesse, plus sur un téléphone lent).
 */
function preloadTitleFont(): Plugin {
  return {
    name: 'preload-title-font',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      const file = Object.keys(ctx.bundle ?? {}).find((f) => /archivo-latin-wdth-normal-.*\.woff2$/.test(f))
      if (!file) return []
      return [
        {
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `./${file}`, crossorigin: '' },
          injectTo: 'head',
        },
      ]
    },
  }
}

// base relative : le site fonctionne aussi bien sur
// https://<identifiant>.github.io/ que sur https://<identifiant>.github.io/<depot>/
export default defineConfig({
  base: './',
  plugins: [react(), shareMeta(), preloadTitleFont()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
})
