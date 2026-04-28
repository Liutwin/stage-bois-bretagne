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
            <h2>Découvrir le chantournage</h2>
            <p>
              Le chantournage est l'art de découper des formes sinueuses dans le bois
              à l'aide d'une scie à chantourner. Technique accessible dès le plus jeune
              âge, elle permet de réaliser des créations allant du simple jouet aux
              découpes tridimensionnelles les plus élaborées.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Programme type</h2>
            <ul className={styles.list}>
              <li>Découverte du matériel et des règles de sécurité</li>
              <li>Transfert et fixation des gabarits</li>
              <li>Découpe guidée pas à pas</li>
              <li>Finitions : ponçage, peinture, vernis</li>
              <li>Réalisation d'un projet personnel encadré</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
