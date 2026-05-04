/**
 * @file components/Navbar.tsx
 * @description Barre de navigation principale — sticky, responsive avec menu hamburger mobile.
 */

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

/**
 * Entrée de navigation.
 */
interface NavItem {
  /** Libellé affiché. */
  label: string;
  /** Chemin React Router. */
  to: string;
}

/** Liste des liens de navigation. */
const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Le stage', to: '/stage' },
  { label: 'Nos formules', to: '/formules' },
  { label: 'S\'inscrire', to: '/inscription' },
  { label: 'Pratique', to: '/hebergement' },
  { label: 'Votre formatrice', to: '/formatrice' },
  { label: 'Médias', to: '/presse' },
  { label: 'Contact', to: '/contact' },
];

/**
 * Composant de navigation principale du site.
 *
 * Fonctionnalités :
 * - Sticky en haut de page avec ombre légère après défilement
 * - Menu hamburger sur mobile
 * - Lien actif mis en évidence via React Router `NavLink`
 *
 * @returns Élément `<header>` contenant la barre de navigation.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <NavLink to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoMain}>Stage Bois Bretagne</span>
          <span className={styles.logoSub}>Chantournage · Centre Bretagne</span>
        </NavLink>

        {/* Liens desktop */}
        <nav className={styles.nav} aria-label="Navigation principale">
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }: { isActive: boolean }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bouton hamburger mobile */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Menu mobile déroulant */}
      <nav
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul>
          {NAV_ITEMS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }: { isActive: boolean }) =>
                  `${styles.mobileLink} ${isActive ? styles.active : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
