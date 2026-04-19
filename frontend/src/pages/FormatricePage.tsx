/**
 * @file pages/FormatricePage.tsx
 * @description Page biographique d'Annick Le Goasteller, artisane et formatrice.
 */

import styles from './StaticPage.module.css';

/**
 * Page "La formatrice" — biographie et références d'Annick Le Goasteller.
 *
 * @returns Élément `<main>` de la page formatrice.
 */
export function FormatricePage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Votre formatrice</p>
        <h1 className="section-title">Annick Le Goasteller</h1>

        <div className={styles.content}>
          <div className={styles.profileGrid}>
            <div className={styles.portraitLarge} aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="22" r="12" fill="currentColor" opacity="0.3" />
                <path d="M4 54 C4 40 52 40 52 54" fill="currentColor" opacity="0.3" />
              </svg>
              <span>Portrait d'Annick</span>
            </div>

            <div>
              <p className={styles.subtitle}>Artisane &amp; Formatrice · Trébrivan, Bretagne</p>

              <section className={styles.block}>
                <h2>Parcours</h2>
                <p>
                  Annick Le Goasteller est artisane chantourneuse établie à Trébrivan,
                  au cœur de la Bretagne. Passionnée par le travail du bois depuis de
                  nombreuses années, elle partage aujourd'hui son savoir-faire lors
                  de stages accessibles à tous.
                </p>
              </section>

              <section className={styles.block}>
                <h2>Références</h2>
                <blockquote className={styles.quote}>
                  Elle réalise les décors des harpes celtiques pour les prestigieuses
                  harpes CAMAC — Stivell, Aziliz, Janet.
                </blockquote>
                <p>
                  Annick participe à de nombreux salons, expose en boutiques et galeries,
                  et est régulièrement sollicitée pour la réalisation de trophées
                  personnalisés pour collectivités et entreprises.
                </p>
              </section>

              <section className={styles.block}>
                <h2>Pédagogie</h2>
                <p>
                  Sa méthode repose sur le partage sans retenue de ses techniques et
                  astuces maison. Elle favorise la pratique immédiate sur des projets
                  personnels, dans une ambiance chaleureuse et bienveillante.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
