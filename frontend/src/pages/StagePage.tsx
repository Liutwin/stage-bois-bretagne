/**
 * @file pages/StagePage.tsx
 * @description Page de présentation détaillée du stage de chantournage.
 * Contenu statique — à compléter avec les textes et photos fournis par la cliente.
 */

import styles from '../styles/StaticPage.module.css';
import { PageSEO } from '@/components/PageSEO';

/**
 * Page "Le stage" — description du programme et des méthodes pédagogiques.
 *
 * @returns Élément `<main>` de la page stage.
 */
export function StagePage() {
  return (
    <main className={styles.page}>
      <PageSEO
        title="Le stage de chantournage — Stage Bois Bretagne"
        description="Découvrez le programme du stage : techniques de chantournage, matériel fourni et déroulement des journées à Trébrivan (22)."
        path="/stage"
      />
      <div className={styles.inner}>
        <p className="section-label">Programme</p>
        <h1 className="section-title">Le stage de chantournage</h1>

        <div className={styles.content}>
          <section className={styles.block}>
            <h2>« Chantournage », mais qu'est-ce donc ?</h2>
            <p>
              C'est une technique de découpe fine du bois réalisée à la scie à chantourner, cette merveilleuse machine aux étonnantes possibilités ! 
              Elle permet de créer des formes délicates, ajourées et très précises. A vous les puzzles et toutes sortes de jouets, les objets décoratifs,
              les bijoux, les découpes tridimensionnelles, les pièces artisanales uniques, qui n'auront qu'une seule limite : votre imagination ! 

            </p>
          </section>

          <section className={styles.block}>
            <h2>Programme type</h2>
            <ul className={styles.list}>
              <li>Découverte du matériel</li>
              <li>Préparation des gabarits</li>
              <li>Découpe guidée pas à pas</li>
              <li>Fabrication d'un mobile sur placage fin</li>
              <li>Réalisation d'un puzzle en bois massif, de la conception à la découpe</li>
              <li>Création d'une pièce décorative ajourée en bois massif</li>
              <li>Rencontre avec les principales essences de bois de pays</li>
            </ul>
          </section>
          <section className={styles.block}>
            <p>
              <i>Chacun pourra choisir, pour chaque exercice, son modèle préféré parmi plusieurs propositions adaptées à tous les niveaux.</i>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
