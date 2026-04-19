/**
 * @file pages/FormatricePage.tsx
 * @description Page biographique d'Annick Le Goasteller, artisane et formatrice.
 */

import styles from './StaticPage.module.css';
import annickPhoto from '../assets/annick.jpg';

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
            <div className={styles.portraitLarge}>
              <img src={annickPhoto} alt="Annick" />
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
                  harpes CAMAC Stivell et Aziliz.
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
