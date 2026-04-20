/**
 * @file pages/TarifsPage.tsx
 * @description Page des tarifs et de la procédure d'inscription.
 * Contenu statique — grille tarifaire à compléter avec les tarifs réels de la cliente.
 */

import { Link } from 'react-router-dom';
import styles from '../styles/StaticPage.module.css';

/**
 * Page "Tarifs & Inscriptions" — grille tarifaire et rappel de la procédure.
 *
 * @returns Élément `<main>` de la page tarifs.
 */
export function TarifsPage() {
  return (
    <main className={styles.page}>
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
                  <td>Stage initiation</td>
                  <td>2 jours</td>
                  <td>À définir</td>
                </tr>
                <tr>
                  <td>Stage perfectionnement</td>
                  <td>3 jours</td>
                  <td>À définir</td>
                </tr>
              </tbody>
            </table>

            <p className={styles.note}>
              Le tarif comprend l'encadrement et les matériaux de base.
              Hébergement et repas non inclus — voir{' '}
              <Link to="/hebergement" className={styles.link}>la page hébergement</Link>.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Procédure d'inscription</h2>
            <ol className={styles.orderedList}>
              <li>Consultez les disponibilités sur la page <Link to="/prochain-stage" className={styles.link}>Prochain stage</Link>.</li>
              <li>Téléchargez et imprimez le bulletin d'inscription.</li>
              <li>Retournez le bulletin complété avec un chèque d'acompte (30 %) par courrier postal à :<br /><strong>Annick Le Goasteller, 3 Kermoal, 22340 Trébrivan</strong></li>
              <li>Votre inscription est confirmée à réception du courrier.</li>
              <li>Le solde est réglé à votre arrivée.</li>
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
