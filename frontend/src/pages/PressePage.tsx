/**
 * @file pages/PressePage.tsx
 * @description Page des coupures de presse — articles et mentions dans les médias.
 */

import styles from '../styles/StaticPage.module.css';
import pressStyles from '../styles/PressePage.module.css';

/**
 * Page "La presse" — revue de presse et articles consacrés au stage.
 *
 * @returns Élément `<main>` de la page presse.
 */
export function PressePage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Médias</p>
        <h1 className="section-title">La presse en parle</h1>

        <div className={styles.content}>
          <section className={styles.block}>
            <p>
              Retrouvez ici les articles et reportages consacrés au stage de chantournage
              en Centre Bretagne.
            </p>
          </section>

          {/* Articles de presse */}
          <div className={pressStyles.grid}>

            {/* Article 1 — placeholder */}
            <article className={pressStyles.card}>
              <div className={pressStyles.cardMeta}>
                <span className={pressStyles.source}>Le Télégramme</span>
                <span className={pressStyles.date}>À venir</span>
              </div>
              <h2 className={pressStyles.cardTitle}>Titre de l'article</h2>
              <p className={`${styles.block} ${styles.placeholder}`}>
                Extrait ou résumé de l'article à renseigner.
              </p>
            </article>

            {/* Article 2 — placeholder */}
            <article className={pressStyles.card}>
              <div className={pressStyles.cardMeta}>
                <span className={pressStyles.source}>Ouest-France</span>
                <span className={pressStyles.date}>À venir</span>
              </div>
              <h2 className={pressStyles.cardTitle}>Titre de l'article</h2>
              <p className={`${styles.block} ${styles.placeholder}`}>
                Extrait ou résumé de l'article à renseigner.
              </p>
            </article>

          </div>
        </div>
      </div>
    </main>
  );
}
