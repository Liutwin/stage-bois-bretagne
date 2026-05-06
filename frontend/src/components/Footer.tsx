/**
 * @file components/Footer.tsx
 * @description Pied de page du site Stage Bois Bretagne.
 */

import { NavLink } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

/**
 * Pied de page commun à toutes les pages publiques.
 *
 * Affiche :
 * - L'identité du site et l'adresse
 * - Les liens de navigation secondaires
 * - Les informations de contact
 * - Le copyright
 *
 * @returns Élément `<footer>`.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Identité */}
        <div className={styles.col}>
          <div className={styles.footerLogo}>Stage Bois Bretagne</div>
          <p>Stages de chantournage<br />au cœur de la Bretagne</p>
          <p className={styles.address}>
            3 Kermoal<br />
            22340 Trébrivan
          </p>
        </div>

        {/* Navigation */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Navigation</h4>
          <ul className={styles.linkList}>
            {[
              ['Le stage', '/stage'],
              ['Nos formules', '/formules'],
              ['S\'inscrire', '/inscription'],
              ['Pratique', '/hebergement'],
              ['Votre formatrice', '/formatrice'],
              ['Contact', '/contact'],
            ].map(([label, to]) => (
              <li key={to}>
                <NavLink to={to} className={styles.footerLink}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Contact</h4>
          <p>
            <a href="tel:0296297197" className={styles.footerLink}>
              02 96 29 71 97
            </a>
          </p>
          <p>
            <a href="mailto:contact@stageboisbretagne.com" className={styles.footerLink}>
              contact@stageboisbretagne.com
            </a>
          </p>
          <p className={styles.social}>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Stage+Bois+Trébrivan"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Voir sur Google Maps →
            </a>
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {year} Stage Bois Bretagne · Annick Le Goasteller</span>
        <span className={styles.bottomLinks}>
          <NavLink to="/mentions-legales" className={styles.footerLink}>Mentions légales</NavLink>
          <NavLink to="/politique-de-confidentialite" className={styles.footerLink}>Politique de confidentialité</NavLink>
        </span>
        <span>Site réalisé par Liutwin Piernet</span>
      </div>
    </footer>
  );
}
