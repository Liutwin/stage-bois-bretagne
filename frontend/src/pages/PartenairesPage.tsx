/**
 * @file pages/PartenairesPage.tsx
 * @description Page des partenaires — logos et liens.
 * Contenu statique à compléter par la cliente.
 */

import styles from './StaticPage.module.css';

/**
 * Page "Partenaires".
 *
 * @returns Élément `<main>` de la page partenaires.
 */
export function PartenairesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Partenaires</p>
        <h1 className="section-title">Nos partenaires</h1>
        <div className={styles.content}>
          <section className={styles.block}>
            <p className={styles.placeholder}>
              [Logos et liens des partenaires à compléter par la cliente]
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
