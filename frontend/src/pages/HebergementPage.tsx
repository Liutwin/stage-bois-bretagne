/**
 * @file pages/HebergementPage.tsx
 * @description Page des options d'hébergement et de restauration à proximité de Trébrivan.
 * Contenu statique — liste à compléter par la cliente.
 */

import styles from '../styles/StaticPage.module.css';

/**
 * Page "Hébergement / Repas".
 *
 * @returns Élément `<main>` de la page hébergement.
 */
export function HebergementPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Pratique</p>
        <h1 className="section-title">Hébergement &amp; Repas</h1>
        <div className={styles.content}>
          <section className={styles.block}>
            <h2>Hébergement à proximité</h2>
            <p className={styles.placeholder}>
              [Liste des hébergements recommandés à compléter par la cliente —
              gîtes, chambres d'hôtes, hôtels aux alentours de Trébrivan]
            </p>
          </section>
          <section className={styles.block}>
            <h2>Restauration</h2>
            <p className={styles.placeholder}>
              [Options de restauration à proximité à compléter par la cliente]
            </p>
          </section>
          <section className={styles.block}>
            <h2>Repas sur place</h2>
            <p>
              Selon les sessions, un repas convivial peut être organisé sur place.
              Renseignez-vous au moment de l'inscription.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
