import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/StaticPage.module.css';
import formulesStyles from '../styles/FormulesPage.module.css';
import { PageSEO } from '@/components/PageSEO';
import { fetchPublicSessions } from '@/utils/api';
import type { StageType } from '@/types/session';

export function FormulesPage() {
  const { hash } = useLocation();

  const [hasSession, setHasSession] = useState<Record<StageType, boolean>>({
    initiation: false, jouets: false, perfectionnement: false,
  });

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    // Léger délai pour laisser le DOM se rendre
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  useEffect(() => {
    fetchPublicSessions()
      .then(sessions => setHasSession({
        initiation:       sessions.some(s => s.type === 'initiation'       && s.isVisible),
        jouets:           sessions.some(s => s.type === 'jouets'           && s.isVisible),
        perfectionnement: sessions.some(s => s.type === 'perfectionnement' && s.isVisible),
      }))
      .catch(() => {});
  }, []);

  return (
    <main className={styles.page}>
      <PageSEO
        title="Formules & Tarifs — Stage Bois Bretagne"
        description="Formules et tarifs du stage de chantournage à Trébrivan : stage d'initiation (week-end) et stage de perfectionnement (journée)."
        path="/formules"
      />
      <div className={`${styles.inner} ${formulesStyles.inner}`}>
        <p className="section-label">Nos formules</p>
        <h1 className="section-title">Programme et tarifs</h1>

        <p className={formulesStyles.intro}>
          Le tarif comprend l'encadrement, les matériaux de base et un poste de travail individuel.<br />
          <Link to="/hebergement" className={styles.link}>Les repas et l'hébergement</Link> ne sont pas inclus.
        </p>

        {/* ── L'atelier à votre disposition ───────────────────────────────── */}
        <div className={formulesStyles.atelierSection}>
          <p className={formulesStyles.programmeLabel}>L'atelier à votre disposition</p>
          <ul className={styles.list}>
            <li>Perceuse sur colonne et équipements électroportatifs variés</li>
            <li>Présentation et explications sur chaque machine : scie à ruban, combinée, défonceuse</li>
          </ul>
        </div>

        <div className={`${styles.content} ${formulesStyles.content}`}>

          {/* ── Stage d'initiation ───────────────────────────────────────── */}
          <div id="initiation" className={formulesStyles.formuleCard}>
            <div className={formulesStyles.formuleHeader}>
              <div>
                <h2 className={formulesStyles.formuleTitle}>Week-end d'initiation</h2>
                <p className={formulesStyles.formuleDuration}>12 heures</p>
              </div>
              <span className={formulesStyles.formulePrix}>230 €</span>
            </div>
            <div className={formulesStyles.formuleCardBody}>
              <p className={formulesStyles.programmeLabel}>Programme</p>
              <ul className={styles.list}>
                <li>Découverte du matériel et prise en main de la scie à chantourner</li>
                <li>Préparation des gabarits</li>
                <li>Fabrication d'un mobile sur placage fin, méthode de l'équilibrage</li>
                <li>Réalisation d'un puzzle en bois massif, de la conception à la découpe</li>
                <li>Création d'une pièce décorative ajourée en bois massif</li>
                <li>Rencontre avec les principales essences de bois de pays</li>
              </ul>
              <p className={formulesStyles.formuleNote}>
                <em>Chacun choisit, pour chaque exercice, son modèle parmi plusieurs propositions adaptées à tous les niveaux.</em>
              </p>
            </div>
            <div className={formulesStyles.formuleCardFooter}>
              <Link to="/inscription?type=initiation#initiation" className="btn btn-primary">
                {hasSession.initiation ? "Voir les dates & s'inscrire →" : "Manifester mon intérêt →"}
              </Link>
            </div>
          </div>

          {/* ── Stage de jouets ──────────────────────────────────────────── */}
          <div id="jouets" className={formulesStyles.formuleCard}>
            <div className={formulesStyles.formuleHeader}>
              <div>
                <h2 className={formulesStyles.formuleTitle}>Journée de fabrication d'un jouet</h2>
                <p className={formulesStyles.formuleDuration}>7 heures</p>
              </div>
              <span className={formulesStyles.formulePrix}>140 €</span>
            </div>
            <div className={formulesStyles.formuleCardBody}>
              <p className={formulesStyles.programmeLabel}>Programme</p>
              <ul className={styles.list}>
                <li>Fabrication d'un jouet à roulettes</li>
                <li>Mise en œuvre des systèmes d'articulation et de roues</li>
                <li>Teinture, vernis, peinture</li>
                <li>Sensibilisation aux normes de sécurité européennes</li>
                <li>Élaboration d'un cahier des charges</li>
              </ul>
              <p className={formulesStyles.formuleNote}>
                <em>Chacun choisit, pour chaque exercice, son modèle parmi plusieurs propositions adaptées à tous les niveaux.</em>
              </p>
              <p className={formulesStyles.formuleNote}>
                <em>Pré-requis : avoir participé au week-end d'initiation ou maîtriser les bases du chantournage.</em>
              </p>
            </div>
            <div className={formulesStyles.formuleCardFooter}>
              <Link to="/inscription?type=jouets#jouets" className="btn btn-primary">
                {hasSession.jouets ? "Voir les dates & s'inscrire →" : "Manifester mon intérêt →"}
              </Link>
            </div>
          </div>

          {/* ── Journée de perfectionnement ──────────────────────────────── */}
          <div id="perfectionnement" className={formulesStyles.formuleCard}>
            <div className={formulesStyles.formuleHeader}>
              <div>
                <h2 className={formulesStyles.formuleTitle}>Journée de perfectionnement</h2>
                <p className={formulesStyles.formuleDuration}>7 heures</p>
              </div>
              <span className={formulesStyles.formulePrix}>140 €</span>
            </div>
            <div className={formulesStyles.formuleCardBody}>
              <p className={formulesStyles.programmeLabel}>Programme</p>
              <ul className={styles.list}>
                <li>Découpe en 3D — réalisation d'une pièce d'échiquier pour comprendre le principe de la découpe tridimensionnelle</li>
                <li>Découpe conique — réalisation d'un petit village en pyramide</li>
              </ul>
              <p className={formulesStyles.formuleNote}>
                <em>Pré-requis : avoir participé au week-end d'initiation ou maîtriser les bases du chantournage.</em>
              </p>
            </div>
            <div className={formulesStyles.formuleCardFooter}>
              <Link to="/inscription?type=perfectionnement#perfectionnement" className="btn btn-primary">
                {hasSession.perfectionnement ? "Voir les dates & s'inscrire →" : "Manifester mon intérêt →"}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}