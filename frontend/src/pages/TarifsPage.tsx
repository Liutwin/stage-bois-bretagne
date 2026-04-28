/**
 * @file pages/TarifsPage.tsx
 * @description Page des tarifs et de la procédure d'inscription.
 * Contenu statique — grille tarifaire à compléter avec les tarifs réels de la cliente.
 */

import { Link } from 'react-router-dom';
import styles from '../styles/StaticPage.module.css';
import { PageSEO } from '@/components/PageSEO';

/**
 * Page "Tarifs & Inscriptions" — grille tarifaire et rappel de la procédure.
 *
 * @returns Élément `<main>` de la page tarifs.
 */
export function TarifsPage() {
  return (
    <main className={styles.page}>
      <PageSEO
        title="Tarifs & Inscriptions — Stage Bois Bretagne"
        description="Tarifs du stage de chantournage et modalités d'inscription. Formules avec ou sans hébergement sur place à Trébrivan."
        path="/tarifs"
      />
      <div className={styles.inner}>
        <p className="section-label">Tarifs & Inscriptions</p>
        <h1 className="section-title">Tarifs</h1>

        <div className={styles.content}>
          <section className={styles.block}>
            <h2>Grille tarifaire</h2>
            <p className={styles.placeholder}>
              [Tarifs à compléter par la cliente — prix par session, options repas, etc.]
            </p>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Formule</th>
                  <th>Durée</th>
                  <th>Tarif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stage d'initiation</td>
                  <td>12 heures (sur 2 jours)</td>
                  <td>230 €</td>
                </tr>
              </tbody>
            </table>

            <p className={styles.note}>
              Le tarif comprend l'encadrement, les matériaux de base, et un poste de travail individuel.< br />
              Les repas et l'hébergement ne sont pas inclus — voir la page{' '}
              <Link to="/hebergement" className={styles.link}>Hébergement & Repas</Link> pour plus de détails.
            </p>
          </section>

          <p className={styles.note}>
            Pour vous inscrire, consultez les disponibilités et suivez la procédure détaillée sur la page{' '}
            <Link to="/prochain-stage" className={styles.link}>Prochain stage</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
