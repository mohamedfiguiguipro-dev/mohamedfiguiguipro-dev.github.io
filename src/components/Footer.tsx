import { footer, person } from '../content/site'

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {person.name}
      </p>
      <p className="site-footer__note">{footer.note}</p>
      <a className="text-link" href="#accueil">
        <span>Haut de page</span>
      </a>
    </footer>
  )
}
