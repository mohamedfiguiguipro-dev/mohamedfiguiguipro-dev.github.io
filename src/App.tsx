import { nav } from './content/site'
import { useActiveSection } from './hooks/useActiveSection'
import { useReveal } from './hooks/useReveal'
import { isDraft } from './preview'
import { Contact } from './components/Contact'
import { Demarche } from './components/Demarche'
import { DraftPanel } from './components/DraftPanel'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Objectif } from './components/Objectif'
import { Parcours } from './components/Parcours'
import { Projects } from './components/Projects'
import { Services } from './components/Services'

const observed = ['accueil', ...nav.map((n) => n.id), 'objectif', 'realiser']

export function App() {
  useReveal()
  const active = useActiveSection(observed)

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Header active={active} />
      <main id="contenu" tabIndex={-1}>
        <Hero />
        <Projects />
        <Parcours />
        <Objectif />
        <Demarche />
        <Services />
        <Contact />
      </main>
      <Footer />
      {isDraft && <DraftPanel />}
    </>
  )
}
