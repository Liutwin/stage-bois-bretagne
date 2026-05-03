import { Link } from 'react-router-dom';
import styles from '../styles/StaticPage.module.css';
import formulesStyles from '../styles/FormulesPage.module.css';
import { PageSEO } from '@/components/PageSEO';

export function FormulesPage() {
  return (
    <main className={styles.page}>
      <PageSEO
        title="Formules & Tarifs — Stage Bois Bretagne"
        description="Formules et tarifs du stage de chantournage à Trébrivan : stage d'initiation (week-end) et stage de perfectionnement (journée)."
        path="/tarifs"
      />
      <div className={`${styles.inner} ${formulesStyles.inner}`}>
        <p className="section-label">Nos formules</p>
        <h1 className="section-title">Programme &amp; tarifs</h1>

        <p className={formulesStyles.intro}>
          Le tarif comprend l'encadrement, les matériaux de base et un poste de travail individuel.<br />
          Les repas et l'hébergement ne sont pas inclus —{' '}
          <Link to="/hebergement" className={styles.link}>voir la page Hébergement &amp; Repas</Link>.
        </p>

        <div className={`${styles.content} ${formulesStyles.content}`}>

          {/* ── Stage d'initiation ───────────────────────────────────────── */}
          <div className={formulesStyles.formuleCard}>
            <div className={formulesStyles.formuleHeader}>
              <div>
                <h2 className={formulesStyles.formuleTitle}>Stage d'initiation</h2>
                <p className={formulesStyles.formuleDuration}>12 heures · week-end</p>
              </div>
              <span className={formulesStyles.formulePrix}>230 €</span>
            </div>
            <div className={formulesStyles.formuleCardBody}>
              <p className={formulesStyles.programmeLabel}>Programme</p>
              <ul className={styles.list}>
                <li>Découverte du matériel et prise en main de la scie à chantourner</li>
                <li>Préparation des gabarits</li>
                <li>Découpe guidée pas à pas — découpe courbe simple en placage</li>
                <li>Fabrication d'un mobile sur placage fin, apprentissage de l'équilibre</li>
                <li>Réalisation d'un puzzle en bois massif, de la conception à la découpe</li>
                <li>Création d'une pièce décorative ajourée en bois massif</li>
                <li>Rencontre avec les principales essences de bois de pays</li>
              </ul>
              <p className={formulesStyles.formuleNote}>
                <em>Chacun choisit, pour chaque exercice, son modèle parmi plusieurs propositions adaptées à tous les niveaux.</em>
              </p>
            </div>
            <div className={formulesStyles.formuleCardFooter}>
              <Link to="/inscription" className="btn btn-primary">Voir les dates &amp; s'inscrire →</Link>
            </div>
          </div>

          {/* ── Journée de perfectionnement ──────────────────────────────── */}
          <div className={formulesStyles.formuleCard}>
            <div className={formulesStyles.formuleHeader}>
              <div>
                <h2 className={formulesStyles.formuleTitle}>Journée de perfectionnement</h2>
                <p className={formulesStyles.formuleDuration}>7 heures · journée</p>
              </div>
              <span className={formulesStyles.formulePrix}>140 €</span>
            </div>
            <div className={formulesStyles.formuleCardBody}>
              <p className={formulesStyles.programmeLabel}>Thèmes proposés</p>
              <ul className={styles.list}>
                <li><strong>Jouet à roulettes</strong> — mise en œuvre des systèmes d'articulation et de roues, normes de sécurité européennes, conception d'un cahier des charges</li>
                <li><strong>Découpe en 3D</strong> — réalisation d'une pièce d'échiquier pour comprendre le principe de la découpe tridimensionnelle</li>
                <li><strong>Découpe conique</strong> — réalisation d'un petit village en pyramide</li>
              </ul>
              <p className={formulesStyles.formuleNote}>
                <em>Ces journées sont organisées selon les demandes, à partir de 2 participants. Les thèmes peuvent évoluer.</em>
              </p>
            </div>
            <div className={formulesStyles.formuleCardFooter}>
              <Link to="/inscription" className="btn btn-primary">Manifester mon intérêt →</Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
